import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Pagination from "../components/Pagination";

// Mock the Lucide icons
vi.mock("lucide-react", () => ({
  ChevronLeft: () => <div data-testid="chevron-left">ChevronLeft</div>,
  ChevronRight: () => <div data-testid="chevron-right">ChevronRight</div>,
}));

describe("Pagination", () => {
  const mockOnPageChange = vi.fn();

  it("renders correctly with given props", () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    expect(screen.getByText("Page 2 of 5")).toBeTruthy();
    expect(screen.getByTestId("chevron-left")).toBeTruthy();
    expect(screen.getByTestId("chevron-right")).toBeTruthy();
  });

  it("disables previous button on first page", () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    const prevButton = screen.getByTestId("chevron-left").parentElement;
    expect(prevButton).toBeDisabled();
  });

  it("disables next button on last page", () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    const nextButton = screen.getByTestId("chevron-right").parentElement;
    expect(nextButton).toBeDisabled();
  });

  it("calls onPageChange with correct value when previous button is clicked", () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    const prevButton = screen.getByTestId("chevron-left").parentElement;
    fireEvent.click(prevButton!);

    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  it("calls onPageChange with correct value when next button is clicked", () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    const nextButton = screen.getByTestId("chevron-right").parentElement;
    fireEvent.click(nextButton!);

    expect(mockOnPageChange).toHaveBeenCalledWith(4);
  });

  it("applies correct classes to buttons", () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    const prevButton = screen.getByTestId("chevron-left").parentElement;
    const nextButton = screen.getByTestId("chevron-right").parentElement;

    expect(prevButton).toHaveClass("p-2", "rounded-full", "hover:bg-gray-200");
    expect(nextButton).toHaveClass("p-2", "rounded-full", "hover:bg-gray-200");
  });

  it("applies disabled classes to buttons when appropriate", () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={1}
        onPageChange={mockOnPageChange}
      />
    );

    const prevButton = screen.getByTestId("chevron-left").parentElement;
    const nextButton = screen.getByTestId("chevron-right").parentElement;

    expect(prevButton).toHaveClass(
      "disabled:opacity-50",
      "disabled:cursor-not-allowed"
    );
    expect(nextButton).toHaveClass(
      "disabled:opacity-50",
      "disabled:cursor-not-allowed"
    );
  });
});
