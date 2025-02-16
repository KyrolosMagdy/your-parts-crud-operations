import type React from "react";
import { expect, test, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PostCard } from "../components/PostCard";
import type { Post } from "@/services/api";

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

// Mock the Lucide icons
vi.mock("lucide-react", () => ({
  ChevronDown: () => <span data-testid="chevron-down">ChevronDown</span>,
  ChevronUp: () => <span data-testid="chevron-up">ChevronUp</span>,
  Pencil: () => <span>Pencil</span>,
  Trash2: () => <span>Trash2</span>,
}));

const mockPost: Post = {
  id: 1,
  title: "Test Post",
  body: "This is a test post body",
  userId: 1,
};

const mockProps = {
  post: mockPost,
  index: 0,
  needsExpansion: vi.fn(),
  toggleExpand: vi.fn(),
  expandedPost: null as number | null,
  handleDelete: vi.fn(),
};

test("PostCard renders correctly", () => {
  mockProps.needsExpansion.mockReturnValue(true);
  render(<PostCard {...mockProps} />);

  expect(screen.getByText("Test Post")).toBeTruthy();
  expect(screen.getByText("This is a test post body")).toBeTruthy();
  expect(screen.getByText("Delete")).toBeTruthy();
  expect(screen.getByText("Edit")).toBeTruthy();
  expect(screen.getByTestId("chevron-down")).toBeTruthy();
});

test("PostCard toggles expansion when clicked", () => {
  mockProps.needsExpansion.mockReturnValue(true);
  render(<PostCard {...mockProps} />);

  fireEvent.click(screen.getByText("Test Post"));
  expect(mockProps.toggleExpand).toHaveBeenCalledWith(1);
});

test("PostCard calls handleDelete when delete button is clicked", () => {
  render(<PostCard {...mockProps} />);

  fireEvent.click(screen.getByText("Delete"));
  expect(mockProps.handleDelete).toHaveBeenCalledWith(1, expect.any(Object));
});

test("PostCard renders ChevronUp when expanded", () => {
  mockProps.needsExpansion.mockReturnValue(true);
  mockProps.expandedPost = 1;
  render(<PostCard {...mockProps} />);

  expect(screen.getByTestId("chevron-up")).toBeTruthy();
});
