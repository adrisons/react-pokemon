import type { AnyAction } from "redux";
import { PokemonsActionTypes } from "./pokemonsTypes";

export interface PokemonsState {
  currentPageUrl: string;
  nextPageUrl: string | null;
  previousPageUrl: string | null;
}

const INITIAL_STATE: PokemonsState = {
  currentPageUrl: "https://pokeapi.co/api/v2/pokemon",
  nextPageUrl: null,
  previousPageUrl: null,
};

const pokemonsReducer = (
  state: PokemonsState = INITIAL_STATE,
  action: AnyAction
): PokemonsState => {
  switch (action.type) {
    case PokemonsActionTypes.SET_CURRENT_PAGE:
      return { ...state, currentPageUrl: action.payload as string };
    case PokemonsActionTypes.SET_SEARCH_RESULT:
      return {
        ...state,
        nextPageUrl: (action.payload as { nextPageUrl: string | null }).nextPageUrl,
        previousPageUrl: (action.payload as { previousPageUrl: string | null }).previousPageUrl,
      };
    default:
      return state;
  }
};

export default pokemonsReducer;
