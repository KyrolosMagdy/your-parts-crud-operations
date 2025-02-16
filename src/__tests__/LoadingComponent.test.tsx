import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import LoadingComponent from "../components/LoadingSpinner";

describe("LoadingComponent", () => {
  it("renders nothing when isLoading is false", () => {
    const { container } = render(<LoadingComponent isLoading={false} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders the spinner when isLoading is true", () => {
    render(<LoadingComponent isLoading={true} />);

    const spinner = screen.getByRole("status");
    expect(spinner).toBeTruthy();
    expect(spinner).toHaveClass("animate-spin");
    expect(spinner).toHaveClass("rounded-full");
    expect(spinner).toHaveClass("h-32");
    expect(spinner).toHaveClass("w-32");
    expect(spinner).toHaveClass("border-t-2");
    expect(spinner).toHaveClass("border-b-2");
    expect(spinner).toHaveClass("border-white");
  });

  it("renders the spinner with correct styles", () => {
    render(<LoadingComponent isLoading={true} />);

    const overlay = screen.getByTestId("loading-overlay");
    expect(overlay).toHaveClass("fixed");
    expect(overlay).toHaveClass("inset-0");
    expect(overlay).toHaveClass("bg-gray-500");
    expect(overlay).toHaveClass("bg-opacity-75");
    expect(overlay).toHaveClass("flex");
    expect(overlay).toHaveClass("items-center");
    expect(overlay).toHaveClass("justify-center");
    expect(overlay).toHaveClass("z-50");
  });

  it("applies correct inline styles to the spinner", () => {
    render(<LoadingComponent isLoading={true} />);

    const spinner = screen.getByRole("status");
    expect(spinner).toHaveStyle("color: rgb(255, 255, 255)");
  });
});
