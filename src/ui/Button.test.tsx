import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import Button from "./Button";

describe("Button", () => {
  it("renders as button with onClick", () => {
    const handleClick = vi.fn();
    render(
      <Button onClick={handleClick} type="primary">
        Click me
      </Button>,
    );
    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("renders as Link when to prop is provided", () => {
    render(
      <MemoryRouter>
        <Button to="/test" type="primary">
          Link
        </Button>
      </MemoryRouter>,
    );
    const link = screen.getByRole("link", { name: /link/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/test");
  });

  it("applies disabled state", () => {
    render(
      <Button type="primary" disabled>
        Disabled
      </Button>,
    );
    const button = screen.getByRole("button", { name: /disabled/i });
    expect(button).toBeDisabled();
  });

  it("renders different variants", () => {
    const { rerender } = render(
      <Button type="primary" onClick={() => {}}>
        Primary
      </Button>,
    );
    expect(screen.getByRole("button")).toHaveClass("bg-yellow-400");

    rerender(
      <Button type="secondary" onClick={() => {}}>
        Secondary
      </Button>,
    );
    expect(screen.getByRole("button")).toHaveClass("border-2");

    rerender(
      <Button type="small" onClick={() => {}}>
        Small
      </Button>,
    );
    expect(screen.getByRole("button")).toHaveClass("text-xs");

    rerender(
      <Button type="round" onClick={() => {}}>
        Round
      </Button>,
    );
    expect(screen.getByRole("button")).toHaveClass("px-2.5");
  });
});
