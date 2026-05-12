import { expect, type Locator, type Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class PokemonListPage extends BasePage {
  readonly searchTrigger: Locator;
  readonly searchCommandInput: Locator;
  readonly nextPageButton: Locator;
  readonly prevPageButton: Locator;
  readonly notFoundMessage: Locator;

  readonly recentlyViewedSection: Locator;
  readonly carouselPrevBtn: Locator;
  readonly carouselNextBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.searchTrigger = page.getByTestId("search-trigger");
    this.searchCommandInput = page.getByTestId("search-command-input");
    this.nextPageButton = page.getByTestId("pagination-next-btn");
    this.prevPageButton = page.getByTestId("pagination-prev-btn");
    this.notFoundMessage = page.getByTestId("search-command-empty");

    this.recentlyViewedSection = page.getByTestId("recently-viewed-carousel");
    this.carouselPrevBtn = this.recentlyViewedSection.locator('[data-slot="carousel-previous"]');
    this.carouselNextBtn = this.recentlyViewedSection.locator('[data-slot="carousel-next"]');
  }

  private pokemonListResponse() {
    return this.page.waitForResponse(
      (r) => r.url().includes("pokeapi.co/api/v2/pokemon") && r.status() === 200
    );
  }

  async goto() {
    await Promise.all([this.pokemonListResponse(), this.navigate("")]);
    await this.getPokemonCards().first().waitFor({ state: "visible" });
  }

  getPokemonCards() {
    return this.page.getByTestId("pokemon-card");
  }

  async getPokemonCount() {
    await expect(this.getPokemonCards().first()).toBeVisible();
    return this.getPokemonCards().count();
  }

  async getPokemonName(index: number) {
    const card = this.getPokemonCards().nth(index);
    await card.waitFor({ state: "visible" });
    return card.getAttribute("data-pokemon-name");
  }

  async clickNextPage() {
    const nameBefore = await this.getPokemonCards().first().getAttribute("data-pokemon-name");
    await this.nextPageButton.click();
    await expect(this.getPokemonCards().first()).not.toHaveAttribute("data-pokemon-name", nameBefore!);
  }

  async clickPreviousPage() {
    const nameBefore = await this.getPokemonCards().first().getAttribute("data-pokemon-name");
    await this.prevPageButton.click();
    await expect(this.getPokemonCards().first()).not.toHaveAttribute("data-pokemon-name", nameBefore!);
  }

  async search(term: string) {
    await this.searchTrigger.click();
    await this.searchCommandInput.fill(term);
    await this.waitForNetworkIdle();
  }

  async clickPokemonDetail(index: number) {
    const card = this.getPokemonCards().nth(index);
    await card.hover();
    const btn = card.getByTestId("pokemon-card-detail-btn");
    await btn.waitFor({ state: "visible" });
    await btn.click();
  }

  getCarouselCards() {
    return this.recentlyViewedSection.locator('[data-testid^="recently-viewed-"]');
  }

  getCarouselCard(pokemonId: number) {
    return this.page.getByTestId(`recently-viewed-${pokemonId}`);
  }
}
