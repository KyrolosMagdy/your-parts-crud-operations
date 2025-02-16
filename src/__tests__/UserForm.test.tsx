import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach, type Mock } from "vitest";
import UserForm from "../components/UserForm";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { User } from "@/services/api";

// Mock dependencies
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

vi.mock("@tanstack/react-query", () => ({
  useMutation: vi.fn(),
  useQueryClient: vi.fn(),
}));

vi.mock("@/services/api", () => ({
  UserService: {
    createUser: vi.fn(),
    updateUser: vi.fn(),
  },
}));

vi.mock("../components/Snackbar", () => ({
  default: ({ message, isVisible }: { message: string; isVisible: boolean }) =>
    isVisible ? <div data-testid="snackbar">{message}</div> : null,
}));

describe("UserForm", () => {
  const mockRouter = { push: vi.fn() };
  const mockQueryClient = {
    setQueryData: vi.fn(),
  };
  const mockMutateAsync = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as Mock).mockReturnValue(mockRouter);
    (useQueryClient as Mock).mockReturnValue(mockQueryClient);
    (useMutation as Mock).mockReturnValue({
      mutateAsync: mockMutateAsync,
    });
  });

  it("renders the form correctly for new user", () => {
    render(<UserForm />);
    expect(screen.getByLabelText("Name")).toBeTruthy();
    expect(screen.getByLabelText("Email")).toBeTruthy();
    expect(screen.getByLabelText("Phone")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Create User" })).toBeTruthy();
  });

  it("renders the form correctly for existing user", () => {
    const user: User = {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      phone: "1234567890",
    };
    render(<UserForm user={user} />);
    expect(screen.getByLabelText("Name")).toHaveValue("John Doe");
    expect(screen.getByLabelText("Email")).toHaveValue("john@example.com");
    expect(screen.getByLabelText("Phone")).toHaveValue("1234567890");
    expect(screen.getByRole("button", { name: "Update User" })).toBeTruthy();
  });

  it("displays error messages for invalid form submission", async () => {
    render(<UserForm />);

    fireEvent.click(screen.getByRole("button", { name: "Create User" }));

    await waitFor(() => {
      expect(screen.getByText("Name is required")).toBeTruthy();
      expect(screen.getByText("Invalid email address")).toBeTruthy();
      expect(screen.getByText("Invalid Number!")).toBeTruthy();
    });
  });

  it("submits the form with valid data for new user", async () => {
    render(<UserForm />);

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Phone"), {
      target: { value: "1234567890" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Create User" }));

    await waitFor(() => {
      expect(mockQueryClient.setQueryData).toHaveBeenCalledTimes(2);
      expect(mockRouter.push).toHaveBeenCalledWith("/users");
    });
  });

  it("submits the form with valid data for existing user", async () => {
    const user: User = {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      phone: "1234567890",
    };
    mockMutateAsync.mockResolvedValue(user);

    render(<UserForm user={user} />);

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Jane Doe" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Update User" }));

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        id: 1,
        name: "Jane Doe",
        email: "john@example.com",
        phone: "1234567890",
      });
      expect(mockRouter.push).toHaveBeenCalledWith("/users");
    });
  });
});
