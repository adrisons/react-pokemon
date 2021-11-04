import { PokemonsActionTypes } from "./pokemons.types";

const INITIAL_STATE = {
  currentPageUrl: "https://pokeapi.co/api/v2/pokemon",
  nextPageUrl: null,
  previousPageUrl: null,
};

const pokemonsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case PokemonsActionTypes.SET_CURRENT_PAGE:
      return {
        ...state,
        currentPageUrl: action.payload,
      };
    case PokemonsActionTypes.SET_SEARCH_RESULT:
      return {
        ...state,
        nextPageUrl: action.payload.nextPageUrl,
        previousPageUrl: action.payload.previousPageUrl,
      };
    default:
      return state;
  }
};

export default pokemonsReducer;
