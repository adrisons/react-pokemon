import { describe, it, expect, beforeEach } from "vitest";
import { useCompareStore } from "./compareStore";

beforeEach(() => {
  useCompareStore.setState({ slotA: null, slotB: null });
});

describe("GIVEN: compareStore", () => {
  describe("WHEN: setSlotA is called", () => {
    it("THEN: slotA is updated to the given id", () => {
      useCompareStore.getState().setSlotA("1");
      expect(useCompareStore.getState().slotA).toBe("1");
    });

    it("THEN: slotA can be set back to null", () => {
      useCompareStore.getState().setSlotA("1");
      useCompareStore.getState().setSlotA(null);
      expect(useCompareStore.getState().slotA).toBeNull();
    });
  });

  describe("WHEN: setSlotB is called", () => {
    it("THEN: slotB is updated to the given id", () => {
      useCompareStore.getState().setSlotB("25");
      expect(useCompareStore.getState().slotB).toBe("25");
    });

    it("THEN: slotB can be set back to null", () => {
      useCompareStore.getState().setSlotB("25");
      useCompareStore.getState().setSlotB(null);
      expect(useCompareStore.getState().slotB).toBeNull();
    });
  });

  describe("WHEN: selectPokemon is called with an empty store", () => {
    it("THEN: it fills slotA first and returns 'a'", () => {
      const result = useCompareStore.getState().selectPokemon("1");
      expect(result).toBe("a");
      expect(useCompareStore.getState().slotA).toBe("1");
      expect(useCompareStore.getState().slotB).toBeNull();
    });
  });

  describe("WHEN: selectPokemon is called with slotA already filled", () => {
    it("THEN: it fills slotB and returns 'b'", () => {
      useCompareStore.getState().selectPokemon("1");
      const result = useCompareStore.getState().selectPokemon("25");
      expect(result).toBe("b");
      expect(useCompareStore.getState().slotA).toBe("1");
      expect(useCompareStore.getState().slotB).toBe("25");
    });
  });

  describe("WHEN: selectPokemon is called and both slots are full", () => {
    it("THEN: it returns null and does not change any slot", () => {
      useCompareStore.getState().selectPokemon("1");
      useCompareStore.getState().selectPokemon("25");
      const result = useCompareStore.getState().selectPokemon("4");
      expect(result).toBeNull();
      expect(useCompareStore.getState().slotA).toBe("1");
      expect(useCompareStore.getState().slotB).toBe("25");
    });
  });

  describe("WHEN: selectPokemon is called with an id already in slotA", () => {
    it("THEN: it returns null (duplicate prevention)", () => {
      useCompareStore.getState().selectPokemon("1");
      const result = useCompareStore.getState().selectPokemon("1");
      expect(result).toBeNull();
      expect(useCompareStore.getState().slotA).toBe("1");
      expect(useCompareStore.getState().slotB).toBeNull();
    });
  });

  describe("WHEN: selectPokemon is called with an id already in slotB", () => {
    it("THEN: it returns null (duplicate prevention)", () => {
      useCompareStore.getState().selectPokemon("1");
      useCompareStore.getState().selectPokemon("25");
      const result = useCompareStore.getState().selectPokemon("25");
      expect(result).toBeNull();
    });
  });

  describe("WHEN: selectPokemon fills slotB after slotA was cleared", () => {
    it("THEN: slotA is filled again (not slotB)", () => {
      useCompareStore.getState().selectPokemon("1");
      useCompareStore.getState().selectPokemon("25");
      useCompareStore.getState().removePokemon("1");
      const result = useCompareStore.getState().selectPokemon("4");
      expect(result).toBe("a");
      expect(useCompareStore.getState().slotA).toBe("4");
      expect(useCompareStore.getState().slotB).toBe("25");
    });
  });

  describe("WHEN: removePokemon is called with the id in slotA", () => {
    it("THEN: slotA becomes null and slotB is unchanged", () => {
      useCompareStore.setState({ slotA: "1", slotB: "25" });
      useCompareStore.getState().removePokemon("1");
      expect(useCompareStore.getState().slotA).toBeNull();
      expect(useCompareStore.getState().slotB).toBe("25");
    });
  });

  describe("WHEN: removePokemon is called with the id in slotB", () => {
    it("THEN: slotB becomes null and slotA is unchanged", () => {
      useCompareStore.setState({ slotA: "1", slotB: "25" });
      useCompareStore.getState().removePokemon("25");
      expect(useCompareStore.getState().slotA).toBe("1");
      expect(useCompareStore.getState().slotB).toBeNull();
    });
  });

  describe("WHEN: removePokemon is called with an id in neither slot", () => {
    it("THEN: slots remain unchanged", () => {
      useCompareStore.setState({ slotA: "1", slotB: "25" });
      useCompareStore.getState().removePokemon("999");
      expect(useCompareStore.getState().slotA).toBe("1");
      expect(useCompareStore.getState().slotB).toBe("25");
    });
  });

  describe("WHEN: clear is called", () => {
    it("THEN: both slots become null", () => {
      useCompareStore.setState({ slotA: "1", slotB: "25" });
      useCompareStore.getState().clear();
      expect(useCompareStore.getState().slotA).toBeNull();
      expect(useCompareStore.getState().slotB).toBeNull();
    });
  });
});
