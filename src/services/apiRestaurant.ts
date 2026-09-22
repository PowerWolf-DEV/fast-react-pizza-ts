import type { CartItem } from "@/features/cart/cartSlice";

const API_URL = import.meta.env.VITE_API_URL ?? "https://react-fast-pizza-api.jonas.io/api";

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
  try {
    const res = await fetch(`${API_URL}/menu`);
    if (!res.ok) {
      throw new Error(`Request failed with status: ${res.status}`, {
        cause: res,
      });
    }
    const { data } = await res.json();
    return data;
  } catch (err) {
    throw new Error("Failed getting menu", { cause: err });
  }
}

export async function getOrder(id: string): Promise<OrderDetails> {
  try {
    const res = await fetch(`${API_URL}/order/${id}`);
    if (!res.ok) {
      throw new Error(`Request failed with status: ${res.status}`, {
        cause: res,
      });
    }
    const { data } = await res.json();
    return data;
  } catch (err) {
    throw new Error(`Couldn't find order #${id}`, { cause: err });
  }
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

    if (!res.ok) {
      throw new Error(`Request failed with status: ${res.status}`, {
        cause: res,
      });
    }
    const { data } = await res.json();
    return data;
  } catch (err) {
    throw new Error("Failed creating your order", { cause: err });
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
