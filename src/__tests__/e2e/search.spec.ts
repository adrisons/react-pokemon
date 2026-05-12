import { test, expect } from "@playwright/test";
import { PokemonListPage } from "./pages/PokemonListPage";
import { PokemonDetailPage } from "./pages/PokemonDetailPage";

test.describe("Search Command Dialog", () => {
  test("opens when clicking the search trigger", async ({ page }) => {
    const listPage = new PokemonListPage(page);
    await listPage.goto();

    await listPage.searchTrigger.click();
    await expect(listPage.searchCommandInput).toBeVisible();
  });

  test("opens with ⌘K shortcut", async ({ page }) => {
    const listPage = new PokemonListPage(page);
    await listPage.goto();

    await page.keyboard.press("Meta+k");
    await expect(listPage.searchCommandInput).toBeVisible();
  });

  test("typing shows suggestion results", async ({ page }) => {
    const listPage = new PokemonListPage(page);
    await listPage.goto();

    await listPage.search("pika");
    await expect(listPage.getSearchCommandItems().first()).toBeVisible();
  });

  test("clicking a suggestion navigates to detail", async ({ page }) => {
    const listPage = new PokemonListPage(page);
    const detailPage = new PokemonDetailPage(page);

    await listPage.goto();
    await listPage.search("pikachu");

    const firstItem = listPage.getSearchCommandItems().first();
    await firstItem.click();

    await detailPage.isLoaded();
    await expect(page).toHaveURL(/\/detail\/\d+/);
  });

  test("keyboard navigation selects and confirms a suggestion", async ({ page }) => {
    const listPage = new PokemonListPage(page);
    const detailPage = new PokemonDetailPage(page);

    await listPage.goto();
    await listPage.search("char");

    const items = listPage.getSearchCommandItems();
    await expect(items.first()).toBeVisible();

    await listPage.searchCommandInput.press("ArrowDown");
    await listPage.searchCommandInput.press("Enter");

    await detailPage.isLoaded();
    await expect(page).toHaveURL(/\/detail\/\d+/);
  });

  test("shows empty state for non-matching query", async ({ page }) => {
    const listPage = new PokemonListPage(page);
    await listPage.goto();

    await listPage.search("zzzznotapokemon");
    await expect(listPage.notFoundMessage).toBeVisible();
    await expect(listPage.notFoundMessage).toContainText("No Pokémon match");
  });

  test("pressing Enter on non-matching query navigates to filtered list", async ({ page }) => {
    const listPage = new PokemonListPage(page);
    await listPage.goto();

    await listPage.search("zzzznotapokemon");
    await expect(listPage.notFoundMessage).toBeVisible();

    await listPage.searchCommandInput.press("Enter");
    await expect(page).toHaveURL(/[?&]q=zzzznotapokemon/);
  });

  test("dialog closes with Escape", async ({ page }) => {
    const listPage = new PokemonListPage(page);
    await listPage.goto();

    await listPage.searchTrigger.click();
    await expect(listPage.searchCommandInput).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(listPage.searchCommandInput).toBeHidden();
  });
});

test.describe("Search query param filtering (?q=)", () => {
  test("navigating with ?q= shows filtered results and active banner", async ({ page }) => {
    const listPage = new PokemonListPage(page);
    await listPage.gotoWithQuery("bulbasaur");

    await expect(listPage.searchActiveBanner).toBeVisible();
    await expect(listPage.searchActiveBanner).toContainText("bulbasaur");
    await expect(listPage.getPokemonCards().first()).toBeVisible();
  });

  test("clearing the banner removes the filter", async ({ page }) => {
    const listPage = new PokemonListPage(page);
    await listPage.gotoWithQuery("bulbasaur");

    await expect(listPage.searchActiveBanner).toBeVisible();
    await listPage.searchClearBtn.click();

    await expect(listPage.searchActiveBanner).toBeHidden();
    await expect(page).not.toHaveURL(/[?&]q=/);
  });

  test("non-matching query shows not-found state", async ({ page }) => {
    const listPage = new PokemonListPage(page);
    await listPage.gotoWithQuery("zzzznotapokemon");

    await expect(listPage.searchNotFound).toBeVisible();
    await expect(listPage.searchNotFound).toContainText("Not even a nibble");
  });
});
