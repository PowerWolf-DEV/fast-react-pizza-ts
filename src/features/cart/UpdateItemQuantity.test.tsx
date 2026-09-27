import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import { decreaseItemQuantity, increaseItemQuantity } from "./cartSlice";
import UpdateItemQuantity from "./UpdateItemQuantity";

const createTestStore = (preloadedState = { cart: [] }) => {
  return configureStore({
    reducer: { cart: cartReducer },
    preloadedState: { cart: preloadedState },
  });
};

describe("UpdateItemQuantity", () => {
  it("renders quantity and +/- buttons", () => {
    const store = createTestStore();
    render(
      <Provider store={store}>
        <UpdateItemQuantity id={1} currentQuantity={2} />
      </Provider>,
    );
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /-/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /\+/i })).toBeInTheDocument();
  });

  it("dispatches decreaseItemQuantity when - clicked", () => {
    const store = createTestStore();
    const dispatchSpy = vi.spyOn(store, "dispatch");
    render(
      <Provider store={store}>
        <UpdateItemQuantity id={1} currentQuantity={2} />
      </Provider>,
    );
    fireEvent.click(screen.getByRole("button", { name: /-/i }));
    expect(dispatchSpy).toHaveBeenCalledWith(decreaseItemQuantity(1));
  });

  it("dispatches increaseItemQuantity when + clicked", () => {
    const store = createTestStore();
    const dispatchSpy = vi.spyOn(store, "dispatch");
    render(
      <Provider store={store}>
        <UpdateItemQuantity id={1} currentQuantity={2} />
      </Provider>,
    );
    fireEvent.click(screen.getByRole("button", { name: /\+/i }));
    expect(dispatchSpy).toHaveBeenCalledWith(increaseItemQuantity(1));
  });

  it("uses correct button types", () => {
    const store = createTestStore();
    render(
      <Provider store={store}>
        <UpdateItemQuantity id={1} currentQuantity={2} />
      </Provider>,
    );
    const minusBtn = screen.getByRole("button", { name: /-/i });
    const plusBtn = screen.getByRole("button", { name: /\+/i });
    expect(minusBtn).toHaveClass("px-2.5");
    expect(plusBtn).toHaveClass("px-2.5");
  });

  it("displays current quantity correctly", () => {
    const store = createTestStore();
    render(
      <Provider store={store}>
        <UpdateItemQuantity id={1} currentQuantity={5} />
      </Provider>,
    );
    expect(screen.getByText("5")).toBeInTheDocument();
  });
});
