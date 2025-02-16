"use client";

import type { Meta, StoryObj } from "@storybook/react";
import Pagination from "./Pagination";
import { useState } from "react";

const meta: Meta<typeof Pagination> = {
  title: "Components/Pagination",
  component: Pagination,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    onPageChange: { action: "page changed" },
  },
};

export default meta;
type Story = StoryObj<typeof Pagination>;

const PaginationWrapper = ({ totalPages }: { totalPages: number }) => {
  const [currentPage, setCurrentPage] = useState(1);
  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
    />
  );
};

export const Default: Story = {
  render: () => <PaginationWrapper totalPages={10} />,
};

export const SinglePage: Story = {
  args: {
    currentPage: 1,
    totalPages: 1,
    onPageChange: () => {},
  },
};

export const FirstPage: Story = {
  args: {
    currentPage: 1,
    totalPages: 5,
    onPageChange: () => {},
  },
};

export const MiddlePage: Story = {
  args: {
    currentPage: 3,
    totalPages: 5,
    onPageChange: () => {},
  },
};

export const LastPage: Story = {
  args: {
    currentPage: 5,
    totalPages: 5,
    onPageChange: () => {},
  },
};

export const ManyPages: Story = {
  args: {
    currentPage: 50,
    totalPages: 100,
    onPageChange: () => {},
  },
};
