import type { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class PokemonDetailPage extends BasePage {
  readonly backButton: Locator;
  readonly pokemonName: Locator;
  readonly pokemonId: Locator;

  constructor(page: Page) {
    super(page);
    this.backButton = page.locator("button.pokemon-back-btn");
    this.pokemonName = page.locator("h1.detail-pokemon-name");
    this.pokemonId = page.locator(".detail-pokemon-id");
  }

  async getPokemonName() {
    return this.pokemonName.textContent();
  }

  async getImageSrc() {
    const img = this.page.locator(".detail-hero-image img");
    return img.getAttribute("src");
  }

  getTypesBadges() {
    return this.page.locator(".detail-hero-left .flex span");
  }

  async clickBack() {
    await this.backButton.click();
  }

  async isLoaded() {
    await this.pokemonName.waitFor({ state: "visible" });
  }
}
