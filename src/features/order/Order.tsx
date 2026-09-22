// Test ID: IIDSAT

import {
  useLoaderData,
  redirect,
  type LoaderFunctionArgs,
} from "react-router";
import { getOrder } from "@/services/apiRestaurant";
import { getMenu } from "@/services/apiRestaurant";
import type { OrderDetails, Pizza } from "@/services/apiRestaurant";
import { calcMinutesLeft, formatCurrency, formatDate } from "@/utils/helpers";
import OrderItem from "./OrderItem";
import { useEffect, useState } from "react";
import UpdateOrder from "./UpdateOrder";

let menuCache: Pizza[] | null = null;

async function fetchMenuOnce(): Promise<Pizza[]> {
  if (menuCache) return menuCache;
  menuCache = await getMenu();
  return menuCache;
}

function Order() {
  const order: OrderDetails = useLoaderData();
  const [menu, setMenu] = useState<Pizza[] | null>(null);
  const [isLoadingMenu, setIsLoadingMenu] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchMenuOnce()
      .then((data) => {
        if (!cancelled) {
          setMenu(data);
          setIsLoadingMenu(false);
        }
      })
      .catch(() => {
        if (!cancelled) setIsLoadingMenu(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const {
    id,
    status,
    priority,
    priorityPrice,
    orderPrice,
    estimatedDelivery,
    cart,
  } = order;
  const deliveryIn = calcMinutesLeft(estimatedDelivery);

  return (
    <div className="space-y-8 px-4 py-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-semibold">Order #{id} status</h2>

        <div className="space-x-2">
          {priority && (
            <span className="rounded-full bg-red-500 px-3 py-1 text-sm font-semibold tracking-wide text-red-50 uppercase">
              Priority
            </span>
          )}
          <span className="rounded-full bg-green-500 px-3 py-1 text-sm font-semibold tracking-wide text-green-50 uppercase">
            {status} order
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 bg-stone-200 px-6 py-5">
        <p className="font-medium">
          {deliveryIn >= 0
            ? `Only ${calcMinutesLeft(estimatedDelivery)} minutes left 😃`
            : "Order should have arrived"}
        </p>
        <p className="text-xs text-stone-500">
          (Estimated delivery: {formatDate(estimatedDelivery)})
        </p>
      </div>

      <ul className="divide-y divide-stone-200 border-y border-stone-200">
        {cart.map((item) => (
          <OrderItem
            item={item}
            key={item.pizzaId}
            isLoadingIngredients={isLoadingMenu}
            ingredients={
              menu?.find((pizza: Pizza) => pizza.id === item.pizzaId)?.ingredients ??
              []
            }
          />
        ))}
      </ul>

      <div className="space-y-2 bg-stone-200 px-6 py-5">
        <p className="text-sm font-medium text-stone-600">
          Price pizza: {formatCurrency(orderPrice)}
        </p>
        {priority && (
          <p className="text-sm font-medium text-stone-600">
            Price priority: {formatCurrency(priorityPrice)}
          </p>
        )}
        <p className="font-bold">
          To pay on delivery: {formatCurrency(orderPrice + priorityPrice)}
        </p>
      </div>

      {!priority && <UpdateOrder />}
    </div>
  );
}

async function loader({ params }: LoaderFunctionArgs) {
  const { orderId } = params;
  if (!orderId) {
    return redirect("/");
  }

  const order: OrderDetails = await getOrder(orderId);
  return order;
}

Order.loader = loader;

export default Order;