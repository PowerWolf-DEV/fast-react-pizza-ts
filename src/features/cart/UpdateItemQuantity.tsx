import { useAppDispatch } from "../../hooks";
import Button from "../../ui/Button";
import { decreaseItemQuantity, increaseItemQuantity } from "./cartSlice";

function UpdateItemQuantity({
  id,
  currentQuantity,
}: {
  id: number;
  currentQuantity: number;
}) {
  const dispatch = useAppDispatch();
  return (
    <div className="flex items-center gap-2 md:gap-3">
      <Button onClick={() => dispatch(decreaseItemQuantity(id))} type="round">
        -
      </Button>
      <span className="text-sm font-medium">{currentQuantity}</span>
      <Button onClick={() => dispatch(increaseItemQuantity(id))} type="round">
        +
      </Button>
    </div>
  );
}

export default UpdateItemQuantity;
