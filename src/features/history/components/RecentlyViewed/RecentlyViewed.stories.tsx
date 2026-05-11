import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router-dom";
import { useEffect } from "react";
import RecentlyViewed from "./RecentlyViewed";
import { useHistoryStore } from "@features/history/store/historyStore";
import type { HistoryEntry } from "@features/history/store/historyStore";
import type { PokemonType } from "@core/domain/pokemon/models";

const SPRITE_URL = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

const sampleEntries: HistoryEntry[] = [
  { id: 25, name: "pikachu", imageUrl: SPRITE_URL(25), types: [{ slot: 1, typeName: "electric" }] },
  { id: 6, name: "charizard", imageUrl: SPRITE_URL(6), types: [{ slot: 1, typeName: "fire" }, { slot: 2, typeName: "flying" }] },
  { id: 150, name: "mewtwo", imageUrl: SPRITE_URL(150), types: [{ slot: 1, typeName: "psychic" }] },
  { id: 1, name: "bulbasaur", imageUrl: SPRITE_URL(1), types: [{ slot: 1, typeName: "grass" }, { slot: 2, typeName: "poison" }] },
  { id: 94, name: "gengar", imageUrl: SPRITE_URL(94), types: [{ slot: 1, typeName: "ghost" }, { slot: 2, typeName: "poison" }] },
];

const manyEntries: HistoryEntry[] = [
  ...sampleEntries,
  { id: 130, name: "gyarados", imageUrl: SPRITE_URL(130), types: [{ slot: 1, typeName: "water" }, { slot: 2, typeName: "flying" }] },
  { id: 149, name: "dragonite", imageUrl: SPRITE_URL(149), types: [{ slot: 1, typeName: "dragon" }, { slot: 2, typeName: "flying" }] },
  { id: 143, name: "snorlax", imageUrl: SPRITE_URL(143), types: [{ slot: 1, typeName: "normal" }] },
  { id: 9, name: "blastoise", imageUrl: SPRITE_URL(9), types: [{ slot: 1, typeName: "water" }] },
  { id: 3, name: "venusaur", imageUrl: SPRITE_URL(3), types: [{ slot: 1, typeName: "grass" }, { slot: 2, typeName: "poison" }] },
];

const singleType: PokemonType[] = [{ slot: 1, typeName: "normal" }];

const noImageEntries: HistoryEntry[] = [
  { id: 999, name: "missingno", imageUrl: null, types: singleType },
  { id: 998, name: "glitchmon", imageUrl: "https://invalid.example/404.png", types: singleType },
];

/**
 * Seeds the Zustand history store before the story renders,
 * and cleans up on unmount so stories don't leak state.
 */
function SeedHistory({ entries, children }: { entries: HistoryEntry[]; children: React.ReactNode }) {
  useEffect(() => {
    useHistoryStore.setState({ entries });
    return () => { useHistoryStore.setState({ entries: [] }); };
  }, [entries]);

  return <>{children}</>;
}

const meta: Meta<typeof RecentlyViewed> = {
  title: "Features/RecentlyViewed",
  component: RecentlyViewed,
  tags: ["autodocs"],
  decorators: [
    (Story, context) => {
      const entries = (context.args as Record<string, unknown>)._entries as HistoryEntry[] | undefined;
      return (
        <MemoryRouter initialEntries={["/react-pokemon/"]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <SeedHistory entries={entries ?? sampleEntries}>
            <div className="max-w-3xl mx-auto p-4">
              <Story />
            </div>
          </SeedHistory>
        </MemoryRouter>
      );
    },
  ],
  parameters: {
    docs: {
      description: {
        component:
          "Horizontal carousel of recently viewed Pokémon. Shows up to 10 entries from the Zustand history store. Supports trackpad horizontal scroll, drag-free mode, and paged arrow navigation.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof RecentlyViewed>;

export const Default: Story = {
  name: "5 entries",
};

export const Full: Story = {
  name: "10 entries (max)",
  args: { _entries: manyEntries } as unknown as Record<string, unknown>,
};

export const SingleEntry: Story = {
  name: "Single entry",
  args: {
    _entries: [sampleEntries[0]],
  } as unknown as Record<string, unknown>,
};

export const FallbackImages: Story = {
  name: "Fallback images (null / broken URL)",
  args: { _entries: noImageEntries } as unknown as Record<string, unknown>,
};

export const Empty: Story = {
  name: "Empty (hidden)",
  args: { _entries: [] } as unknown as Record<string, unknown>,
  parameters: {
    docs: {
      description: {
        story: "When there are no entries, the component renders nothing.",
      },
    },
  },
};
