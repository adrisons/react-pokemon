import { PokemonsActionTypes } from "./pokemonsTypes";

export const setCurrentPageUrl = (currentPageUrl: string) => ({
  type: PokemonsActionTypes.SET_CURRENT_PAGE as typeof PokemonsActionTypes.SET_CURRENT_PAGE,
  payload: currentPageUrl,
});

export const setSearchResult = ({
  nextPageUrl,
  previousPageUrl,
}: {
  nextPageUrl: string | null;
  previousPageUrl: string | null;
}) => ({
  type: PokemonsActionTypes.SET_SEARCH_RESULT as typeof PokemonsActionTypes.SET_SEARCH_RESULT,
  payload: { nextPageUrl, previousPageUrl },
});

export type PokemonsAction =
  | ReturnType<typeof setCurrentPageUrl>
  | ReturnType<typeof setSearchResult>;
