import LinkButton from "@/ui/LinkButton";
import Button from "@/ui/Button";
import CartItem from "./CartItem";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { getCart, clearCart } from "./cartSlice";
import { getUsername } from "@/features/user/userSlice";
import EmptyCart from "./EmptyCart";

function Cart() {
  const username = useAppSelector(getUsername);
  const cart = useAppSelector(getCart);

  const dispatch = useAppDispatch();

  if (!cart.length) return <EmptyCart />;

  return (
    <div className="px-4 py-3">
      <LinkButton to="/menu">&larr; Back to menu</LinkButton>

      <h2 className="mt-7 text-xl font-semibold">Your cart, {username}</h2>

      <ul className="mt-3 divide-y divide-stone-200 border-b border-stone-200">
        {cart.map((item) => (
          <CartItem item={item} key={item.pizzaId} />
        ))}
      </ul>

      <div className="mt-6 space-x-2">
        <Button type="primary" to="/order/new">
          Order pizzas
        </Button>
        <Button type="secondary" onClick={() => dispatch(clearCart())}>
          Clear cart
        </Button>
      </div>
    </div>
  );
}

export default Cart;
