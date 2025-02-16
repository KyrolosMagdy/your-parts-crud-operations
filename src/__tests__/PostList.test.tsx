import type React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach, type Mock } from "vitest";
import PostList from "../components/postsList";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Post } from "@/services/api";

// Mock dependencies
vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

vi.mock("@tanstack/react-query", () => ({
  useQuery: vi.fn(),
  useMutation: vi.fn(),
  useQueryClient: vi.fn(),
}));

vi.mock("@/services/api", () => ({
  PostService: {
    getPosts: vi.fn(),
    deletePost: vi.fn(),
  },
}));

vi.mock("../components/LoadingSpinner", () => ({
  default: ({ isLoading }: { isLoading: boolean }) =>
    isLoading ? <div data-testid="loading-spinner">Loading...</div> : null,
}));

vi.mock("../components/Pagination", () => ({
  default: ({
    currentPage,
    totalPages,
    onPageChange,
  }: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  }) => (
    <div data-testid="pagination">
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <button onClick={() => onPageChange(currentPage - 1)}>Previous</button>
      <button onClick={() => onPageChange(currentPage + 1)}>Next</button>
    </div>
  ),
}));

vi.mock("../components/PostCard", () => ({
  PostCard: ({
    post,
    handleDelete,
  }: {
    post: Post;
    handleDelete: (id: number, e: React.MouseEvent<HTMLButtonElement>) => void;
  }) => (
    <li data-testid={`post-${post.id}`}>
      {post.title}
      <button onClick={(e) => handleDelete(post.id, e)}>Delete</button>
    </li>
  ),
}));

describe("PostList", () => {
  const mockPosts: Post[] = [
    { id: 1, title: "Post 1", body: "Content 1", userId: 1 },
    { id: 2, title: "Post 2", body: "Content 2", userId: 1 },
    { id: 3, title: "Post 3", body: "Content 3", userId: 2 },
    { id: 4, title: "Post 4", body: "Content 4", userId: 2 },
    { id: 5, title: "Post 5", body: "Content 5", userId: 3 },
    { id: 6, title: "Post 6", body: "Content 6", userId: 3 },
  ];

  const mockQueryClient = {
    invalidateQueries: vi.fn(),
    setQueryData: vi.fn(),
    cancelQueries: vi.fn(),
    getQueryData: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useQueryClient as Mock).mockReturnValue(mockQueryClient);
    (useQuery as Mock).mockReturnValue({
      data: mockPosts,
      isLoading: false,
      isError: false,
    });
    (useMutation as Mock).mockReturnValue({
      mutateAsync: vi.fn(),
    });
  });

  it("renders the post list correctly", () => {
    render(<PostList />);
    expect(screen.getByText("Create New Post")).toBeTruthy();
    expect(screen.getAllByTestId(/^post-/)).toHaveLength(5); // 5 posts per page
    expect(screen.getByTestId("pagination")).toBeTruthy();
  });

  it("displays loading spinner when posts are loading", () => {
    (useQuery as Mock).mockReturnValue({
      isLoading: true,
      isError: false,
    });
    render(<PostList />);
    expect(screen.getByTestId("loading-spinner")).toBeTruthy();
  });

  it("displays error message when there is an error", () => {
    (useQuery as Mock).mockReturnValue({
      isLoading: false,
      isError: true,
    });
    render(<PostList />);
    expect(
      screen.getByText("Error loading posts. Please try again later.")
    ).toBeTruthy();
  });

  it("deletes a post when delete button is clicked", async () => {
    const mockMutateAsync = vi.fn().mockResolvedValue({});
    (useMutation as Mock).mockReturnValue({
      mutateAsync: mockMutateAsync,
    });

    render(<PostList />);

    const deleteButton = screen.getAllByText("Delete")[0];
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith(1); // Assuming the first post has id 1
    });
  });

  it("changes page when pagination buttons are clicked", () => {
    render(<PostList />);

    const nextButton = screen.getByText("Next");
    fireEvent.click(nextButton);

    expect(screen.getByText("Page 2 of 2")).toBeTruthy();

    const prevButton = screen.getByText("Previous");
    fireEvent.click(prevButton);

    expect(screen.getByText("Page 1 of 2")).toBeTruthy();
  });
});
