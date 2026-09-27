import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import { deleteItem } from "./cartSlice";
import DeleteCartItem from "./DeleteCartItem";

const createTestStore = (preloadedState = { cart: [] }) => {
  return configureStore({
    reducer: { cart: cartReducer },
    preloadedState: { cart: preloadedState },
  });
};

// The cart slice expects state shape: { cart: CartItem[] }
// preloadedState should be { cart: CartItem[] }

describe("DeleteCartItem", () => {
  it("renders delete button", () => {
    const store = createTestStore();
    render(
      <Provider store={store}>
        <DeleteCartItem id={1} />
      </Provider>,
    );
    expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
  });

  it("dispatches deleteItem when clicked", () => {
    const store = createTestStore();
    const dispatchSpy = vi.spyOn(store, "dispatch");
    render(
      <Provider store={store}>
        <DeleteCartItem id={1} />
      </Provider>,
    );
    fireEvent.click(screen.getByRole("button", { name: /delete/i }));
    expect(dispatchSpy).toHaveBeenCalledWith(deleteItem(1));
  });

  it("uses correct button type", () => {
    const store = createTestStore();
    render(
      <Provider store={store}>
        <DeleteCartItem id={1} />
      </Provider>,
    );
    const button = screen.getByRole("button", { name: /delete/i });
    expect(button).toHaveClass("px-4");
  });
});
