import { createSelector } from "reselect";

const selectPokemons = (state) => state.pokemons;

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
