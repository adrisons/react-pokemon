import type { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

const STAT_NAMES = ["hp", "attack", "defense", "special-attack", "special-defense", "speed"] as const;

export class PokemonDetailPage extends BasePage {
  readonly backButton: Locator;
  readonly pokemonName: Locator;
  readonly pokemonId: Locator;
  readonly compareButton: Locator;
  readonly evolutionChain: Locator;
  readonly pokedexIntel: Locator;

  constructor(page: Page) {
    super(page);
    this.backButton = page.locator('[data-testid="back-to-list-btn"]');
    this.pokemonName = page.locator('[data-testid="detail-pokemon-name"]');
    this.pokemonId = page.locator('[data-testid="detail-pokemon-id"]');
    this.compareButton = page.getByTestId("detail-compare-btn");
    this.evolutionChain = page.getByTestId("evolution-chain");
    this.pokedexIntel = page.getByTestId("pokedex-intel");
  }

  async goto(id: number) {
    await Promise.all([
      this.page.waitForResponse(
        (r) => r.url().includes(`pokeapi.co/api/v2/pokemon/${id}`) && r.status() === 200,
      ),
      this.navigate(`detail/${id}`),
    ]);
    await this.pokemonName.waitFor({ state: "visible" });
  }

  async getPokemonName() {
    return this.pokemonName.textContent();
  }

  async getImageSrc() {
    const img = this.page.locator('[data-testid="detail-hero-image"] img');
    return img.getAttribute("src");
  }

  getTypesBadges() {
    return this.page.locator('[data-testid="detail-pokemon-name"] ~ div span');
  }

  getStatRow(name: string) {
    return this.page.getByTestId(`detail-stat-${name}`);
  }

  getStatNames() {
    return STAT_NAMES;
  }

  getAbilities() {
    return this.page.locator('[aria-labelledby="abilities-heading"] > div > div');
  }

  getEvolutionStage(pokemonId: number) {
    return this.page.getByTestId(`evolution-stage-${pokemonId}`);
  }

  getIntelTile(name: string) {
    return this.page.getByTestId(`intel-${name}`);
  }

  async clickBack() {
    await this.backButton.click();
  }

  async clickCompare() {
    await this.compareButton.click();
  }

  async isLoaded() {
    await this.pokemonName.waitFor({ state: "visible" });
  }
}
