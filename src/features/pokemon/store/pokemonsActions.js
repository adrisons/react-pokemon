import { PokemonsActionTypes } from "./pokemonsTypes";

export const setCurrentPageUrl = (currentPageUrl) => ({
  type: PokemonsActionTypes.SET_CURRENT_PAGE,
  payload: currentPageUrl,
});

export const setSearchResult = ({ nextPageUrl, previousPageUrl }) => ({
  type: PokemonsActionTypes.SET_SEARCH_RESULT,
  payload: { nextPageUrl, previousPageUrl },
});
