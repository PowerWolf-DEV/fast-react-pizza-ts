import { useFetcher, type LoaderFunctionArgs } from "react-router";
import { updateOrder } from "@/services/apiRestaurant";
import Button from "@/ui/Button";

function UpdateOrder() {
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";

  return (
    <fetcher.Form method="PATCH" className="text-right">
      <Button disabled={isSubmitting} type="primary">
        Make priority
      </Button>
    </fetcher.Form>
  );
}

async function action({ params }: LoaderFunctionArgs) {
  const data = { priority: true };
  const { orderId } = params;

  if (!orderId) throw new Error("Order ID is required");

  await updateOrder(orderId, data);
}

UpdateOrder.action = action;

export default UpdateOrder;
