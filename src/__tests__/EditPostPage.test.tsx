import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import EditPostPage from "../app/posts/[id]/edit/page";

// Mock the EditPostForm component
vi.mock("@/components/EditPostForm", () => ({
  default: ({ postId }: { postId: string }) => (
    <div data-testid="edit-post-form">
      Mocked Edit Post Form for ID: {postId}
    </div>
  ),
}));

describe("EditPostPage", () => {
  const mockParams = { id: "123" };

  it("renders the page title", () => {
    render(<EditPostPage params={mockParams} />);
    expect(screen.getByText("Edit Post")).toBeTruthy();
  });

  it("renders the EditPostForm component with correct postId", () => {
    render(<EditPostPage params={mockParams} />);
    const editPostForm = screen.getByTestId("edit-post-form");
    expect(editPostForm).toBeTruthy();
    expect(editPostForm).toHaveTextContent("Mocked Edit Post Form for ID: 123");
  });

  it("applies correct CSS classes to the container", () => {
    render(<EditPostPage params={mockParams} />);
    const container = screen.getByText("Edit Post").closest("div");
    expect(container).toHaveClass("container mx-auto p-4");
  });

  it("applies correct CSS classes to the title", () => {
    render(<EditPostPage params={mockParams} />);
    const title = screen.getByText("Edit Post");
    expect(title).toHaveClass("text-2xl font-bold mb-4");
  });

  it("passes the correct postId to EditPostForm", () => {
    const customParams = { id: "456" };
    render(<EditPostPage params={customParams} />);
    const editPostForm = screen.getByTestId("edit-post-form");
    expect(editPostForm).toHaveTextContent("Mocked Edit Post Form for ID: 456");
  });
});
