import { test, expect } from "@playwright/test";
import { PokemonListPage } from "./pages/PokemonListPage";
import { PokemonDetailPage } from "./pages/PokemonDetailPage";

const HISTORY_STORAGE_KEY = "pokemon-history";

function makeHistoryEntries(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `pokemon-${i + 1}`,
    imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${i + 1}.png`,
    types: [{ slot: 1, typeName: "normal" }],
  }));
}

function serialisedHistory(entries: ReturnType<typeof makeHistoryEntries>) {
  return JSON.stringify({ state: { entries }, version: 0 });
}

test.describe("Recently Viewed carousel", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript((key) => {
      localStorage.removeItem(key);
    }, HISTORY_STORAGE_KEY);
  });

  test("carousel is not visible when history is empty", async ({ page }) => {
    const listPage = new PokemonListPage(page);
    await listPage.goto();

    await expect(listPage.recentlyViewedSection).toBeHidden();
  });

  test("visiting a Pokémon detail adds it as the first carousel entry", async ({
    page,
  }) => {
    const listPage = new PokemonListPage(page);
    const detailPage = new PokemonDetailPage(page);

    await listPage.goto();
    await listPage.clickPokemonDetail(0);
    await detailPage.isLoaded();

    const pokemonId = page.url().match(/\/detail\/(\d+)/)?.[1];
    const pokemonName = (await detailPage.getPokemonName())!.trim();

    await detailPage.clickBack();
    await listPage.getPokemonCards().first().waitFor({ state: "visible" });

    await expect(listPage.recentlyViewedSection).toBeVisible();

    const firstCard = listPage.getCarouselCards().first();
    await expect(firstCard).toBeVisible();
    await expect(firstCard).toHaveAttribute(
      "data-testid",
      `recently-viewed-${pokemonId}`,
    );
    await expect(firstCard).toContainText(pokemonName, { ignoreCase: true });
  });

  test("carousel arrows navigate correctly when there are many entries", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 700, height: 720 });

    const entries = makeHistoryEntries(10);
    await page.addInitScript(
      ({ key, data }) => {
        localStorage.setItem(key, data);
      },
      { key: HISTORY_STORAGE_KEY, data: serialisedHistory(entries) },
    );

    const listPage = new PokemonListPage(page);
    await listPage.goto();

    await expect(listPage.recentlyViewedSection).toBeVisible();
    await expect(listPage.getCarouselCards()).toHaveCount(10);

    await expect(listPage.carouselPrevBtn).toBeDisabled();
    await expect(listPage.carouselNextBtn).toBeEnabled();

    await listPage.carouselNextBtn.click();
    await expect(listPage.carouselPrevBtn).toBeEnabled();

    const MAX_CLICKS = 15;
    let clicks = 0;
    while (await listPage.carouselNextBtn.isEnabled() && clicks < MAX_CLICKS) {
      await listPage.carouselNextBtn.click();
      clicks++;
      await expect(listPage.carouselPrevBtn).toBeEnabled();
    }
    await expect(listPage.carouselNextBtn).toBeDisabled();

    await listPage.carouselPrevBtn.click();
    await expect(listPage.carouselNextBtn).toBeEnabled();

    clicks = 0;
    while (await listPage.carouselPrevBtn.isEnabled() && clicks < MAX_CLICKS) {
      await listPage.carouselPrevBtn.click();
      clicks++;
      await expect(listPage.carouselNextBtn).toBeEnabled();
    }
    await expect(listPage.carouselPrevBtn).toBeDisabled();
  });

  test("clicking a carousel card navigates to that Pokémon's detail", async ({
    page,
  }) => {
    const targetId = 25;
    const targetName = "pikachu";

    await page.addInitScript(
      ({ key, data }) => {
        localStorage.setItem(key, data);
      },
      {
        key: HISTORY_STORAGE_KEY,
        data: serialisedHistory([
          {
            id: targetId,
            name: targetName,
            imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${targetId}.png`,
            types: [{ slot: 1, typeName: "electric" }],
          },
        ]),
      },
    );

    const listPage = new PokemonListPage(page);
    await listPage.goto();

    const card = listPage.getCarouselCard(targetId);
    await expect(card).toBeVisible();
    await card.click();

    await expect(page).toHaveURL(/\/detail\/25/);

    const detailPage = new PokemonDetailPage(page);
    await detailPage.isLoaded();

    const name = await detailPage.getPokemonName();
    expect(name?.trim().toLowerCase()).toBe(targetName);
  });
});
