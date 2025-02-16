import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach, type Mock } from "vitest";
import PostForm from "../components/PostForm";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import usePostsStore from "@/store/usePostsStore";
import type { Post, User } from "@/services/api";

// Mock dependencies
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

vi.mock("@tanstack/react-query", () => ({
  useQuery: vi.fn(),
  useMutation: vi.fn(),
  useQueryClient: vi.fn(),
}));

vi.mock("@/store/usePostsStore", () => ({
  default: vi.fn(),
}));

vi.mock("@/services/api", () => ({
  PostService: {
    createPost: vi.fn(),
    updatePost: vi.fn(),
  },
  UserService: {
    getUsers: vi.fn(),
  },
}));

vi.mock("../components/Snackbar", () => ({
  default: ({ message, isVisible }: { message: string; isVisible: boolean }) =>
    isVisible ? <div data-testid="snackbar">{message}</div> : null,
}));

vi.mock("../components/LoadingSpinner", () => ({
  default: ({ isLoading }: { isLoading: boolean }) =>
    isLoading ? <div data-testid="loading-spinner">Loading...</div> : null,
}));

describe("PostForm", () => {
  const mockRouter = { push: vi.fn() };
  const mockQueryClient = {
    invalidateQueries: vi.fn(),
    setQueryData: vi.fn(),
    cancelQueries: vi.fn(),
    getQueryData: vi.fn(),
  };
  const mockSetSuccessMessage = vi.fn();
  const mockSetFailureMessage = vi.fn();
  const mockMutateAsync = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as Mock).mockReturnValue(mockRouter);
    (useQueryClient as Mock).mockReturnValue(mockQueryClient);
    (usePostsStore as unknown as Mock).mockReturnValue({
      setSuccessMessage: mockSetSuccessMessage,
      setFailureMessage: mockSetFailureMessage,
      failureMessage: "",
    });
    (useQuery as Mock).mockReturnValue({
      data: [{ id: 1, name: "John Doe" }] as User[],
      isLoading: false,
    });
    (useMutation as Mock).mockReturnValue({
      mutateAsync: mockMutateAsync,
    });
  });

  it("renders the form correctly", () => {
    render(<PostForm />);
    expect(screen.getByLabelText("Title")).toBeTruthy();
    expect(screen.getByLabelText("Body")).toBeTruthy();
    expect(screen.getByPlaceholderText("Search for a user...")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Create Post" })).toBeTruthy();
  });

  it("updates an existing post", async () => {
    mockMutateAsync.mockResolvedValue({
      id: 1,
      title: "Updated Post",
      body: "Updated Body",
      userId: 1,
    } as Post);

    const existingPost: Post = {
      id: 1,
      title: "Existing Post",
      body: "Existing Body",
      userId: 1,
    };
    render(<PostForm post={existingPost} />);

    fireEvent.change(screen.getByLabelText("Title"), {
      target: { value: "Updated Post" },
    });
    fireEvent.change(screen.getByLabelText("Body"), {
      target: { value: "Updated Body" },
    });

    fireEvent.submit(screen.getByRole("button", { name: "Update Post" }));

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        id: 1,
        title: "Updated Post",
        body: "Updated Body",
        userId: 1,
      });
      expect(mockRouter.push).toHaveBeenCalledWith("/posts");
      expect(mockSetSuccessMessage).toHaveBeenCalled();
    });
  });

  it("filters users based on search input", async () => {
    (useQuery as Mock).mockReturnValue({
      data: [
        { id: 1, name: "John Doe" },
        { id: 2, name: "Jane Smith" },
      ] as User[],
      isLoading: false,
    });

    render(<PostForm />);

    fireEvent.change(screen.getByPlaceholderText("Search for a user..."), {
      target: { value: "John" },
    });

    await waitFor(() => {
      expect(screen.getByText("John Doe (ID: 1)")).toBeTruthy();
      expect(screen.queryByText("Jane Smith (ID: 2)")).toBeNull();
    });
  });
});
