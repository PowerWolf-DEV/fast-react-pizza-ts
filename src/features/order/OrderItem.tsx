import { formatCurrency } from "@/utils/helpers";
import type { CartItem } from "@/features/cart/cartSlice";

type OrderItemProps = {
  item: CartItem;
  isLoadingIngredients: boolean;
  ingredients: string[];
};

function OrderItem({
  item,
  isLoadingIngredients,
  ingredients,
}: OrderItemProps) {
  const { quantity, name, totalPrice } = item;

  return (
    <li className="space-y-1 py-3">
      <div className="flex items-center justify-between gap-4 text-sm">
        <p>
          <span className="font-bold">{quantity}&times;</span> {name}
        </p>
        <p className="font-bold">{formatCurrency(totalPrice)}</p>
      </div>
      <p className="text-sm text-stone-500 capitalize italic">
        {isLoadingIngredients ? "Loading" : ingredients.join(", ")}
      </p>
    </li>
  );
}

export default OrderItem;
