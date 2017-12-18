import Cookie from 'vue-cookie' 

export function saveToken (token) {
  window && (window.localStorage[ 'csrf' ] = token)
}
export function getToken () {
  let token = Cookie.get('csrf') 
  token = token || (window && window.localStorage[ 'csrf' ])
  return token
}
export function isLoggedIn () {
  const token = getToken()
  if (window && token) {
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