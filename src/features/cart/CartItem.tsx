import { formatCurrency } from "@/utils/helpers";
import type { CartItem as Item } from "@/features/cart/cartSlice";
import DeleteCartItem from "./DeleteCartItem";
import UpdateItemQuantity from "./UpdateItemQuantity";

function CartItem({ item }: { item: Item }) {
  const { pizzaId, name, quantity, totalPrice } = item;

  return (
    <li className="py-3 sm:flex sm:items-center sm:justify-between">
      <p className="mt-1 sm:mb-0">
        {quantity}&times; {name}
      </p>
      <div className="flex items-center justify-between sm:gap-6">
        <p className="text-sm font-bold">{formatCurrency(totalPrice)}</p>
        <UpdateItemQuantity id={pizzaId} currentQuantity={quantity} />
        <DeleteCartItem id={pizzaId} />
      </div>
    </li>
  );
}

export default CartItem;
