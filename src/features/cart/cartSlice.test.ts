import { describe, it, expect } from "vitest";
import cartReducer, {
  addItem,
  deleteItem,
  increaseItemQuantity,
  decreaseItemQuantity,
  clearCart,
  getCart,
  getTotalCartQuantity,
  getTotalCartPrice,
  getCurrentQuantityById,
} from "./cartSlice";
import type { CartItem } from "./cartSlice";

const mockPizza: CartItem = {
  pizzaId: 1,
  name: "Test Pizza",
  quantity: 1,
  unitPrice: 10,
  totalPrice: 10,
};

const mockState = { cart: [] as CartItem[] };

describe("cartSlice", () => {
  describe("reducers", () => {
    it("should add item to cart", () => {
      const state = cartReducer(mockState, addItem(mockPizza));
      expect(state.cart).toHaveLength(1);
      expect(state.cart[0]).toEqual(mockPizza);
    });

    it("should delete item from cart", () => {
      const stateWithItem = cartReducer(mockState, addItem(mockPizza));
      const state = cartReducer(stateWithItem, deleteItem(1));
      expect(state.cart).toHaveLength(0);
    });

    it("should increase item quantity", () => {
      let state = cartReducer(mockState, addItem(mockPizza));
      state = cartReducer(state, increaseItemQuantity(1));
      expect(state.cart[0].quantity).toBe(2);
      expect(state.cart[0].totalPrice).toBe(20);
    });

    it("should decrease item quantity", () => {
      let state = cartReducer(
        mockState,
        addItem({ ...mockPizza, quantity: 2, totalPrice: 20 }),
      );
      state = cartReducer(state, decreaseItemQuantity(1));
      expect(state.cart[0].quantity).toBe(1);
      expect(state.cart[0].totalPrice).toBe(10);
    });

    it("should remove item when quantity reaches 0", () => {
      let state = cartReducer(mockState, addItem(mockPizza));
      state = cartReducer(state, decreaseItemQuantity(1));
      expect(state.cart).toHaveLength(0);
    });

    it("should clear cart", () => {
      let state = cartReducer(mockState, addItem(mockPizza));
      state = cartReducer(state, clearCart());
      expect(state.cart).toHaveLength(0);
    });

    it("should not crash when increasing quantity of non-existent item", () => {
      const state = cartReducer(mockState, increaseItemQuantity(999));
      expect(state.cart).toHaveLength(0);
    });

    it("should not crash when decreasing quantity of non-existent item", () => {
      const state = cartReducer(mockState, decreaseItemQuantity(999));
      expect(state.cart).toHaveLength(0);
    });

    it("should not crash when decreasing quantity of item not in cart", () => {
      const stateWithItem = cartReducer(mockState, addItem(mockPizza));
      const state = cartReducer(stateWithItem, decreaseItemQuantity(999));
      expect(state.cart).toHaveLength(1);
      expect(state.cart[0].quantity).toBe(1);
    });
  });

  describe("selectors", () => {
    const createState = (items: CartItem[]) => ({ cart: { cart: items } });

    it("getCart should return cart items", () => {
      const state = createState([mockPizza]);
      expect(getCart(state)).toEqual([mockPizza]);
    });

    it("getTotalCartQuantity should sum quantities", () => {
      const state = createState([
        { ...mockPizza, pizzaId: 1, quantity: 2 },
        { ...mockPizza, pizzaId: 2, quantity: 3 },
      ]);
      expect(getTotalCartQuantity(state)).toBe(5);
    });

    it("getTotalCartPrice should sum total prices", () => {
      const state = createState([
        { ...mockPizza, pizzaId: 1, totalPrice: 20 },
        { ...mockPizza, pizzaId: 2, totalPrice: 30 },
      ]);
      expect(getTotalCartPrice(state)).toBe(50);
    });

    it("getCurrentQuantityById should return quantity for specific pizza", () => {
      const state = createState([
        { ...mockPizza, pizzaId: 1, quantity: 2 },
        { ...mockPizza, pizzaId: 2, quantity: 3 },
      ]);
      expect(getCurrentQuantityById(1)(state)).toBe(2);
      expect(getCurrentQuantityById(2)(state)).toBe(3);
      expect(getCurrentQuantityById(999)(state)).toBe(0);
    });
  });
});
