import { test, expect } from "@playwright/test";
import { PokemonListPage } from "./pages/PokemonListPage";
import { PokemonDetailPage } from "./pages/PokemonDetailPage";

test.describe("Pokémon app", () => {
  test("usuario ve lista de pokémon al abrir la app", async ({ page }) => {
    const listPage = new PokemonListPage(page);
    await listPage.goto();

    const count = await listPage.getPokemonCount();
    expect(count).toBeGreaterThan(0);
    await expect(listPage.searchInput).toBeVisible();
  });

  test("usuario puede paginar entre resultados", async ({ page }) => {
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

  test("usuario puede hacer click en pokémon y ver el detalle", async ({
    page,
  }) => {
    const listPage = new PokemonListPage(page);
    const detailPage = new PokemonDetailPage(page);

    await listPage.goto();
    await listPage.clickPokemonDetail(0);
    await detailPage.isLoaded();

    const name = await detailPage.getPokemonName();
    expect(name?.trim().length).toBeGreaterThan(0);

    const src = await detailPage.getImageSrc();
    expect(src).toBeTruthy();
  });

  test("usuario puede volver a la lista desde el detalle", async ({ page }) => {
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
