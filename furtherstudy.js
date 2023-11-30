/**
 * @typedef {Object} ResourceItem
 * @property {string} name 
 * @property {string} url
 * 
 * @typedef {Object} Sprites
 * @property {string} back_default
 * @property {string} front_default
 * 
 * @typedef {Object} Pokemon 
 * @property {string} name 
 * @property {number} id
 * @property {ResourceItem} species
 * @property {Sprites} sprites
 * 
 * @typedef {Object} Pagination
 * @property {number} count
 * @property {string|null} next
 * @property {string|null} previous
 * @property {ResourceItem[]} results
 * 
 * @typedef {Object} FavorTextEntry
 * @property {string} flavor_text
 * @property {ResourceItem} language
 * 
 * @typedef {Object} Species
 * @property {string} name
 * @property {FavorTextEntry[]} flavor_text_entries
 */

/**
 * 
 * @param {number} limit 
 * @returns {Promise<Pagination>}
 */
async function fetchPokemonList(limit=60) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`)
  if (res.ok) return await res.json()
  throw res
}

/**
 * 
 * @param {number|string} pokemonId 
 * @returns {Promise<Pokemon>}
 */
async function fetchPokemon(pokemonId) {
  const res = await fetch(typeof pokemonId === 'number' ? `https://pokeapi.co/api/v2/pokemon/${pokemonId}` : pokemonId)
 if (res.ok) return await res.json()
  throw res
}

/**
 * 
 * @param {number|string} speciesId 
 * @returns {Promise<Species>}
 */
async function fetchSpecies(speciesId) {
  const res = await fetch(typeof speciesId === 'number' ? `https://pokeapi.co/api/v2/pokemon-species/${speciesId}` : speciesId)
  if (res.ok) return await res.json()
  throw res
}
 
window.addEventListener('load', async () => {
  const btnCatch = document.getElementById('btnCatch')
  const pokemonListEle = document.querySelector('.pokemon-list')
  /** @type {ResourceItem[]} */
  let pokemonList = []

  try {
    const res = await fetchPokemonList()
    pokemonList = res.results
  } catch (e) {}
 

  /**
   * 
   * @param {Pokemon} pokemon 
   * @param {string} favorText 
   */
  function addPokemonToList(pokemon, favorText) {
    const div = document.createElement('div')
    div.classList.add('pokemon')
    div.innerHTML = `
      <h3 class="pokemon__name">${pokemon.name}</h3>
      <div class="pokemon__image">
        <img src="${pokemon.sprites.front_default}">
      </div>
      <p class="pokemon__favor-text">${favorText}</p>
    `
    pokemonListEle.appendChild(div)
  }

  btnCatch.addEventListener('click', async () => {
    if (pokemonList.length === 0) {
      return
    }
    const randomIdx = Math.floor(Math.random() * (pokemonList.length-1))
    const pokemonItem = pokemonList[randomIdx]
    const pokemon = await fetchPokemon(pokemonItem.url)
    const species = await fetchSpecies(pokemon.species.url)
    const enEntry = species.flavor_text_entries.find(entry => entry.language.name === 'en')
    addPokemonToList(pokemon, enEntry.flavor_text)
    pokemonList.splice(randomIdx, 1)

    

  })
})