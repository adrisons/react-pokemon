import { cachedFetch, type CachedFetchOptions } from "./httpCache";

const BASE_URL = "https://pokeapi.co/api/v2";

async function request<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export function get<T>(path: string, options?: CachedFetchOptions): Promise<T> {
  const url = path.startsWith("http") ? path : `${BASE_URL}${path}`;
  return cachedFetch<T>(url, () => request<T>(url), options);
}
