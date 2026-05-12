import { describe, it, expect } from "vitest";
import { statColorVar } from "./statColors";

describe("statColorVar", () => {
  it("returns the CSS variable for a known stat", () => {
    expect(statColorVar("hp")).toBe("var(--color-stat-hp)");
    expect(statColorVar("attack")).toBe("var(--color-stat-attack)");
    expect(statColorVar("defense")).toBe("var(--color-stat-defense)");
    expect(statColorVar("special-attack")).toBe("var(--color-stat-special-attack)");
    expect(statColorVar("special-defense")).toBe("var(--color-stat-special-defense)");
    expect(statColorVar("speed")).toBe("var(--color-stat-speed)");
  });

  it("returns the muted fallback for an unknown stat", () => {
    expect(statColorVar("unknown")).toBe("var(--color-text-muted)");
    expect(statColorVar("")).toBe("var(--color-text-muted)");
  });
});
