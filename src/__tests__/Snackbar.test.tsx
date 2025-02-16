import { render, screen, fireEvent, act } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import Snackbar from "../components/Snackbar";

// Mock the Lucide icon
vi.mock("lucide-react", () => ({
  X: () => <div data-testid="close-icon">X</div>,
}));

describe("Snackbar", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders nothing when not visible", () => {
    const { container } = render(
      <Snackbar message="Test message" isVisible={false} onClose={() => {}} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders the message when visible", () => {
    render(
      <Snackbar message="Test message" isVisible={true} onClose={() => {}} />
    );
    expect(screen.getByText("Test message")).toBeTruthy();
  });

  it("calls onClose when close button is clicked", () => {
    const mockOnClose = vi.fn();
    render(
      <Snackbar message="Test message" isVisible={true} onClose={mockOnClose} />
    );

    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("automatically closes after 9 seconds", () => {
    const mockOnClose = vi.fn();
    render(
      <Snackbar message="Test message" isVisible={true} onClose={mockOnClose} />
    );

    act(() => {
      vi.advanceTimersByTime(9000);
    });

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("clears the timeout when unmounted", () => {
    const mockOnClose = vi.fn();
    const { unmount } = render(
      <Snackbar message="Test message" isVisible={true} onClose={mockOnClose} />
    );

    unmount();

    act(() => {
      vi.advanceTimersByTime(9000);
    });

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it("applies success styles when type is success", () => {
    render(
      <Snackbar
        message="Success message"
        isVisible={true}
        onClose={() => {}}
        type="success"
      />
    );
    const snackbar = screen.getByTestId("snackbar");
    console.log({ screen: screen.debug() });
    expect(snackbar).toHaveClass("!bg-green-500");
  });

  it("applies error styles when type is error", () => {
    render(
      <Snackbar
        message="Error message"
        isVisible={true}
        onClose={() => {}}
        type="error"
      />
    );
    const snackbar = screen.getByTestId("snackbar");
    expect(snackbar).toHaveClass("!bg-red-500");
  });

  it("applies default success styles when type is not specified", () => {
    render(
      <Snackbar message="Default message" isVisible={true} onClose={() => {}} />
    );
    const snackbar = screen.getByTestId("snackbar");
    expect(snackbar).toHaveClass("!bg-green-500");
  });
});
