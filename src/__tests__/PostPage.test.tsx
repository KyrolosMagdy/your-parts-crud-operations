import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import PostsPage from "../app/posts/page";
import usePostsStore from "../store/usePostsStore";

// Mock the components and hooks
vi.mock("@/components/LoadingSpinner", () => ({
  default: ({ isLoading }: { isLoading: boolean }) =>
    isLoading ? <div data-testid="full-page-spinner">Loading...</div> : null,
}));

vi.mock("@/components/postsList", () => ({
  default: () => <div data-testid="post-list">Post List</div>,
}));

vi.mock("@/components/Snackbar", () => ({
  default: ({
    message,
    type,
    isVisible,
  }: {
    message: string;
    type: string;
    isVisible: boolean;
  }) =>
    isVisible ? <div data-testid={`snackbar-${type}`}>{message}</div> : null,
}));

vi.mock("@/store/usePostsStore");

describe("PostsPage", () => {
  const baseMockState = {
    successMessage: "",
    failureMessage: "",
    isLoading: false,
    setSuccessMessage: vi.fn(),
    setFailureMessage: vi.fn(),
  };

  beforeEach(() => {
    vi.mocked(usePostsStore).mockReturnValue(baseMockState);
  });

  it("renders PostList component", () => {
    render(<PostsPage />);
    expect(screen.getByTestId("post-list")).toBeTruthy();
  });

  it("renders FullPageSpinner when isLoading is true", () => {
    vi.mocked(usePostsStore).mockReturnValue({
      ...baseMockState,
      isLoading: true,
    });
    render(<PostsPage />);
    expect(screen.getByTestId("full-page-spinner")).toBeTruthy();
  });

  it("renders success Snackbar when successMessage is present", () => {
    vi.mocked(usePostsStore).mockReturnValue({
      ...baseMockState,
      successMessage: "Success!",
    });
    render(<PostsPage />);
    expect(screen.getByTestId("snackbar-success")).toBeTruthy();
    expect(screen.getByTestId("snackbar-success")).toHaveTextContent(
      "Success!"
    );
  });

  it("renders error Snackbar when failureMessage is present", () => {
    vi.mocked(usePostsStore).mockReturnValue({
      ...baseMockState,
      failureMessage: "Error!",
    });
    render(<PostsPage />);
    expect(screen.getByTestId("snackbar-error")).toBeTruthy();
    expect(screen.getByTestId("snackbar-error")).toHaveTextContent("Error!");
  });

  it("does not render Snackbars when no messages are present", () => {
    render(<PostsPage />);
    expect(screen.queryByTestId("snackbar-success")).toBeNull();
    expect(screen.queryByTestId("snackbar-error")).toBeNull();
  });
});
