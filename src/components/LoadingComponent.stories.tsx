import type { Meta, StoryObj } from "@storybook/react";
import LoadingComponent from "./LoadingSpinner";

const meta: Meta<typeof LoadingComponent> = {
  title: "Components/LoadingComponent",
  component: LoadingComponent,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof LoadingComponent>;

export const Loading: Story = {
  args: {
    isLoading: true,
  },
};

export const NotLoading: Story = {
  args: {
    isLoading: false,
  },
};

export const LoadingWithContent: Story = {
  args: {
    isLoading: true,
  },
  decorators: [
    // @ts-ignore
    (Story) => (
      <div>
        <h1 className="text-2xl font-bold mb-4">Page Content</h1>
        <p className="mb-4">
          This content should be visible behind the loading overlay.
        </p>
        <Story />
      </div>
    ),
  ],
};

export const LoadingWithDarkMode: Story = {
  args: {
    isLoading: true,
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};
