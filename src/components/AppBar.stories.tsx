import type React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import AppBar from "./AppBar";
import { within, userEvent } from "@storybook/testing-library";
import mockRouter from "next-router-mock";
import type { NextRouter } from "next/router";

// Create a custom wrapper to provide the mocked router
const RouterWrapper = ({ children }: { children: React.ReactNode }) => {
  const router = mockRouter as unknown as NextRouter;
  return <>{children}</>;
};

const meta: Meta<typeof AppBar> = {
  title: "Components/AppBar",
  component: AppBar,
  decorators: [
    (Story) => {
      // Initialize the mock router
      mockRouter.push("/");
      return (
        <RouterWrapper>
          <Story />
        </RouterWrapper>
      );
    },
  ],
  parameters: {
    layout: "fullscreen",
    nextRouter: {
      pathname: "/",
      asPath: "/",
      query: {},
    },
  },
};

export default meta;
type Story = StoryObj<typeof AppBar>;

export const Default: Story = {};

export const MobileDrawerOpen: Story = {
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const menuButton = canvas.getByRole("button");
    await userEvent.click(menuButton);
  },
};

export const Desktop: Story = {
  parameters: {
    viewport: {
      defaultViewport: "desktop",
    },
  },
};

export const Tablet: Story = {
  parameters: {
    viewport: {
      defaultViewport: "tablet",
    },
  },
};
