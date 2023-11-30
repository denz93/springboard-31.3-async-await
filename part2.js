
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
function fetchDesk() {
  return new Promise((resolve, reject) => {
    fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
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
function drawCard(deck_id) {
  return new Promise((resolve, reject) => {
    fetch(`https://deckofcardsapi.com/api/deck/${deck_id}/draw/?count=1`)
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

  function initDesk() {
    fetchDesk()
    .then(desk => {
      desk_id = desk.deck_id
      isRemaining = desk.remaining > 0
    })
  }

  initDesk()

  btnDraw.addEventListener('click', () => {
    if (isRemaining) {
      drawCard(desk_id)
      .then(drawResult => {
        const card = drawResult.cards[0]
        isRemaining = drawResult.remaining > 0
        addCardToPile(card)
      })
    } else {
      clearPile()
      initDesk()
    }
  })
})