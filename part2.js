
/**
 * ========== Part 2 ==========
 */

/**
 * @typedef {Object} Desk
 * @property {string} deck_id
 * @property {number} remaining
 * @property {boolean} shuffled
 * @property {boolean} success
 * @returns {Promise<Desk>}
 */
async function fetchDesk() {
  const res = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
  if (res.ok) {
    return await res.json()
  }
  throw res
}

/**
 * @typedef {Object} ImageMap
 * @property {string} svg
 * @property {string} png
 * 
 * @typedef {Object} Card
 * @property {string} suit
 * @property {string} value
 * @property {string} code 
 * @property {string} image
 * @property {ImageMap[]} images
 * 
 * @typedef DrawResult
 * @property {Card[]} cards
 * @property {string} deck_id
 * @property {number} remaining
 * @property {boolean} success
 * 
 * @param {string} deck_id 
 * @returns {Promise<DrawResult>}
 */ 
async function drawCard(deck_id) {
  const res = await fetch(`https://deckofcardsapi.com/api/deck/${deck_id}/draw/?count=1`)
  if (res.ok) return await res.json()
  throw res
}



window.addEventListener('load', async () => {
  const btnDraw = document.getElementById('btnDraw')
  const cardPile = document.querySelector('.card-pile')
  let desk_id = null
  let isRemaining = false

  function randomRotation(){
    return Math.floor(Math.random() * 360) + 'deg';
  }
  /**
   * 
   * @param {Card} card 
   */
  function addCardToPile(card) {
    const cardElement = document.createElement('div')
    cardElement.classList.add('card')
    cardElement.style.setProperty('--rotation', randomRotation())
    cardElement.innerHTML = `
      <img src="https://deckofcardsapi.com/static/img/back.png">
    `
    cardPile.appendChild(cardElement)

    const realImage = new Image()
    realImage.src = card.image
    realImage.addEventListener('load', () => {
      cardElement.removeChild(cardElement.children[0])
      cardElement.appendChild(realImage)
    }, { once: true })
  }

  function clearPile() {
    cardPile.innerHTML = ''
  }

  async function initDesk() {
    const desk = await fetchDesk()
    desk_id = desk.deck_id
    isRemaining = desk.remaining > 0
  }

  initDesk()

  btnDraw.addEventListener('click', async () => {
    if (isRemaining) {
      const drawResult = await drawCard(desk_id)
      const card = drawResult.cards[0]
      isRemaining = drawResult.remaining > 0
      addCardToPile(card)

    } else {
      clearPile()
      initDesk()
    }
  })
})