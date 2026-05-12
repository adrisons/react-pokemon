import type { Meta, StoryObj } from "@storybook/react-vite";
import SearchTrigger from "./SearchTrigger";

const meta: Meta<typeof SearchTrigger> = {
  title: "Features/Search/SearchTrigger",
  component: SearchTrigger,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Trigger button that opens the search command palette. Renders a compact icon on mobile and a full input-style trigger from `sm` upwards. Clicking dispatches `useSearchStore.open()`.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center p-8 min-h-40 bg-dark-900">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SearchTrigger>;

export const Default: Story = {};

export const Mobile: Story = {
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};
