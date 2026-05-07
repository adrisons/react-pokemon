/**
 * @typedef {Object} PokemonListItem
 * @property {string} name
 * @property {string} url
 */

/**
 * @typedef {Object} PokemonType
 * @property {number} slot
 * @property {{ name: string }} type
 */

/**
 * @typedef {Object} Pokemon
 * @property {number} id
 * @property {string} name
 * @property {PokemonType[]} types
 * @property {{ other: { dream_world: { front_default: string } }, front_default: string }} sprites
 * @property {Array} moves
 */
