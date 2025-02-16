import type { Meta, StoryObj } from "@storybook/react";
import { PostCard } from "./PostCard";
import type { Post } from "@/services/api";

const meta: Meta<typeof PostCard> = {
  title: "Components/PostCard",
  component: PostCard,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    needsExpansion: { action: "needsExpansion" },
    toggleExpand: { action: "toggleExpand" },
    handleDelete: { action: "handleDelete" },
  },
};

export default meta;
type Story = StoryObj<typeof PostCard>;

const examplePost: Post = {
  id: 1,
  title: "Example Post Title",
  body: "This is an example post body. It can be short or long depending on the content.",
  userId: 1,
};

export const Default: Story = {
  args: {
    post: examplePost,
    index: 0,
    needsExpansion: () => true,
    toggleExpand: () => {},
    expandedPost: null,
    handleDelete: () => {},
  },
};

export const Expanded: Story = {
  args: {
    ...Default.args,
    expandedPost: 1,
  },
};

export const LongContent: Story = {
  args: {
    ...Default.args,
    post: {
      ...examplePost,
      body: "This is a much longer post body that will definitely need expansion. ".repeat(
        10
      ),
    },
  },
};

export const OddIndex: Story = {
  args: {
    ...Default.args,
    index: 1,
  },
};
