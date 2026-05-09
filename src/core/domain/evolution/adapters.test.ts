import { describe, it, expect } from "vitest";
import { adaptEvolutionChain } from "./adapters";
import type { RawChainLink } from "./api.types";

const bulbasaur: RawChainLink = {
  species: { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon-species/1/" },
  evolution_details: [],
  evolves_to: [
    {
      species: { name: "ivysaur", url: "https://pokeapi.co/api/v2/pokemon-species/2/" },
      evolution_details: [{ min_level: 16, item: null, trigger: { name: "level-up" } }],
      evolves_to: [
        {
          species: { name: "venusaur", url: "https://pokeapi.co/api/v2/pokemon-species/3/" },
          evolution_details: [{ min_level: 32, item: null, trigger: { name: "level-up" } }],
          evolves_to: [],
        },
      ],
    },
  ],
};

const singleStage: RawChainLink = {
  species: { name: "ditto", url: "https://pokeapi.co/api/v2/pokemon-species/132/" },
  evolution_details: [],
  evolves_to: [],
};

const tradeChain: RawChainLink = {
  species: { name: "kadabra", url: "https://pokeapi.co/api/v2/pokemon-species/64/" },
  evolution_details: [],
  evolves_to: [
    {
      species: { name: "alakazam", url: "https://pokeapi.co/api/v2/pokemon-species/65/" },
      evolution_details: [{ min_level: null, item: null, trigger: { name: "trade" } }],
      evolves_to: [],
    },
  ],
};

const itemChain: RawChainLink = {
  species: { name: "pikachu", url: "https://pokeapi.co/api/v2/pokemon-species/25/" },
  evolution_details: [],
  evolves_to: [
    {
      species: { name: "raichu", url: "https://pokeapi.co/api/v2/pokemon-species/26/" },
      evolution_details: [{ min_level: null, item: { name: "thunder-stone" }, trigger: { name: "use-item" } }],
      evolves_to: [],
    },
  ],
};

describe("adaptEvolutionChain", () => {
  describe("GIVEN a 3-stage linear chain", () => {
    it("THEN returns all 3 stages in order", () => {
      const stages = adaptEvolutionChain(bulbasaur);
      expect(stages).toHaveLength(3);
      expect(stages.map((s) => s.name)).toEqual(["bulbasaur", "ivysaur", "venusaur"]);
    });

    it("THEN first stage has no trigger and imageUrl is null", () => {
      const stages = adaptEvolutionChain(bulbasaur);
      expect(stages[0].trigger).toBeNull();
      expect(stages[0].imageUrl).toBeNull();
    });

    it("THEN second stage trigger is level-based", () => {
      const stages = adaptEvolutionChain(bulbasaur);
      expect(stages[1].trigger).toBe("Lv. 16");
    });

    it("THEN third stage trigger is level-based", () => {
      const stages = adaptEvolutionChain(bulbasaur);
      expect(stages[2].trigger).toBe("Lv. 32");
    });

    it("THEN pokemonId is extracted from species url", () => {
      const stages = adaptEvolutionChain(bulbasaur);
      expect(stages[0].pokemonId).toBe(1);
      expect(stages[1].pokemonId).toBe(2);
      expect(stages[2].pokemonId).toBe(3);
    });
  });

  describe("GIVEN a single-stage pokemon", () => {
    it("THEN returns 1 stage", () => {
      const stages = adaptEvolutionChain(singleStage);
      expect(stages).toHaveLength(1);
      expect(stages[0].name).toBe("ditto");
      expect(stages[0].trigger).toBeNull();
    });
  });

  describe("GIVEN a trade evolution chain", () => {
    it("THEN trigger is 'trade'", () => {
      const stages = adaptEvolutionChain(tradeChain);
      expect(stages[1].trigger).toBe("trade");
    });
  });

  describe("GIVEN an item evolution chain", () => {
    it("THEN trigger is the item name formatted", () => {
      const stages = adaptEvolutionChain(itemChain);
      expect(stages[1].trigger).toBe("thunder stone");
    });
  });
});
