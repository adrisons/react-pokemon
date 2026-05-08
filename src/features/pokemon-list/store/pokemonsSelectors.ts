import { createSelector } from "reselect";
import type { PokemonsState } from "./pokemonsReducer";

interface RootState {
  pokemons: PokemonsState;
}

const selectPokemons = (state: RootState) => state.pokemons;

export const selectCurrentPageUrl = createSelector(
  [selectPokemons],
  (pokemons) => pokemons.currentPageUrl
);

export const selectNextPageUrl = createSelector(
  [selectPokemons],
  (pokemons) => pokemons.nextPageUrl
);

export const selectPreviousPageUrl = createSelector(
  [selectPokemons],
  (pokemons) => pokemons.previousPageUrl
);

export type { RootState };
