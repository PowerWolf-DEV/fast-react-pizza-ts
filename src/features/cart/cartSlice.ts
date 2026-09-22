import { createSlice, type PayloadAction, createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/store";

// API requires CartItem to have pizzaId instead of id
export type CartItem = {
  pizzaId: number;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
};

const initialState: { cart: CartItem[] } = {
  cart: [],
};

function removeItem(state: { cart: CartItem[] }, pizzaId: number) {
  state.cart = state.cart.filter((item) => item.pizzaId !== pizzaId);
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<CartItem>) {
      state.cart.push(action.payload);
    },
    deleteItem(state, action: PayloadAction<number>) {
      removeItem(state, action.payload);
    },
    increaseItemQuantity(state, action: PayloadAction<number>) {
      const item = state.cart.find((item) => item.pizzaId === action.payload);
      if (item) {
        item.quantity++;
        item.totalPrice = item.quantity * item.unitPrice;
      }
    },
    decreaseItemQuantity(state, action: PayloadAction<number>) {
      const item = state.cart.find((item) => item.pizzaId === action.payload);
      if (item) {
        item.quantity--;
        item.totalPrice = item.quantity * item.unitPrice;

        if (item.quantity === 0) {
          removeItem(state, action.payload);
        }
      }
    },
    clearCart(state) {
      state.cart = [];
    },
  },
});

export const {
  addItem,
  deleteItem,
  increaseItemQuantity,
  decreaseItemQuantity,
  clearCart,
} = cartSlice.actions;

export const getCart = (state: RootState) => state.cart.cart;

export const getTotalCartQuantity = (state: RootState): number =>
  state.cart.cart.reduce((sum, item) => sum + item.quantity, 0);

export const getTotalCartPrice = (state: RootState): number =>
  state.cart.cart.reduce((sum, item) => sum + item.totalPrice, 0);

const selectCartItems = (state: RootState) => state.cart.cart;

export const getCurrentQuantityById = (id: number) =>
  createSelector([selectCartItems], (items) =>
    items.find((item) => item.pizzaId === id)?.quantity ?? 0,
  );

export default cartSlice.reducer;
