import { applyMiddleware, combineReducers, createStore } from "redux";
import logger from "redux-logger";
import { pokemonsReducer } from "@features/pokemon/store";

const rootReducer = combineReducers({
  pokemons: pokemonsReducer,
});

const middlewares = [];
if (process.env.NODE_ENV === "development") {
  middlewares.push(logger);
}

export const store = createStore(rootReducer, applyMiddleware(...middlewares));
