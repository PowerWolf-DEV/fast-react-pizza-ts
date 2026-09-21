import { useAppDispatch } from "@/hooks";
import Button from "@/ui/Button";
import { deleteItem } from "./cartSlice";

function DeleteCartItem({ id }: { id: number }) {
  const dispatch = useAppDispatch();
  return (
    <Button onClick={() => dispatch(deleteItem(id))} type="small">
      Delete
    </Button>
  );
}

export default DeleteCartItem;
