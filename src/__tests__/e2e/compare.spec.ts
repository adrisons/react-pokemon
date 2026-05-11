import { test, expect } from "@playwright/test";
import { PokemonListPage } from "./pages/PokemonListPage";
import { ComparePage } from "./pages/ComparePage";

const STAT_NAMES = ["hp", "attack", "defense", "special-attack", "special-defense", "speed"];

test.describe("Compare page", () => {
  test("shows empty state when no Pokémon is selected", async ({ page }) => {
    const comparePage = new ComparePage(page);
    await comparePage.goto();

    await comparePage.isEmptyState();
    await expect(comparePage.compareStats).toBeHidden();
    await expect(comparePage.backButton).toBeVisible();
  });

  test("selector B is disabled until Pokémon A is chosen", async ({ page }) => {
    const comparePage = new ComparePage(page);
    await comparePage.goto();

    await expect(comparePage.getInputA()).toBeEnabled();
    await expect(comparePage.getInputB()).toBeDisabled();
  });

  test("searching shows dropdown suggestions and selects Pokémon A", async ({ page }) => {
    const comparePage = new ComparePage(page);
    await comparePage.goto();

    const inputA = comparePage.getInputA();
    await inputA.fill("bulba");

    const dropdownA = comparePage.getDropdownA();
    await dropdownA.waitFor({ state: "visible" });

    const options = dropdownA.locator("li");
    await expect(options.first()).toBeVisible();

    await options.first().click();
    await expect(inputA).toBeHidden();

    await expect(comparePage.getClearA()).toBeVisible();
    await expect(page).toHaveURL(/[?&]a=\d+/);
  });

  test("shows half state after selecting only Pokémon A", async ({ page }) => {
    const comparePage = new ComparePage(page);
    await comparePage.goto();

    await comparePage.selectPokemonA("bulba");
    await comparePage.isHalfState();
    await expect(comparePage.getInputB()).toBeEnabled();
  });

  test("selecting both Pokémon loads compare stats", async ({ page }) => {
    const comparePage = new ComparePage(page);
    await comparePage.goto();

    await comparePage.selectPokemonA("bulba");
    await comparePage.selectPokemonB("char");

    await expect(comparePage.compareStats).toBeVisible();
    await expect(page).toHaveURL(/[?&]a=\d+/);
    await expect(page).toHaveURL(/[?&]b=\d+/);
  });

  test("stat rows display values for both Pokémon", async ({ page }) => {
    const comparePage = new ComparePage(page);
    await comparePage.gotoWithBoth("1", "4");

    for (const stat of STAT_NAMES) {
      await expect(comparePage.getStatRow(stat)).toBeVisible();
      const valA = await comparePage.getStatA(stat).textContent();
      const valB = await comparePage.getStatB(stat).textContent();
      expect(Number(valA)).toBeGreaterThan(0);
      expect(Number(valB)).toBeGreaterThan(0);
    }
  });

  test("BST totals are shown and non-zero", async ({ page }) => {
    const comparePage = new ComparePage(page);
    await comparePage.gotoWithBoth("1", "4");

    const totalA = await comparePage.getTotalA().textContent();
    const totalB = await comparePage.getTotalB().textContent();
    expect(Number(totalA)).toBeGreaterThan(0);
    expect(Number(totalB)).toBeGreaterThan(0);
  });

  test("clearing Pokémon A returns to empty state", async ({ page }) => {
    const comparePage = new ComparePage(page);
    await comparePage.goto();

    await comparePage.selectPokemonA("pika");
    await expect(comparePage.getClearA()).toBeVisible();

    await comparePage.getClearA().click();
    await comparePage.isEmptyState();
    await expect(page).not.toHaveURL(/[?&]a=\d+/);
  });

  test("keyboard navigation works in selector dropdown", async ({ page }) => {
    const comparePage = new ComparePage(page);
    await comparePage.goto();

    const inputA = comparePage.getInputA();
    await inputA.fill("char");
    const dropdown = comparePage.getDropdownA();
    await dropdown.waitFor({ state: "visible" });

    await inputA.press("ArrowDown");
    const first = dropdown.locator("li").first();
    await expect(first).toHaveAttribute("aria-selected", "true");

    await inputA.press("Enter");
    await expect(dropdown).toBeHidden();
    await expect(comparePage.getClearA()).toBeVisible();
  });

  test("back button navigates to the list", async ({ page }) => {
    const comparePage = new ComparePage(page);
    await comparePage.goto();

    await comparePage.clickBack();
    await expect(page).toHaveURL(/\/react-pokemon\/?$/);
  });

  test("direct URL with both params renders stats immediately", async ({ page }) => {
    const comparePage = new ComparePage(page);
    await comparePage.gotoWithBoth("25", "6");

    await expect(comparePage.compareStats).toBeVisible();

    for (const stat of STAT_NAMES) {
      await expect(comparePage.getStatRow(stat)).toBeVisible();
    }
    await expect(comparePage.getTotalA()).toBeVisible();
    await expect(comparePage.getTotalB()).toBeVisible();
  });
});

test.describe("Compare flow from PokemonCard", () => {
  test("selecting two cards from the list navigates to compare", async ({ page }) => {
    const listPage = new PokemonListPage(page);
    await listPage.goto();

    const firstCard = listPage.getPokemonCards().first();
    const secondCard = listPage.getPokemonCards().nth(1);

    await firstCard.hover();
    await firstCard.getByTestId("compare-btn").click();
    await expect(firstCard.getByTestId("compare-btn")).toContainText("Selected");

    await secondCard.hover();
    await secondCard.getByTestId("compare-btn").click();

    await expect(page).toHaveURL(/\/compare\?a=\d+&b=\d+/);

    const comparePage = new ComparePage(page);
    await expect(comparePage.compareStats).toBeVisible();
  });

  test("toggling a selected card removes it from compare", async ({ page }) => {
    const listPage = new PokemonListPage(page);
    await listPage.goto();

    const card = listPage.getPokemonCards().first();
    await card.hover();

    const compareBtn = card.getByTestId("compare-btn");
    await compareBtn.click();
    await expect(compareBtn).toContainText("Selected");

    await compareBtn.click();
    await expect(compareBtn).toContainText("Compare");
  });
});
