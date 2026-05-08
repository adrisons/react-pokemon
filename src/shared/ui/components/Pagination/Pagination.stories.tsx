import type { Meta, StoryObj } from "@storybook/react-vite";
import Pagination from "./Pagination";

const meta: Meta<typeof Pagination> = {
  title: "Shared/Pagination",
  component: Pagination,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Pagination control wrapping shadcn Button. Renders Previous/Next buttons conditionally based on available pages.",
      },
    },
  },
  argTypes: {
    gotoNextPage: { action: "next page clicked" },
    gotoPrevPage: { action: "prev page clicked" },
  },
};

export default meta;
type Story = StoryObj<typeof Pagination>;

export const FirstPage: Story = {
  name: "First page (no Previous)",
  args: {
    gotoNextPage: () => {},
    gotoPrevPage: null,
  },
};

export const MiddlePage: Story = {
  name: "Middle page (both buttons)",
  args: {
    gotoNextPage: () => {},
    gotoPrevPage: () => {},
  },
};

export const LastPage: Story = {
  name: "Last page (no Next)",
  args: {
    gotoNextPage: null,
    gotoPrevPage: () => {},
  },
};
