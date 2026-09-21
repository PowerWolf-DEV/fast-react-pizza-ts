import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "@/features/cart/cartSlice";
import userReducer from "@/features/user/userSlice";
import { addItem } from "@/features/cart/cartSlice";
import MenuItem from "./MenuItem";
import type { Pizza } from "@/services/apiRestaurant";

const mockPizza: Pizza = {
  id: 1,
  name: "Test Pizza",
  unitPrice: 10,
  imageUrl: "/test.jpg",
  ingredients: ["tomato", "cheese"],
  soldOut: false,
};

const createTestStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      cart: cartReducer,
      user: userReducer,
    },
    preloadedState: {
      cart: { cart: [] },
      user: {
        username: "",
        status: "idle",
        position: null,
        address: "",
        error: "",
      },
      ...preloadedState,
    },
  });
};

const renderWithStore = (
  store: ReturnType<typeof createTestStore>,
  component: React.ReactElement,
) => {
  return render(<Provider store={store}>{component}</Provider>);
};

describe("MenuItem", () => {
  it("renders pizza name, price, and ingredients", () => {
    const store = createTestStore();
    renderWithStore(store, <MenuItem pizza={mockPizza} />);
    expect(screen.getByText("Test Pizza")).toBeInTheDocument();
    expect(screen.getByText("€10.00")).toBeInTheDocument();
    expect(screen.getByText("tomato, cheese")).toBeInTheDocument();
  });

  it('shows "Sold out" when soldOut is true', () => {
    const store = createTestStore();
    renderWithStore(
      store,
      <MenuItem pizza={{ ...mockPizza, soldOut: true }} />,
    );
    expect(screen.getByText("Sold out")).toBeInTheDocument();
    expect(screen.queryByText("€10.00")).not.toBeInTheDocument();
  });

  it('shows "Add to cart" button when not in cart', () => {
    const store = createTestStore();
    renderWithStore(store, <MenuItem pizza={mockPizza} />);
    expect(
      screen.getByRole("button", { name: /add to cart/i }),
    ).toBeInTheDocument();
  });

  it("shows quantity controls when item is in cart", () => {
    const store = createTestStore({
      cart: {
        cart: [{ ...mockPizza, pizzaId: 1, quantity: 2, totalPrice: 20 }],
      },
    });
    renderWithStore(store, <MenuItem pizza={mockPizza} />);
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /-/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /\+/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
  });

  it('dispatches addItem when "Add to cart" is clicked', () => {
    const store = createTestStore();
    const dispatchSpy = vi.spyOn(store, "dispatch");
    renderWithStore(store, <MenuItem pizza={mockPizza} />);
    fireEvent.click(screen.getByRole("button", { name: /add to cart/i }));
    expect(dispatchSpy).toHaveBeenCalledWith(
      addItem(
        expect.objectContaining({
          pizzaId: 1,
          name: "Test Pizza",
          quantity: 1,
          unitPrice: 10,
          totalPrice: 10,
        }),
      ),
    );
  });

  it("renders image with correct src and alt", () => {
    const store = createTestStore();
    renderWithStore(store, <MenuItem pizza={mockPizza} />);
    const img = screen.getByAltText("Test Pizza");
    expect(img).toHaveAttribute("src", "/test.jpg");
  });
});
