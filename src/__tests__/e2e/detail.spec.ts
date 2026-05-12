import { test, expect } from "@playwright/test";
import { PokemonDetailPage } from "./pages/PokemonDetailPage";

test.describe("Pokémon detail — stats & abilities", () => {
  test("all six stat bars are visible with numeric values", async ({ page }) => {
    const detail = new PokemonDetailPage(page);
    await detail.goto(1);

    for (const stat of detail.getStatNames()) {
      const row = detail.getStatRow(stat);
      await expect(row).toBeVisible();

      const text = await row.textContent();
      expect(text).toMatch(/\d+/);
    }
  });

  test("abilities section lists at least one ability", async ({ page }) => {
    const detail = new PokemonDetailPage(page);
    await detail.goto(1);

    const abilities = detail.getAbilities();
    const count = await abilities.count();
    expect(count).toBeGreaterThanOrEqual(1);

    await expect(abilities.first()).toContainText(/.+/);
  });

  test("hidden ability is marked when present", async ({ page }) => {
    const detail = new PokemonDetailPage(page);
    await detail.goto(1);

    const abilities = detail.getAbilities();
    const count = await abilities.count();

    let foundHidden = false;
    for (let i = 0; i < count; i++) {
      const text = await abilities.nth(i).textContent();
      if (text?.toLowerCase().includes("hidden")) {
        foundHidden = true;
        break;
      }
    }
    expect(foundHidden).toBe(true);
  });
});

test.describe("Pokémon detail — Pokédex Intel", () => {
  test("Pokédex Intel section renders with all tiles", async ({ page }) => {
    const detail = new PokemonDetailPage(page);
    await detail.goto(1);

    await expect(detail.pokedexIntel).toBeVisible();

    const tiles = [
      "density",
      "comparison",
      "movepool",
      "hidden-ability",
      "rarity",
      "capture-rate",
      "weaknesses",
    ];

    for (const tile of tiles) {
      await expect(detail.getIntelTile(tile)).toBeVisible();
    }
  });

  test("density tile shows a numeric value", async ({ page }) => {
    const detail = new PokemonDetailPage(page);
    await detail.goto(1);

    const text = await detail.getIntelTile("density").textContent();
    expect(text).toMatch(/\d/);
    expect(text).toMatch(/kg\/m²/);
  });

  test("weaknesses tile shows type badges", async ({ page }) => {
    const detail = new PokemonDetailPage(page);
    await detail.goto(1);

    const tile = detail.getIntelTile("weaknesses");
    await expect(tile).toBeVisible();

    const badges = tile.locator('[data-testid^="weakness-"]');
    const count = await badges.count();
    expect(count).toBeGreaterThan(0);
  });
});

test.describe("Evolution Chain", () => {
  test("renders for a Pokémon with evolutions (Bulbasaur line)", async ({ page }) => {
    const detail = new PokemonDetailPage(page);
    await detail.goto(1);

    await expect(detail.evolutionChain).toBeVisible();

    await expect(detail.getEvolutionStage(1)).toBeVisible();
    await expect(detail.getEvolutionStage(2)).toBeVisible();
    await expect(detail.getEvolutionStage(3)).toBeVisible();
  });

  test("current stage is disabled and marked as current page", async ({ page }) => {
    const detail = new PokemonDetailPage(page);
    await detail.goto(1);

    const current = detail.getEvolutionStage(1);
    await expect(current).toBeDisabled();
    await expect(current).toHaveAttribute("aria-current", "page");
  });

  test("clicking a different stage navigates to that detail", async ({ page }) => {
    const detail = new PokemonDetailPage(page);
    await detail.goto(1);

    const ivysaur = detail.getEvolutionStage(2);
    await expect(ivysaur).toBeEnabled();
    await ivysaur.click();

    await expect(page).toHaveURL(/\/detail\/2/);
    await expect(detail.pokemonName).toHaveText(/ivysaur/i);
  });

  test("does not render for a single-stage Pokémon", async ({ page }) => {
    const detail = new PokemonDetailPage(page);
    await detail.goto(132);

    await expect(detail.evolutionChain).toBeHidden();
  });
});

test.describe("Detail → Compare flow", () => {
  test("compare button navigates to compare page with current id", async ({ page }) => {
    const detail = new PokemonDetailPage(page);
    await detail.goto(25);

    await detail.clickCompare();
    await expect(page).toHaveURL(/\/compare\?a=25/);
  });
});
