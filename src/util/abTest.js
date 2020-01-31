import VueCookie from 'vue-cookie'
import bigInt from 'big-integer'
import uuidv4 from 'uuid/v4'

const DEFAULT_DISTRIBUTION = [
  { id: 'A', weight: 50 },
  { id: 'B', weight: 50 }
]

function getCookie () {
  const decodedCookie = decodeURIComponent(document.cookie)
  const cookies = decodedCookie.split(';').map(cookie => cookie.trim())
  let cookie = cookies.find(cookie => cookie.match(/^readrid=/))
  cookie = cookie ? cookie.replace('readrid=', '') : cookie
  return cookie
}

function getDistributionWeight (distribution) {
  let accumulator = 0
  const total = distribution.map(item => item.weight).reduce((acc, cur) => acc + cur, 0)
  return distribution.map(item => {
    accumulator = accumulator + Math.round(item.weight / total * 100)
    return accumulator > 100 ? 100 : accumulator
  })
}

function setCookie () {
  VueCookie.set('readrid', uuidv4(), { expires: '1Y' })
}

function uuidToLargeNumber (uuid) {
  return bigInt(uuid.replace(/-/g, ''), 128).toString()
}

export function getIndicator (distribution = DEFAULT_DISTRIBUTION) {
  if (this && this.$route && this.$route.query.ab) {
    return this.$route.query.ab.toUpperCase()
  }
  let readrId = getCookie()
  if (!readrId) {
    setCookie()
    readrId = getCookie()
  }
  const readrIdConverted = uuidToLargeNumber(readrId)
  const identifier = parseInt(readrIdConverted.substr(readrIdConverted.length - 2))
  const weights = getDistributionWeight(distribution)
  for (let [ index, value ] of weights.entries()) {
    if (value > identifier) {
      return distribution[index].id
    }
  }
}
