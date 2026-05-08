import type { Meta, StoryObj } from "@storybook/react-vite";
import Loading from "./Loading";

const meta: Meta<typeof Loading> = {
  title: "Shared/Loading",
  component: Loading,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Spinning Pokeball loading indicator. Used while fetching Pokemon data from the API.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Loading>;

export const Default: Story = {};

export const InContainer: Story = {
  name: "Inside a fixed container",
  render: () => (
    <div className="w-40 h-40 border border-gray-200 rounded flex items-center justify-center">
      <Loading />
    </div>
  ),
};
