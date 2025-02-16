import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import NewUserPage from "../app/users/new/page";

// Mock the UserForm component
vi.mock("@/components/UserForm", () => ({
  default: () => <div data-testid="user-form">Mocked User Form</div>,
}));

describe("NewUserPage", () => {
  it("renders the page title", () => {
    render(<NewUserPage />);
    expect(screen.getByText("Create New User")).toBeTruthy();
  });

  it("renders the UserForm component", () => {
    render(<NewUserPage />);
    expect(screen.getByTestId("user-form")).toBeTruthy();
  });

  it("applies correct CSS classes to the container", () => {
    render(<NewUserPage />);
    const container = screen.getByText("Create New User").closest("div");
    expect(container).toHaveClass("container mx-auto p-4");
  });

  it("applies correct CSS classes to the title", () => {
    render(<NewUserPage />);
    const title = screen.getByText("Create New User");
    expect(title).toHaveClass("text-2xl font-bold mb-4");
  });

  it("renders the title and UserForm in the correct order", () => {
    render(<NewUserPage />);
    const container = screen.getByText("Create New User").closest("div");
    expect(container?.childNodes[0]).toHaveTextContent("Create New User");
    expect(container?.childNodes[1]).toHaveAttribute(
      "data-testid",
      "user-form"
    );
  });
});
