import type { CartItem } from "@/features/cart/cartSlice";

const API_URL = "https://react-fast-pizza-api.jonas.io/api";

export type Pizza = {
  id: number;
  name: string;
  unitPrice: number;
  imageUrl: string;
  ingredients: string[];
  soldOut: boolean;
};

export type Order = {
  cart: CartItem[];
  customer: string;
  address: string;
  phone: string;
  priority: boolean;
  position: string;
};

export type OrderDetails = Order & {
  id: string;
  estimatedDelivery: string;
  orderPrice: number;
  priorityPrice: number;
  createdAt: string;
  status: "preparing" | "delivered";
};

export async function getMenu(): Promise<Pizza[]> {
  const res = await fetch(`${API_URL}/menu`);

  // fetch won't throw error on 400 errors (e.g. when URL is wrong), so we need to do it manually. This will then go into the catch block, where the message is set
  if (!res.ok) throw Error("Failed getting menu");

  const { data } = await res.json();
  return data;
}

export async function getOrder(id: string): Promise<OrderDetails> {
  const res = await fetch(`${API_URL}/order/${id}`);
  if (!res.ok) throw Error(`Couldn't find order #${id}`);

  const { data } = await res.json();
  return data;
}

export async function createOrder(newOrder: Order): Promise<OrderDetails> {
  try {
    const res = await fetch(`${API_URL}/order`, {
      method: "POST",
      body: JSON.stringify(newOrder),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) throw Error();
    const { data } = await res.json();
    return data;
  } catch {
    throw Error("Failed creating your order");
  }
}

export async function updateOrder(id: string, updateObj: Partial<Order>) {
  try {
    const res = await fetch(`${API_URL}/order/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updateObj),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Request failed with status: ${res.status}`, {
        cause: res,
      });
    }
    // We don't need the data, so we don't return anything
  } catch (err) {
    throw Error("Failed updating your order", { cause: err });
  }
}
