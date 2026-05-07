const BASE_URL = "https://pokeapi.co/api/v2";

async function request(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }
  return response.json();
}

export function get(path) {
  const url = path.startsWith("http") ? path : `${BASE_URL}${path}`;
  return request(url);
}
