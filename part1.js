/**
 * ========== Part 1 ==========
 */

/**
 * @typedef {Object} Fact
 * @property {string} text
 * @property {boolean} found
 * @property {nnumber} number
 * @property {"trivia"|"date"|"math"|"year"} type
 * @returns {Promise<Fact>}
 */
function fetchNumberFact(number) {
  return new Promise((resolve, reject) => {
    const params = new URLSearchParams({
      json: true
    })
    fetch(`http://numbersapi.com/${number}?${params.toString()}`)
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
 * @param {number[]} numbers 
 * @returns {Promise<Record<string,string>>}
 */
function fetchMultipleNumberFacts(numbers) {
  return new Promise((resolve, reject) => {
    fetch(`http://numbersapi.com/${numbers.join(',')}/trivia?json=true`)
    .then(res => {
      if (res.ok) {
        return resolve(res.json())
      } else {
        reject(res)
      }
    })
  })
}

window.onload = () => {
  const result = document.getElementById('result')
  const btnFact93 = document.getElementById('btnFact93')
  const btnMultipleFacts = document.getElementById('btnMultipleFacts')
  const btn4Facts = document.getElementById('btn4Facts')

  btnFact93.addEventListener('click', () => {
    fetchNumberFact(93)
    .then(fact => {
      result.innerHTML = fact.text
    })
  })

  btnMultipleFacts.addEventListener('click', () => {
    fetchMultipleNumberFacts([3, 4, 5])
    .then(facts => {
      const text = Object.values(facts).join('<br/>')
      result.innerHTML = text
    })
  })

  btn4Facts.addEventListener('click', () => {
    Promise.all([
      fetchNumberFact(11),
      fetchNumberFact(11),
      fetchNumberFact(11),
      fetchNumberFact(11)
    ])
    .then(facts => {
      const text = facts.map(f => f.text).join('<br/>')
      result.innerHTML = text
    })
  })
}
