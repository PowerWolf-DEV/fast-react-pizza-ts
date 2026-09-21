import { useState, useEffect } from "react";
import { useFetcher, useNavigate, type ActionFunctionArgs } from "react-router";
import { createOrder } from "@/services/apiRestaurant";
import type { Order, OrderDetails } from "@/services/apiRestaurant";
import Button from "@/ui/Button";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { fetchAddress } from "@/features/user/userSlice";
import {
  clearCart,
  getCart,
  getTotalCartPrice,
} from "@/features/cart/cartSlice";
import EmptyCart from "@/features/cart/EmptyCart";
import { formatCurrency } from "@/utils/helpers";

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str: string) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str,
  );

function CreateOrder() {
  const [withPriority, setWithPriority] = useState(false);
  const fetcher = useFetcher();
  const navigate = useNavigate();

  const isSubmitting = fetcher.state === "submitting";

  const {
    username,
    status: addressStatus,
    position,
    address,
    error: addressError,
  } = useAppSelector((state) => state.user);
  const isLoadingAddress = addressStatus === "loading";

  const cart = useAppSelector(getCart);
  const totalCartPrice = useAppSelector(getTotalCartPrice);

  const dispatch = useAppDispatch();

  const priorityPrice = withPriority ? totalCartPrice * 0.2 : 0;
  const totalPrice = totalCartPrice + priorityPrice;

  // Handle successful order creation
  useEffect(() => {
    if (
      fetcher.data &&
      typeof fetcher.data === "object" &&
      "id" in fetcher.data
    ) {
      dispatch(clearCart());
      navigate(`/order/${fetcher.data.id}`);
    }
  }, [fetcher.data, dispatch, navigate]);

  const isErrorResponse =
    fetcher.data && typeof fetcher.data === "object" && "phone" in fetcher.data;

  const phoneError = isErrorResponse ? fetcher.data.phone : undefined;

  if (!cart.length) return <EmptyCart />;

  return (
    <div className="px-4 py-6">
      <h2 className="text-sx mb-8 font-semibold">Ready to order? Let's go!</h2>

      <fetcher.Form method="POST">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40" htmlFor="customer">
            First Name
          </label>
          <div className="grow">
            <input
              className="input"
              type="text"
              name="customer"
              id="customer"
              defaultValue={username}
              required
            />
          </div>
        </div>

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40" htmlFor="phone">
            Phone number
          </label>
          <div className="grow">
            <input
              className="input"
              type="tel"
              name="phone"
              id="phone"
              autoComplete="phone"
              required
            />
            {phoneError && (
              <p className="mt-2 rounded-md bg-red-100 p-2 text-xs text-red-700">
                {phoneError}
              </p>
            )}
          </div>
        </div>

        <div className="relative mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40" htmlFor="address">
            Address
          </label>
          <div className="grow">
            <input
              className="input"
              type="text"
              name="address"
              id="address"
              autoComplete="address"
              disabled={isLoadingAddress}
              defaultValue={address}
              required
            />

            {addressStatus === "error" && (
              <p className="mt-2 rounded-md bg-red-100 p-2 text-xs text-red-700">
                {addressError}
              </p>
            )}
          </div>
          {!position && (
            <span className="absolute top-8.75 right-0.75 z-10 sm:top-0.75 md:top-1.25 md:right-1.25">
              <Button
                disabled={isLoadingAddress}
                type="small"
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(fetchAddress());
                }}
              >
                Get position
              </Button>
            </span>
          )}
        </div>

        <div className="mb-12 flex items-center gap-5">
          <input
            className="h-6 w-6 accent-yellow-400 focus:ring focus:ring-yellow-400 focus:ring-offset-2 focus:outline-none"
            type="checkbox"
            name="priority"
            id="priority"
            checked={withPriority}
            value="true"
            onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label className="font-medium" htmlFor="priority">
            Want to yo give your order priority?
          </label>
        </div>

        <div>
          <input type="hidden" name="cart" value={JSON.stringify(cart)} />
          <input
            type="hidden"
            name="position"
            value={
              position ? `${position.latitude}, ${position.longitude}` : ""
            }
          />

          <Button type="primary" disabled={isSubmitting || isLoadingAddress}>
            {isSubmitting
              ? "Placing order..."
              : `Order now for ${formatCurrency(totalPrice)}`}
          </Button>
        </div>
      </fetcher.Form>
    </div>
  );
}

async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const cartValue = formData.get("cart");
  const customerValue = formData.get("customer");
  const addressValue = formData.get("address");
  const phoneValue = formData.get("phone");

  if (!cartValue || !customerValue || !addressValue || !phoneValue) {
    throw new Error("Missing required form fields");
  }

  const data = Object.fromEntries(formData) as Record<string, string>;
  const order: Order = {
    customer: data.customer,
    address: data.address,
    phone: data.phone,
    position: data.position,
    cart: JSON.parse(data.cart),
    priority: data.priority === "true",
  };

  // Handle potential errors
  const errors: Record<string, string> = {};
  if (!isValidPhone(order.phone))
    errors.phone =
      "Please give us your correct phone number. We might need it to contact you.";

  if (Object.keys(errors).length > 0) return errors;

  // If everything is okay, create new order and redirect
  const createdOrder: OrderDetails = await createOrder(order);

  return createdOrder;
}

CreateOrder.action = action;

export default CreateOrder;
