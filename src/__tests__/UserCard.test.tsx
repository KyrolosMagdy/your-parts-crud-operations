import type React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi, describe, it, expect } from "vitest";
import { UserCard } from "../components/UserCard";
import type { User } from "@/services/api";

// Mock the Lucide icons
vi.mock("lucide-react", () => ({
  Trash2: () => <div data-testid="trash-icon">Trash2</div>,
  Pencil: () => <div data-testid="pencil-icon">Pencil</div>,
}));

// Mock the next/link component
vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

describe("UserCard", () => {
  const mockUser: User = {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    phone: "123-456-7890",
  };

  const mockHandleDelete = vi.fn();

  it("renders user information correctly", () => {
    render(<UserCard user={mockUser} handleDelete={mockHandleDelete} />);

    expect(screen.getByText("John Doe")).toBeTruthy();
    expect(screen.getByText("john@example.com")).toBeTruthy();
    expect(screen.getByText("123-456-7890")).toBeTruthy();
  });

  it("renders edit link with correct href", () => {
    render(<UserCard user={mockUser} handleDelete={mockHandleDelete} />);

    const editLink = screen.getByText("Edit").closest("a");
    expect(editLink).toHaveAttribute("href", "/users/1/edit");
  });

  it("renders edit icon", () => {
    render(<UserCard user={mockUser} handleDelete={mockHandleDelete} />);

    expect(screen.getByTestId("pencil-icon")).toBeTruthy();
  });

  it("renders delete button", () => {
    render(<UserCard user={mockUser} handleDelete={mockHandleDelete} />);

    expect(screen.getByText("Delete")).toBeTruthy();
  });

  it("renders delete icon", () => {
    render(<UserCard user={mockUser} handleDelete={mockHandleDelete} />);

    expect(screen.getByTestId("trash-icon")).toBeTruthy();
  });

  it("calls handleDelete with correct user id when delete button is clicked", () => {
    render(<UserCard user={mockUser} handleDelete={mockHandleDelete} />);

    fireEvent.click(screen.getByText("Delete"));
    expect(mockHandleDelete).toHaveBeenCalledWith(1);
  });
});
