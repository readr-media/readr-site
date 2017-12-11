export function saveToken (token) {
  window && (window.localStorage[ 'csrf' ] = token)
}
export function getToken () {
  return window && window.localStorage[ 'csrf' ]
}
export function isLoggedIn () {
  const token = getToken()
  if (token && window) {
    const payload = JSON.parse(window.atob(token.split('.')[1]))
    return payload.exp > Date.now() / 1000
  } else {
    return false
  }
}
export function currentUser () {
  if (isLoggedIn()) {
    const token = getToken()
    const payload = JSON.parse(window.atob(token.split('.')[1]))
    return {
      id: payload.id,
      email: payload.email
    }
  }
}