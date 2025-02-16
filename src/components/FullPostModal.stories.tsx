"use client";

import type React from "react";

import type { Meta, StoryObj } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import FullPostModal from "./FullPostModal";
import { http, HttpResponse, delay } from "msw";
import { useState } from "react";

const queryClient = new QueryClient();

const meta: Meta<typeof FullPostModal> = {
  title: "Components/FullPostModal",
  component: FullPostModal,
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <Story />
      </QueryClientProvider>
    ),
  ],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof FullPostModal>;

const ModalWrapper = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div>
      {isOpen && children}
      {!isOpen && <button onClick={() => setIsOpen(true)}>Open Modal</button>}
    </div>
  );
};

export const Default: Story = {
  args: {
    post: {
      id: 1,
      title: "Example Post Title",
      body: "This is the body of the example post.",
      userId: 1,
    },
    onClose: () => {},
    isOpen: true,
  },
  decorators: [
    (Story) => (
      <ModalWrapper>
        <Story />
      </ModalWrapper>
    ),
  ],
  parameters: {
    msw: {
      handlers: [
        http.get("https://jsonplaceholder.typicode.com/posts/1", () => {
          return HttpResponse.json({
            id: 1,
            title: "Example Post Title",
            body: "This is the body of the example post. It can be quite long and may contain multiple paragraphs.\n\nLike this one here.",
            userId: 1,
          });
        }),
      ],
    },
  },
};

export const Loading: Story = {
  args: {
    post: {
      id: 2,
      title: "Delayed Post",
      body: "This post was delayed to simulate loading.",
      userId: 1,
    },
    onClose: () => {},
    isOpen: true,
  },
  decorators: [
    (Story) => (
      <ModalWrapper>
        <Story />
      </ModalWrapper>
    ),
  ],
  parameters: {
    msw: {
      handlers: [
        http.get("https://jsonplaceholder.typicode.com/posts/2", async () => {
          await delay(2000);
          return HttpResponse.json({
            id: 2,
            title: "Delayed Post",
            body: "This post was delayed to simulate loading.",
            userId: 1,
          });
        }),
      ],
    },
  },
};

export const Error: Story = {
  args: {
    post: {
      id: 999,
      title: "Not Found",
      body: "The requested post was not found.",
      userId: 1,
    },
    onClose: () => {},
    isOpen: true,
  },
  decorators: [
    (Story) => (
      <ModalWrapper>
        <Story />
      </ModalWrapper>
    ),
  ],
  parameters: {
    msw: {
      handlers: [
        http.get("https://jsonplaceholder.typicode.com/posts/999", () => {
          return new HttpResponse(null, { status: 404 });
        }),
      ],
    },
  },
};

export const LongContent: Story = {
  args: {
    post: {
      id: 3,
      title:
        "Very Long Post Title That Might Wrap to Multiple Lines in the Modal",
      body: "This is a very long post body that will definitely need scrolling in the modal. ".repeat(
        50
      ),
      userId: 1,
    },
    onClose: () => {},
    isOpen: true,
  },
  decorators: [
    (Story) => (
      <ModalWrapper>
        <Story />
      </ModalWrapper>
    ),
  ],
  parameters: {
    msw: {
      handlers: [
        http.get("https://jsonplaceholder.typicode.com/posts/3", () => {
          return HttpResponse.json({
            id: 3,
            title:
              "Very Long Post Title That Might Wrap to Multiple Lines in the Modal",
            body: "This is a very long post body that will definitely need scrolling in the modal. ".repeat(
              50
            ),
            userId: 1,
          });
        }),
      ],
    },
  },
};
