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
function fetchPokemonList(limit=60) {
  return new Promise((resolve, reject) => {
    fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`)
    .then(res => {
      if (res.ok) {
        return resolve(res.json())
      } else {
        reject(res)
      }
    })
  })
}

/**
 * 
 * @param {number|string} pokemonId 
 * @returns {Promise<Pokemon>}
 */
function fetchPokemon(pokemonId) {
  console.log({pokemonId})
  return new Promise((resolve, reject) => {
    fetch(typeof pokemonId === 'number' ? `https://pokeapi.co/api/v2/pokemon/${pokemonId}` : pokemonId)
    .then(res => {
      if (res.ok) {
        return resolve(res.json())
      } else {
        reject(res)
      }
    })
  })
}

/**
 * 
 * @param {number|string} speciesId 
 * @returns {Promise<Species>}
 */
function fetchSpecies(speciesId) {
  return new Promise((resolve, reject) => {
    fetch(typeof speciesId === 'number' ? `https://pokeapi.co/api/v2/pokemon-species/${speciesId}` : speciesId)
    .then(res => {
      if (res.ok) {
        return resolve(res.json())
      } else {
        reject(res)
      }
    })
  })
}

window.addEventListener('load', () => {
  const btnCatch = document.getElementById('btnCatch')
  const pokemonListEle = document.querySelector('.pokemon-list')
  /** @type {ResourceItem[]} */
  let pokemonList = []

  fetchPokemonList()
  .then(res => {
    pokemonList = res.results
  })

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

  btnCatch.addEventListener('click', () => {
    if (pokemonList.length === 0) {
      return
    }
    const randomIdx = Math.floor(Math.random() * (pokemonList.length-1))
    const pokemon = pokemonList[randomIdx]

    fetchPokemon(pokemon.url)
    .then(pokemon => {
      fetchSpecies(pokemon.species.url)
      .then(species => {
        const enEntry = species.flavor_text_entries.find(entry => entry.language.name === 'en')
        addPokemonToList(pokemon, enEntry.flavor_text)
        pokemonList.splice(randomIdx, 1)
      })
    })

  })
})