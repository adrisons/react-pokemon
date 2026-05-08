import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("GIVEN: cn (className utility)", () => {
  it("THEN: returns a single class string unchanged", () => {
    expect(cn("foo")).toBe("foo");
  });

  it("THEN: merges multiple class strings", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("THEN: deduplicates conflicting Tailwind classes (last wins)", () => {
    expect(cn("p-4", "p-8")).toBe("p-8");
  });

  it("THEN: ignores falsy values", () => {
    expect(cn("foo", false, undefined, null as unknown as string, "bar")).toBe("foo bar");
  });

  it("THEN: handles conditional objects", () => {
    expect(cn({ "text-red-500": true, "text-blue-500": false })).toBe("text-red-500");
  });

  it("THEN: handles arrays of classes", () => {
    expect(cn(["foo", "bar"])).toBe("foo bar");
  });

  it("THEN: returns empty string for no arguments", () => {
    expect(cn()).toBe("");
  });
});
