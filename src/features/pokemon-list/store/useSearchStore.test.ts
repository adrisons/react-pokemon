import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useSearchStore } from "./useSearchStore";

vi.mock("./index", () => ({
  usePokemonListStore: {
    getState: vi.fn(),
  },
}));

import { usePokemonListStore } from "./index";

const mockedGetState = vi.mocked(usePokemonListStore.getState);

const FAKE_POKEMONS = [
  { id: 1, name: "bulbasaur", url: "" },
  { id: 4, name: "charmander", url: "" },
  { id: 7, name: "squirtle", url: "" },
  { id: 25, name: "pikachu", url: "" },
];

beforeEach(() => {
  vi.useFakeTimers();
  useSearchStore.getState().reset();
  mockedGetState.mockReturnValue({
    loadAllPokemons: vi.fn().mockResolvedValue(FAKE_POKEMONS),
  } as never);
});

afterEach(() => {
  vi.useRealTimers();
});

describe("useSearchStore", () => {
  describe("open / close / toggle", () => {
    it("opens the search", () => {
      useSearchStore.getState().open();
      expect(useSearchStore.getState().isOpen).toBe(true);
    });

    it("closes the search", () => {
      useSearchStore.getState().open();
      useSearchStore.getState().close();
      expect(useSearchStore.getState().isOpen).toBe(false);
    });

    it("toggles the search", () => {
      useSearchStore.getState().toggle();
      expect(useSearchStore.getState().isOpen).toBe(true);
      useSearchStore.getState().toggle();
      expect(useSearchStore.getState().isOpen).toBe(false);
    });
  });

  describe("setQuery", () => {
    it("updates the query immediately", () => {
      useSearchStore.getState().setQuery("pika");
      expect(useSearchStore.getState().query).toBe("pika");
    });

    it("sets searching=true when query is non-empty", () => {
      useSearchStore.getState().setQuery("char");
      expect(useSearchStore.getState().searching).toBe(true);
    });

    it("clears results for empty query without debounce", () => {
      useSearchStore.getState().setQuery("");
      expect(useSearchStore.getState().results).toEqual([]);
      expect(useSearchStore.getState().searching).toBe(false);
      expect(useSearchStore.getState().notFound).toBe(false);
    });

    it("filters matching Pokémon after debounce", async () => {
      useSearchStore.getState().setQuery("char");
      await vi.advanceTimersByTimeAsync(200);

      const { results, searching, notFound } = useSearchStore.getState();
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe("charmander");
      expect(searching).toBe(false);
      expect(notFound).toBe(false);
    });

    it("sets notFound when no Pokémon match", async () => {
      useSearchStore.getState().setQuery("mewtwo");
      await vi.advanceTimersByTimeAsync(200);

      expect(useSearchStore.getState().notFound).toBe(true);
      expect(useSearchStore.getState().results).toEqual([]);
    });

    it("limits results to MAX_SUGGESTIONS (8)", async () => {
      const manyPokemons = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        name: `pokemon-${i}`,
        url: "",
      }));
      mockedGetState.mockReturnValue({
        loadAllPokemons: vi.fn().mockResolvedValue(manyPokemons),
      } as never);

      useSearchStore.getState().setQuery("pokemon");
      await vi.advanceTimersByTimeAsync(200);

      expect(useSearchStore.getState().results).toHaveLength(8);
    });

    it("handles API errors gracefully", async () => {
      mockedGetState.mockReturnValue({
        loadAllPokemons: vi.fn().mockRejectedValue(new Error("network")),
      } as never);

      useSearchStore.getState().setQuery("pika");
      await vi.advanceTimersByTimeAsync(200);

      expect(useSearchStore.getState().notFound).toBe(true);
      expect(useSearchStore.getState().results).toEqual([]);
      expect(useSearchStore.getState().searching).toBe(false);
    });
  });

  describe("reset", () => {
    it("clears query, results and flags", async () => {
      useSearchStore.getState().setQuery("pika");
      await vi.advanceTimersByTimeAsync(200);

      useSearchStore.getState().reset();
      const state = useSearchStore.getState();
      expect(state.query).toBe("");
      expect(state.results).toEqual([]);
      expect(state.notFound).toBe(false);
      expect(state.searching).toBe(false);
    });

    it("cancels pending debounce", async () => {
      useSearchStore.getState().setQuery("char");
      useSearchStore.getState().reset();
      await vi.advanceTimersByTimeAsync(200);

      expect(useSearchStore.getState().results).toEqual([]);
    });
  });
});
