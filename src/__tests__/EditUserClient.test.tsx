import { render, screen, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import type { Mock } from "vitest";
import EditUserClient from "../components/EditUserClient";
import { type User } from "../services/api";
import { useQuery } from "@tanstack/react-query";

// Mock the dependencies
vi.mock("@tanstack/react-query", () => ({
  useQuery: vi.fn(),
}));

vi.mock("../services/api", () => ({
  UserService: {
    getUsers: vi.fn(),
    getUser: vi.fn(),
  },
}));

vi.mock("../components/UserForm", () => ({
  default: ({ user }: { user: User }) => (
    <div data-testid="user-form">{user.name}</div>
  ),
}));

vi.mock("../components/LoadingSpinner", () => ({
  default: ({ isLoading }: { isLoading: boolean }) => (
    <div data-testid="loading-spinner">
      {isLoading ? "Loading..." : "Not Loading"}
    </div>
  ),
}));

describe("EditUserClient", () => {
  const mockUserId = "1";
  const mockUser: User = {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    phone: "1234567890",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders LoadingSpinner when data is loading", () => {
    (useQuery as Mock).mockReturnValue({
      isLoading: true,
      error: null,
      data: null,
    });

    render(<EditUserClient userId={mockUserId} />);

    expect(screen.getByTestId("loading-spinner")).toHaveTextContent(
      "Loading..."
    );
  });

  it("renders error message when there's an error", () => {
    (useQuery as Mock).mockReturnValue({
      isLoading: false,
      error: new Error("Failed to fetch user"),
      data: null,
    });

    render(<EditUserClient userId={mockUserId} />);

    expect(
      screen.getByText("Error loading user: Failed to fetch user")
    ).toBeTruthy();
  });

  it("renders 'User not found' when user data is null", () => {
    (useQuery as Mock).mockReturnValue({
      isLoading: false,
      error: null,
      data: null,
    });

    render(<EditUserClient userId={mockUserId} />);

    expect(screen.getByText("User not found")).toBeTruthy();
  });

  it("renders UserForm when user data is available", async () => {
    (useQuery as Mock).mockReturnValue({
      isLoading: false,
      error: null,
      data: mockUser,
    });

    render(<EditUserClient userId={mockUserId} />);

    await waitFor(() => {
      expect(screen.getByTestId("user-form")).toHaveTextContent("John Doe");
    });
  });

  it("fetches temporary user from cache when userId is negative", async () => {
    const tempUser = { ...mockUser, id: -1 };
    const mockUsersQuery = {
      isLoading: false,
      error: null,
      data: [tempUser],
      isSuccess: true,
    };
    (useQuery as Mock).mockReturnValueOnce(mockUsersQuery).mockReturnValueOnce({
      isLoading: false,
      error: null,
      data: tempUser,
    });

    render(<EditUserClient userId="-1" />);

    await waitFor(() => {
      expect(screen.getByTestId("user-form")).toHaveTextContent("John Doe");
    });
  });
});
