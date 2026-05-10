import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router-dom";
import Navbar from "./Navbar";

const meta: Meta<typeof Navbar> = {
  title: "Features/Navbar",
  component: Navbar,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={["/react-pokemon/"]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className="min-h-80">
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component: "Top navigation with Pokemon logo linking to the home page.",
      },
    },
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof Navbar>;

export const Default: Story = {};

