import { test, expect } from "@playwright/test";
import { PokemonListPage } from "./pages/PokemonListPage";
import { PokemonDetailPage } from "./pages/PokemonDetailPage";

test.describe("Pokémon app", () => {
  test("user sees Pokémon list on app load", async ({ page }) => {
    const listPage = new PokemonListPage(page);
    await listPage.goto();

    const count = await listPage.getPokemonCount();
    expect(count).toBeGreaterThan(0);
    await expect(listPage.searchTrigger).toBeVisible();
  });

  test("user can paginate through results", async ({ page }) => {
    const listPage = new PokemonListPage(page);
    await listPage.goto();

    const firstName = await listPage.getPokemonName(0);
    await expect(listPage.nextPageButton).toBeVisible();

    await listPage.clickNextPage();
    const firstNameAfterNext = await listPage.getPokemonName(0);
    expect(firstNameAfterNext).not.toBe(firstName);

    await expect(listPage.prevPageButton).toBeVisible();
    await listPage.clickPreviousPage();
    const firstNameAfterPrev = await listPage.getPokemonName(0);
    expect(firstNameAfterPrev).toBe(firstName);
  });

  test("user can click a Pokémon and view its detail", async ({
    page,
  }) => {
    const listPage = new PokemonListPage(page);
    const detailPage = new PokemonDetailPage(page);

    await listPage.goto();
    await listPage.clickPokemonDetail(0);
    await detailPage.isLoaded();

    await expect(detailPage.pokemonName).not.toBeEmpty();

    const src = await detailPage.getImageSrc();
    expect(src).toBeTruthy();
  });

  test("user can navigate back to the list from the detail page", async ({ page }) => {
    const listPage = new PokemonListPage(page);
    const detailPage = new PokemonDetailPage(page);

    await listPage.goto();
    await listPage.clickPokemonDetail(0);
    await detailPage.isLoaded();

    await detailPage.clickBack();

    await expect(page).toHaveURL(/\/react-pokemon\/?$/);
    const count = await listPage.getPokemonCount();
    expect(count).toBeGreaterThan(0);
  });
});
