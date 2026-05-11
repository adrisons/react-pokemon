import { expect, type Locator, type Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class ComparePage extends BasePage {
  readonly backButton: Locator;
  readonly selectorA: Locator;
  readonly selectorB: Locator;
  readonly compareStats: Locator;
  readonly compareInsights: Locator;

  constructor(page: Page) {
    super(page);
    this.backButton = page.getByTestId("compare-back-btn");
    this.selectorA = page.getByTestId("pokemon-selector").first();
    this.selectorB = page.getByTestId("pokemon-selector").last();
    this.compareStats = page.getByTestId("compare-stats");
    this.compareInsights = page.getByTestId("compare-insights");
  }

  private compareApiResponse() {
    return this.page.waitForResponse(
      (r) => r.url().includes("pokeapi.co/api/v2/pokemon/") && r.status() === 200,
    );
  }

  async goto(params?: { a?: string; b?: string }) {
    const qs = new URLSearchParams();
    if (params?.a) qs.set("a", params.a);
    if (params?.b) qs.set("b", params.b);
    const suffix = qs.toString() ? `?${qs}` : "";
    await this.navigate(`compare${suffix}`);
  }

  async gotoWithBoth(idA: string, idB: string) {
    await Promise.all([
      this.compareApiResponse(),
      this.navigate(`compare?a=${idA}&b=${idB}`),
    ]);
    await this.compareStats.waitFor({ state: "visible" });
  }

  getInputA() {
    return this.selectorA.getByTestId("selector-input");
  }

  getInputB() {
    return this.selectorB.getByTestId("selector-input");
  }

  getClearA() {
    return this.selectorA.getByTestId("selector-clear-btn");
  }

  getClearB() {
    return this.selectorB.getByTestId("selector-clear-btn");
  }

  getDropdownA() {
    return this.selectorA.getByTestId("selector-dropdown");
  }

  getDropdownB() {
    return this.selectorB.getByTestId("selector-dropdown");
  }

  async searchAndSelect(selector: Locator, term: string) {
    const input = selector.getByTestId("selector-input");
    await input.fill(term);
    const dropdown = selector.getByTestId("selector-dropdown");
    await dropdown.waitFor({ state: "visible" });
    await dropdown.locator("li").first().click();
  }

  async selectPokemonA(term: string) {
    await this.searchAndSelect(this.selectorA, term);
  }

  async selectPokemonB(term: string) {
    await this.searchAndSelect(this.selectorB, term);
  }

  getStatRow(statName: string) {
    return this.page.getByTestId(`stat-row-${statName}`);
  }

  getStatA(statName: string) {
    return this.page.getByTestId(`stat-a-${statName}`);
  }

  getStatB(statName: string) {
    return this.page.getByTestId(`stat-b-${statName}`);
  }

  getTotalA() {
    return this.page.getByTestId("total-a");
  }

  getTotalB() {
    return this.page.getByTestId("total-b");
  }

  async isEmptyState() {
    const text = this.page.getByText("Search for two Pokémon to begin comparing");
    await expect(text).toBeVisible();
  }

  async isHalfState() {
    const text = this.page.getByText("Now pick a second Pokémon to challenge");
    await expect(text).toBeVisible();
  }

  async clickBack() {
    await this.backButton.click();
  }
}
