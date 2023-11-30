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
async function fetchNumberFact(number) {
  const params = new URLSearchParams({
    json: true
  })
  const res = await fetch(`http://numbersapi.com/${number}?${params.toString()}`)
  if (res.ok) {
    return await res.json()
  }
  throw res 
}

/**
 * 
 * @param {number[]} numbers 
 * @returns {Promise<Record<string,string>>}
 */
async function fetchMultipleNumberFacts(numbers) {
  const res = await fetch(`http://numbersapi.com/${numbers.join(',')}/trivia?json=true`)
  if (res.ok)
    return await res.json()
  throw res
}

window.onload = () => {
  const result = document.getElementById('result')
  const btnFact93 = document.getElementById('btnFact93')
  const btnMultipleFacts = document.getElementById('btnMultipleFacts')
  const btn4Facts = document.getElementById('btn4Facts')

  btnFact93.addEventListener('click', async () => {
    const fact = await fetchNumberFact(93)
    result.innerHTML = fact.text
  })

  btnMultipleFacts.addEventListener('click', async () => {
    const facts = await fetchMultipleNumberFacts([3, 4, 5])
    const text = Object.values(facts).join('<br/>')
    result.innerHTML = text
    
  })

  btn4Facts.addEventListener('click', async () => {
    const facts = [
      await fetchNumberFact(11),
      await fetchNumberFact(11),
      await fetchNumberFact(11),
      await fetchNumberFact(11)
    ]
    
    const text = facts.map(f => f.text).join('<br/>')
    result.innerHTML = text
    
  })
}
