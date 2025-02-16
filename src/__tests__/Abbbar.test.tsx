import type React from "react";
import { expect, test, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import AppBar from "../components/AppBar";

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
  Home: () => <span data-testid="home-icon">Home Icon</span>,
  FileText: () => <span data-testid="file-text-icon">FileText Icon</span>,
  Users: () => <span data-testid="users-icon">Users Icon</span>,
  Menu: () => <span data-testid="open-menu-button">Menu Icon</span>,
  X: ({ "data-testid": testId }: { "data-testid"?: string }) => (
    <span data-testid={testId}>X Icon</span>
  ),
}));

test("AppBar renders correctly", () => {
  render(<AppBar />);

  expect(screen.getByText("Task Manager")).toBeTruthy();
  expect(screen.getByText("Posts")).toBeTruthy();
  expect(screen.getByText("Users")).toBeTruthy();
  expect(screen.getByTestId("open-menu-button")).toBeTruthy();
});

test("AppBar opens and closes mobile drawer", () => {
  render(<AppBar />);

  // Initially, the drawer should be closed
  expect(screen.queryByText("Home")).toBeNull();

  // Open the drawer
  fireEvent.click(screen.getByTestId("open-menu-button"));
  expect(screen.getByText("Home")).toBeTruthy();

  // Close the drawer
  fireEvent.click(screen.getByTestId("close-drawer-button"));
  expect(screen.queryByText("Home")).toBeNull();
});

test("AppBar toggles menu icon correctly", () => {
  render(<AppBar />);

  // Initially, the menu icon should be visible
  expect(screen.getByTestId("open-menu-button")).toBeTruthy();

  // Open the drawer
  fireEvent.click(screen.getByTestId("open-menu-button"));

  // The close menu icon should now be visible
  expect(screen.getByTestId("close-menu-button")).toBeTruthy();

  // Close the drawer
  fireEvent.click(screen.getByTestId("close-menu-button"));

  // The open menu icon should be visible again
  expect(screen.getByTestId("open-menu-button")).toBeTruthy();
});

test("AppBar closes drawer when clicking overlay", () => {
  render(<AppBar />);

  // Open the drawer
  fireEvent.click(screen.getByTestId("open-menu-button"));
  expect(screen.getByText("Home")).toBeTruthy();

  // Click the overlay
  fireEvent.click(screen.getByTestId("overlay"));
  expect(screen.queryByText("Home")).toBeNull();
});

test("AppBar navigation links work correctly", () => {
  render(<AppBar />);

  expect(screen.getByText("Task Manager").closest("a")).toHaveAttribute(
    "href",
    "/"
  );
  expect(screen.getAllByText("Posts")[0].closest("a")).toHaveAttribute(
    "href",
    "/posts"
  );
  expect(screen.getByText("Users").closest("a")).toHaveAttribute(
    "href",
    "/users"
  );
});

test("AppBar mobile drawer links work correctly", () => {
  render(<AppBar />);

  // Open the drawer
  fireEvent.click(screen.getByTestId("open-menu-button"));

  expect(screen.getByText("Home").closest("a")).toHaveAttribute("href", "/");
  expect(screen.getAllByText("Posts")[1].closest("a")).toHaveAttribute(
    "href",
    "/posts"
  );
  expect(screen.getAllByText("Users")[1].closest("a")).toHaveAttribute(
    "href",
    "/users"
  );
});
