import { describe, it, expect } from "vitest";
import { DSA_PROBLEMS, getProblemBySlug } from "./problems";

describe("DSA problem dataset", () => {
  it("exposes a non-empty curated list", () => {
    expect(DSA_PROBLEMS.length).toBeGreaterThanOrEqual(10);
  });

  it("has unique slugs", () => {
    const slugs = DSA_PROBLEMS.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("uses url-safe slugs", () => {
    for (const p of DSA_PROBLEMS) {
      expect(p.slug).toMatch(/^[a-z0-9-]+$/);
    }
  });

  it("gives every problem a title, statement, at least one example and constraints", () => {
    for (const p of DSA_PROBLEMS) {
      expect(p.title.trim()).not.toBe("");
      expect(p.statement.trim().length).toBeGreaterThan(20);
      expect(p.examples.length).toBeGreaterThan(0);
      expect(p.constraints.length).toBeGreaterThan(0);
    }
  });

  it("provides JavaScript starter code for every problem", () => {
    for (const p of DSA_PROBLEMS) {
      expect(p.starterCode.javascript).toBeTruthy();
    }
  });

  it("only uses valid difficulty levels", () => {
    const valid = new Set(["Easy", "Medium", "Hard"]);
    for (const p of DSA_PROBLEMS) {
      expect(valid.has(p.difficulty)).toBe(true);
    }
  });

  it("looks up a problem by slug and returns undefined for unknown", () => {
    expect(getProblemBySlug("two-sum")?.title).toBe("Two Sum");
    expect(getProblemBySlug("does-not-exist")).toBeUndefined();
  });
});
