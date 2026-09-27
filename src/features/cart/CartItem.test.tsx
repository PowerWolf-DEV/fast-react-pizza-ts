import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import CartItem from "./CartItem";

const mockCartItem = {
  pizzaId: 1,
  name: "Test Pizza",
  quantity: 2,
  unitPrice: 10,
  totalPrice: 20,
};

const createTestStore = (preloadedState = { cart: [] }) => {
  return configureStore({
    reducer: { cart: cartReducer },
    preloadedState: { cart: preloadedState },
  });
};

describe("CartItem", () => {
  it("renders quantity, name, and total price", () => {
    const store = createTestStore();
    render(
      <Provider store={store}>
        <CartItem item={mockCartItem} />
      </Provider>,
    );
    expect(screen.getByText("2× Test Pizza")).toBeInTheDocument();
    expect(screen.getByText("€20.00")).toBeInTheDocument();
  });

  it("renders UpdateItemQuantity with correct props", () => {
    const store = createTestStore();
    render(
      <Provider store={store}>
        <CartItem item={mockCartItem} />
      </Provider>,
    );
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /-/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /\+/i })).toBeInTheDocument();
  });

  it("renders DeleteCartItem with correct id", () => {
    const store = createTestStore();
    render(
      <Provider store={store}>
        <CartItem item={mockCartItem} />
      </Provider>,
    );
    expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
  });

  it("displays correct total price for different quantities", () => {
    const store = createTestStore();
    const item = { ...mockCartItem, quantity: 3, totalPrice: 30 };
    render(
      <Provider store={store}>
        <CartItem item={item} />
      </Provider>,
    );
    expect(screen.getByText("3× Test Pizza")).toBeInTheDocument();
    expect(screen.getByText("€30.00")).toBeInTheDocument();
  });
});
