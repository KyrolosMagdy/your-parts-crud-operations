import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import UsersPage from "../app/users/page";

// Mock the UserList component
vi.mock("@/components/UserList", () => ({
  default: () => <div data-testid="user-list">Mocked User List</div>,
}));

describe("UsersPage", () => {
  it("renders the UserList component", () => {
    render(<UsersPage />);
    expect(screen.getByTestId("user-list")).toBeTruthy();
  });

  it("applies correct CSS classes to the container", () => {
    render(<UsersPage />);
    const container = screen.getByTestId("users-page-wrapper");
    expect(container).toHaveClass("container mx-auto p-4");
  });

  it("does not render any additional content", () => {
    render(<UsersPage />);
    expect(screen.queryByRole("heading")).toBeNull();
    expect(screen.getAllByText(/Mocked User List/i)).toHaveLength(1);
  });
});
