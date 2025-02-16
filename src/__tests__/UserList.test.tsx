import type React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach, type Mock } from "vitest";
import UserList from "../components/UserList";
import { UserService } from "@/services/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { User } from "@/services/api";

// Mock dependencies
vi.mock("@tanstack/react-query", () => ({
  useQuery: vi.fn(),
  useQueryClient: vi.fn(),
}));

vi.mock("@/services/api", () => ({
  UserService: {
    getUsers: vi.fn(),
    deleteUser: vi.fn(),
  },
}));

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

vi.mock("../components/UserCard", () => ({
  UserCard: ({
    user,
    handleDelete,
  }: {
    user: User;
    handleDelete: (id: number) => void;
  }) => (
    <li data-testid={`user-${user.id}`}>
      {user.name}
      <button onClick={() => handleDelete(user.id)}>Delete</button>
    </li>
  ),
}));

describe("UserList", () => {
  const mockUsers: User[] = [
    { id: 1, name: "John Doe", email: "john@example.com", phone: "1234567890" },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "0987654321",
    },
  ];

  const mockQueryClient = {
    setQueryData: vi.fn(),
    removeQueries: vi.fn(),
  };

  const mockRefetch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useQueryClient as Mock).mockReturnValue(mockQueryClient);
  });

  it("renders loading state", () => {
    (useQuery as Mock).mockReturnValue({ status: "pending" });
    render(<UserList />);
    expect(screen.getByText("Loading users...")).toBeTruthy();
  });

  it("renders error state", () => {
    (useQuery as Mock).mockReturnValue({ status: "error" });
    render(<UserList />);
    expect(screen.getByText("Error loading users")).toBeTruthy();
  });

  it("renders user list", () => {
    (useQuery as Mock).mockReturnValue({
      status: "success",
      data: mockUsers,
      refetch: mockRefetch,
    });
    render(<UserList />);
    expect(screen.getByText("Users")).toBeTruthy();
    expect(screen.getByText("John Doe")).toBeTruthy();
    expect(screen.getByText("Jane Smith")).toBeTruthy();
  });

  it("renders create new user link", () => {
    (useQuery as Mock).mockReturnValue({
      status: "success",
      data: mockUsers,
      refetch: mockRefetch,
    });
    render(<UserList />);
    const createLink = screen.getByText("Create New User").closest("a");
    expect(createLink).toHaveAttribute("href", "/users/new");
  });

  it("handles user deletion", async () => {
    (useQuery as Mock).mockReturnValue({
      status: "success",
      data: mockUsers,
      refetch: mockRefetch,
    });
    render(<UserList />);

    fireEvent.click(screen.getAllByText("Delete")[0]);

    await waitFor(() => {
      expect(UserService.deleteUser).toHaveBeenCalledWith(1);
      expect(mockQueryClient.setQueryData).toHaveBeenCalled();
      expect(mockQueryClient.removeQueries).toHaveBeenCalled();
    });
  });

  it("handles temporary user deletion", async () => {
    const tempUser: User = {
      id: -1,
      name: "Temp User",
      email: "temp@example.com",
      phone: "1111111111",
    };
    (useQuery as Mock).mockReturnValue({
      status: "success",
      data: [...mockUsers, tempUser],
      refetch: mockRefetch,
    });
    render(<UserList />);

    fireEvent.click(screen.getAllByText("Delete")[2]);

    await waitFor(() => {
      expect(UserService.deleteUser).not.toHaveBeenCalled();
      expect(mockQueryClient.setQueryData).toHaveBeenCalled();
      expect(mockQueryClient.removeQueries).toHaveBeenCalled();
    });
  });

  it("refetches users when refresh button is clicked", () => {
    (useQuery as Mock).mockReturnValue({
      status: "success",
      data: mockUsers,
      refetch: mockRefetch,
    });
    render(<UserList />);

    fireEvent.click(screen.getByText("Refresh Users"));
    expect(mockRefetch).toHaveBeenCalled();
  });
});
