import type { Meta, StoryObj } from "@storybook/react";
import { UserCard } from "./UserCard";
import type { User } from "@/services/api";
import { action } from "@storybook/addon-actions";

const meta: Meta<typeof UserCard> = {
  title: "Components/UserCard",
  component: UserCard,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    handleDelete: { action: "delete" },
  },
};

export default meta;
type Story = StoryObj<typeof UserCard>;

const sampleUser: User = {
  id: 1,
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
};

export const Default: Story = {
  args: {
    user: sampleUser,
    handleDelete: action("handleDelete"),
  },
};

export const LongName: Story = {
  args: {
    user: {
      ...sampleUser,
      name: "Dr. Johnathan Doe-Smith III, PhD",
    },
    handleDelete: action("handleDelete"),
  },
};

export const LongEmail: Story = {
  args: {
    user: {
      ...sampleUser,
      email: "johnathan.doe-smith.the.third@very-long-domain-name.example.com",
    },
    handleDelete: action("handleDelete"),
  },
};

export const NoPhone: Story = {
  args: {
    user: {
      ...sampleUser,
      phone: "",
    },
    handleDelete: action("handleDelete"),
  },
};
