import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import NewPostPage from "../app/posts/new/page";

// Mock the PostForm component
vi.mock("@/components/PostForm", () => ({
  default: () => <div data-testid="post-form">Mocked Post Form</div>,
}));

describe("NewPostPage", () => {
  it("renders the page title", () => {
    render(<NewPostPage />);
    expect(screen.getByText("Create New Post")).toBeTruthy();
  });

  it("renders the PostForm component", () => {
    render(<NewPostPage />);
    expect(screen.getByTestId("post-form")).toBeTruthy();
  });

  it("applies correct CSS classes", () => {
    render(<NewPostPage />);
    const container = screen.getByText("Create New Post").closest("div");
    expect(container).toHaveClass("container mx-auto p-4");
  });

  it("applies correct CSS classes to the title", () => {
    render(<NewPostPage />);
    const title = screen.getByText("Create New Post");
    expect(title).toHaveClass("text-2xl font-bold mb-4");
  });
});
