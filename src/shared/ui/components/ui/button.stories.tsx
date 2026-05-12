import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowLeft, ArrowRight, Heart, Search, Trash2 } from "lucide-react";
import { Button } from "./button";

const meta: Meta<typeof Button> = {
  title: "Shared/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Central button primitive built on base-ui with cva variants. Supports primary (gold gradient), secondary (outlined), ghost, link, and destructive styles, plus sm / md / lg / icon sizes.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: [
        "primary",
        "secondary",
        "ghost",
        "link",
        "outline",
        "destructive",
      ],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg", "icon"],
    },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: { variant: "primary", children: "Primary" },
};

export const Secondary: Story = {
  args: { variant: "secondary", children: "Secondary" },
};

export const Ghost: Story = {
  args: { variant: "ghost", children: "Ghost" },
};

export const Link: Story = {
  args: { variant: "link", children: "Link button" },
};

export const Outline: Story = {
  args: { variant: "outline", children: "Outline" },
};

export const Destructive: Story = {
  args: { variant: "destructive", children: "Delete" },
};

export const Disabled: Story = {
  args: { variant: "primary", children: "Disabled", disabled: true },
};

export const WithIcon: Story = {
  name: "With icon",
  args: {
    variant: "secondary",
    children: (
      <>
        <Search />
        Search
      </>
    ),
  },
};

export const IconOnly: Story = {
  name: "Icon only",
  args: { variant: "ghost", size: "icon", children: <Heart /> },
};

export const AllVariants: Story = {
  name: "All variants",
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="destructive">
        <Trash2 />
        Destructive
      </Button>
    </div>
  ),
};

export const AllSizes: Story = {
  name: "All sizes",
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
      <Button size="icon">
        <Heart />
      </Button>
    </div>
  ),
};

export const WithIcons: Story = {
  name: "With icons (left & right)",
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button variant="secondary">
        <ArrowLeft />
        Back
      </Button>
      <Button variant="primary">
        Next
        <ArrowRight />
      </Button>
    </div>
  ),
};
