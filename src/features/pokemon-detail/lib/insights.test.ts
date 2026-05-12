import { describe, it, expect } from "vitest";
import {
  getWeightComparison,
  getHeightComparison,
  formatRatio,
  formatHeightRatio,
  getDensity,
  getMovePoolVerdict,
  getCaptureVerdict,
  getRarityStatus,
} from "./insights";

describe("getWeightComparison", () => {
  it("returns a close reference for a light Pokémon (0.5 kg)", () => {
    const { ref, ratio } = getWeightComparison(0.5);
    expect(ref.icon).toBeDefined();
    expect(ratio).toBeCloseTo(0.5 / ref.weight);
  });

  it("returns a close reference for a heavy Pokémon (500 kg)", () => {
    const { ref, ratio } = getWeightComparison(500);
    expect(ratio).toBeCloseTo(500 / ref.weight);
  });

  it("clamps near-zero weight to 0.001", () => {
    const { ref } = getWeightComparison(0);
    expect(ref).toBeDefined();
  });
});

describe("getHeightComparison", () => {
  it("returns a close reference for a short Pokémon (0.3 m)", () => {
    const { ref, ratio } = getHeightComparison(0.3);
    expect(ratio).toBeCloseTo(0.3 / ref.height);
  });

  it("returns a close reference for a tall Pokémon (10 m)", () => {
    const { ref, ratio } = getHeightComparison(10);
    expect(ratio).toBeCloseTo(10 / ref.height);
  });

  it("clamps near-zero height to 0.001", () => {
    const { ref } = getHeightComparison(0);
    expect(ref).toBeDefined();
  });
});

describe("formatRatio", () => {
  it("returns 'about the same as' for ratios near 1", () => {
    expect(formatRatio(1.0)).toBe("about the same as");
    expect(formatRatio(0.95)).toBe("about the same as");
    expect(formatRatio(1.05)).toBe("about the same as");
  });

  it("returns 'heavier than' for ratios > 1.08", () => {
    expect(formatRatio(2.5)).toContain("heavier than");
  });

  it("returns 'lighter than' for ratios < 0.92", () => {
    expect(formatRatio(0.3)).toContain("lighter than");
  });

  it("formats large ratios without decimals", () => {
    expect(formatRatio(15)).toBe("15× heavier than");
  });

  it("formats very small ratios without decimals", () => {
    expect(formatRatio(0.05)).toBe("20× lighter than");
  });
});

describe("formatHeightRatio", () => {
  it("returns 'about as tall as' for ratios near 1", () => {
    expect(formatHeightRatio(1.0)).toBe("about as tall as");
  });

  it("returns 'taller than' for ratios > 1.08", () => {
    expect(formatHeightRatio(3.0)).toContain("taller than");
  });

  it("returns 'shorter than' for ratios < 0.92", () => {
    expect(formatHeightRatio(0.5)).toContain("shorter than");
  });

  it("formats large ratios without decimals", () => {
    expect(formatHeightRatio(12)).toBe("12× taller than");
  });

  it("formats very small ratios without decimals", () => {
    expect(formatHeightRatio(0.08)).toBe("13× shorter than");
  });
});

describe("getDensity", () => {
  it("returns 'Denser than a neutron star' for extreme density", () => {
    const v = getDensity(100_000, 1);
    expect(v.label).toBe("Denser than a neutron star");
    expect(v.tone).toBe("extreme");
  });

  it("returns 'Denser than osmium' for very high density", () => {
    const v = getDensity(5000, 2);
    expect(v.label).toBe("Denser than osmium");
    expect(v.tone).toBe("extreme");
  });

  it("returns 'Solid metal core' for high density", () => {
    const v = getDensity(500, 1);
    expect(v.label).toBe("Solid metal core");
    expect(v.tone).toBe("high");
  });

  it("returns 'Stout & sturdy' for above-average density", () => {
    const v = getDensity(100, 1);
    expect(v.label).toBe("Stout & sturdy");
    expect(v.tone).toBe("high");
  });

  it("returns 'Average build' for normal density", () => {
    const v = getDensity(50, 1);
    expect(v.label).toBe("Average build");
    expect(v.tone).toBe("normal");
  });

  it("returns 'Lean & airy' for low density", () => {
    const v = getDensity(10, 1);
    expect(v.label).toBe("Lean & airy");
    expect(v.tone).toBe("low");
  });

  it("returns 'Practically floating' for very low density", () => {
    const v = getDensity(1, 1);
    expect(v.label).toBe("Practically floating");
    expect(v.tone).toBe("ghostly");
  });

  it("calculates value as kg/m²", () => {
    const v = getDensity(80, 2);
    expect(v.value).toBe(20);
  });
});

describe("getMovePoolVerdict", () => {
  it("returns 'Master of all trades' for 90+ moves", () => {
    const v = getMovePoolVerdict(95);
    expect(v.label).toBe("Master of all trades");
    expect(v.fillRatio).toBeCloseTo(0.95);
  });

  it("returns 'Highly versatile' for 60-89 moves", () => {
    expect(getMovePoolVerdict(65).label).toBe("Highly versatile");
  });

  it("returns 'Well-rounded' for 35-59 moves", () => {
    expect(getMovePoolVerdict(40).label).toBe("Well-rounded");
  });

  it("returns 'Focused fighter' for 18-34 moves", () => {
    expect(getMovePoolVerdict(20).label).toBe("Focused fighter");
  });

  it("returns 'Specialist' for <18 moves", () => {
    expect(getMovePoolVerdict(10).label).toBe("Specialist");
  });

  it("caps fillRatio at 1", () => {
    expect(getMovePoolVerdict(150).fillRatio).toBe(1);
  });
});

describe("getCaptureVerdict", () => {
  it("returns 'Practically jumps in the ball' for rate >= 220", () => {
    const v = getCaptureVerdict(255);
    expect(v.label).toBe("Practically jumps in the ball");
    expect(v.tone).toBe("good");
    expect(v.ballsApprox).toBe(1);
  });

  it("returns 'Easy catch' for rate >= 150", () => {
    expect(getCaptureVerdict(180).label).toBe("Easy catch");
  });

  it("returns 'Bring snacks' for rate >= 75", () => {
    expect(getCaptureVerdict(100).label).toBe("Bring snacks");
  });

  it("returns 'Bring a lot of snacks' for rate >= 30", () => {
    expect(getCaptureVerdict(45).label).toBe("Bring a lot of snacks");
  });

  it("returns 'Master Ball territory' for rate < 30", () => {
    const v = getCaptureVerdict(3);
    expect(v.label).toBe("Master Ball territory");
    expect(v.tone).toBe("extreme");
  });

  it("clamps rate to minimum 1 for ballsApprox", () => {
    const v = getCaptureVerdict(0);
    expect(v.ballsApprox).toBe(255);
  });
});

describe("getRarityStatus", () => {
  it("returns mythical when isMythical is true", () => {
    const r = getRarityStatus({ isMythical: true, isLegendary: false, isBaby: false });
    expect(r.kind).toBe("mythical");
    expect(r.tone).toBe("mythical");
  });

  it("returns legendary when isLegendary is true", () => {
    const r = getRarityStatus({ isMythical: false, isLegendary: true, isBaby: false });
    expect(r.kind).toBe("legendary");
  });

  it("returns baby when isBaby is true", () => {
    const r = getRarityStatus({ isMythical: false, isLegendary: false, isBaby: true });
    expect(r.kind).toBe("baby");
    expect(r.tone).toBe("baby");
  });

  it("returns common for regular Pokémon", () => {
    const r = getRarityStatus({ isMythical: false, isLegendary: false, isBaby: false });
    expect(r.kind).toBe("common");
  });

  it("prioritises mythical over legendary and baby", () => {
    const r = getRarityStatus({ isMythical: true, isLegendary: true, isBaby: true });
    expect(r.kind).toBe("mythical");
  });
});
