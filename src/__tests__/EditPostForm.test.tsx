import { render, screen } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import type { Mock } from "vitest";
import EditPostForm from "../components/EditPostForm";
import type { Post } from "../services/api";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import usePostsStore from "../store/usePostsStore";

// Mock the dependencies
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

vi.mock("@tanstack/react-query", () => ({
  useQueryClient: vi.fn(),
}));

vi.mock("../store/usePostsStore", () => ({
  default: vi.fn(),
}));

vi.mock("../components/PostForm", () => ({
  default: ({ post }: { post: Post }) => (
    <div data-testid="post-form">{post?.title}</div>
  ),
}));

vi.mock("../utils/constants", () => ({
  warningMessage: "This is a warning message",
}));

describe("EditPostForm", () => {
  const mockPostId = "1";
  const mockPost: Post = {
    id: 1,
    title: "Test Post",
    body: "Test Body",
    userId: 1,
  };
  let mockQueryClient: { getQueryData: Mock };
  let mockRouter: { push: Mock };
  let mockSetFailureMessage: Mock;

  beforeEach(() => {
    mockQueryClient = { getQueryData: vi.fn() };
    mockRouter = { push: vi.fn() };
    mockSetFailureMessage = vi.fn();

    (useQueryClient as Mock).mockImplementation(() => mockQueryClient);
    (useRouter as Mock).mockImplementation(() => mockRouter);
    (usePostsStore as unknown as Mock).mockImplementation(() => ({
      setFailureMessage: mockSetFailureMessage,
    }));
  });

  it("renders PostForm when post is found", () => {
    mockQueryClient.getQueryData.mockReturnValue([mockPost]);

    render(<EditPostForm postId={mockPostId} />);

    expect(screen.getByTestId("post-form")).toHaveTextContent("Test Post");
  });

  it("redirects to /posts when posts are not found", () => {
    mockQueryClient.getQueryData.mockReturnValue(null);

    render(<EditPostForm postId={mockPostId} />);

    expect(mockSetFailureMessage).toHaveBeenCalledWith(
      "Error: Your post was not found, please try again. This is a warning message"
    );
    expect(mockRouter.push).toHaveBeenCalledWith("/posts");
  });

  it("redirects to /posts/new when specific post is not found", () => {
    mockQueryClient.getQueryData.mockReturnValue([
      { id: 2, title: "Other Post", body: "Other Body", userId: 2 },
    ]);

    render(<EditPostForm postId={mockPostId} />);

    expect(mockSetFailureMessage).toHaveBeenCalledWith(
      "Error: Your post was not found, please try again."
    );
    expect(mockRouter.push).toHaveBeenCalledWith("/posts/new");
  });
});
