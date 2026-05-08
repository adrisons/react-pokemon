import { applyMiddleware, combineReducers, createStore } from "redux";
import logger from "redux-logger";
import { pokemonsReducer } from "@features/pokemon-list/store";

const rootReducer = combineReducers({
  pokemons: pokemonsReducer,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const middlewares: any[] = [];
if (import.meta.env["DEV"]) {
  middlewares.push(logger);
}

export const store = createStore(rootReducer, applyMiddleware(...middlewares));
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
