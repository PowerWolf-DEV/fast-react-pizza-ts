import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getMenu, getOrder, createOrder, updateOrder } from "./apiRestaurant";
import type { Order, OrderDetails, Pizza } from "./apiRestaurant";

const mockPizzas: Pizza[] = [
  {
    id: 1,
    name: "Margherita",
    unitPrice: 10,
    imageUrl: "/margherita.jpg",
    ingredients: ["tomato", "mozzarella", "basil"],
    soldOut: false,
  },
  {
    id: 2,
    name: "Pepperoni",
    unitPrice: 12,
    imageUrl: "/pepperoni.jpg",
    ingredients: ["tomato", "mozzarella", "pepperoni"],
    soldOut: true,
  },
];

const mockOrder: Order = {
  cart: [
    {
      pizzaId: 1,
      name: "Margherita",
      quantity: 2,
      unitPrice: 10,
      totalPrice: 20,
    },
  ],
  customer: "John Doe",
  address: "123 Main St",
  phone: "+1234567890",
  priority: false,
  position: "40.7128,-74.0060",
};

const mockOrderDetails: OrderDetails = {
  ...mockOrder,
  id: "order-123",
  estimatedDelivery: "2024-01-15T14:30:00.000Z",
  orderPrice: 20,
  priorityPrice: 0,
  createdAt: "2024-01-15T14:00:00.000Z",
  status: "preparing",
};

describe("apiRestaurant", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  describe("getMenu", () => {
    it("fetches and returns menu data", async () => {
      const mockResponse = { data: mockPizzas };
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await getMenu();

      expect(fetch).toHaveBeenCalledWith(expect.stringContaining("/menu"));
      expect(result).toEqual(mockPizzas);
    });

    it("throws error when response is not ok", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      });

      await expect(getMenu()).rejects.toThrow("Failed getting menu");
    });

    it("wraps network errors with cause", async () => {
      const networkError = new Error("Network error");
      global.fetch = vi.fn().mockRejectedValue(networkError);

      try {
        await getMenu();
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe("Failed getting menu");
        expect((error as Error).cause).toBe(networkError);
      }
    });
  });

  describe("getOrder", () => {
    it("fetches and returns order details", async () => {
      const mockResponse = { data: mockOrderDetails };
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await getOrder("order-123");

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/order/order-123"),
      );
      expect(result).toEqual(mockOrderDetails);
    });

    it("throws error when order not found", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
      });

      await expect(getOrder("nonexistent")).rejects.toThrow(
        "Couldn't find order #nonexistent",
      );
    });

    it("wraps network errors with cause", async () => {
      const networkError = new Error("Network error");
      global.fetch = vi.fn().mockRejectedValue(networkError);

      try {
        await getOrder("order-123");
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe("Couldn't find order #order-123");
        expect((error as Error).cause).toBe(networkError);
      }
    });
  });

  describe("createOrder", () => {
    it("creates and returns order details", async () => {
      const mockResponse = { data: mockOrderDetails };
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await createOrder(mockOrder);

      expect(fetch).toHaveBeenCalledWith(expect.stringContaining("/order"), {
        method: "POST",
        body: JSON.stringify(mockOrder),
        headers: { "Content-Type": "application/json" },
      });
      expect(result).toEqual(mockOrderDetails);
    });

    it("throws error when creation fails", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
      });

      await expect(createOrder(mockOrder)).rejects.toThrow(
        "Failed creating your order",
      );
    });

    it("wraps network errors with cause", async () => {
      const networkError = new Error("Network error");
      global.fetch = vi.fn().mockRejectedValue(networkError);

      try {
        await createOrder(mockOrder);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe("Failed creating your order");
        expect((error as Error).cause).toBe(networkError);
      }
    });
  });

  describe("updateOrder", () => {
    it("updates order and returns nothing", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
      });

      await updateOrder("order-123", { priority: true });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/order/order-123"),
        {
          method: "PATCH",
          body: JSON.stringify({ priority: true }),
          headers: { "Content-Type": "application/json" },
        },
      );
    });

    it("throws error when update fails", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
      });

      try {
        await updateOrder("order-123", { priority: true });
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe("Failed updating your order");
      }
    });

    it("wraps network errors with cause", async () => {
      const networkError = new Error("Network error");
      global.fetch = vi.fn().mockRejectedValue(networkError);

      try {
        await updateOrder("order-123", { priority: true });
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe("Failed updating your order");
        expect((error as Error).cause).toBe(networkError);
      }
    });
  });
});
