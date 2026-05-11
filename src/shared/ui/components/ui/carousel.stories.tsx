import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./carousel";

function SlideCard({ label, color }: { label: string; color: string }) {
  return (
    <div
      className="flex items-center justify-center rounded-xl text-sm font-semibold h-40"
      style={{ background: color, color: "#fff" }}
    >
      {label}
    </div>
  );
}

const COLORS = ["#e11d48", "#2563eb", "#16a34a", "#d97706", "#7c3aed", "#0891b2"];

const meta: Meta<typeof Carousel> = {
  title: "Shared/Carousel",
  component: Carousel,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Embla-based carousel primitive (shadcn). Supports horizontal/vertical orientation, drag, keyboard navigation, and custom plugins.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Carousel>;

export const Horizontal: Story = {
  render: () => (
    <div className="max-w-sm mx-auto px-12">
      <Carousel>
        <CarouselContent>
          {COLORS.map((c, i) => (
            <CarouselItem key={i}>
              <SlideCard label={`Slide ${i + 1}`} color={c} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  ),
};

export const MultipleSlidesVisible: Story = {
  name: "Multiple slides visible",
  render: () => (
    <div className="max-w-lg mx-auto px-12">
      <Carousel opts={{ align: "start" }}>
        <CarouselContent className="-ml-3">
          {COLORS.map((c, i) => (
            <CarouselItem key={i} className="pl-3 basis-1/3">
              <SlideCard label={`${i + 1}`} color={c} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  ),
};

export const DragFree: Story = {
  name: "Drag-free mode",
  render: () => (
    <div className="max-w-md mx-auto px-12">
      <Carousel opts={{ dragFree: true }}>
        <CarouselContent className="-ml-2">
          {COLORS.map((c, i) => (
            <CarouselItem key={i} className="pl-2 basis-1/3">
              <SlideCard label={`${i + 1}`} color={c} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="max-w-xs mx-auto py-12">
      <Carousel orientation="vertical" className="h-48">
        <CarouselContent className="-mt-4 h-48">
          {COLORS.map((c, i) => (
            <CarouselItem key={i} className="pt-4 basis-full">
              <SlideCard label={`Slide ${i + 1}`} color={c} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  ),
};
