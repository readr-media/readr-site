import Cookie from 'vue-cookie'

export function saveToken (token) {
  window && window.localStorage.setItem('csrf', token)
}
export function getToken () {
  if (window) {
    let token = Cookie.get('csrf')
    token = token || (window && window.localStorage.getItem('csrf'))
    return token
  } else {
    return undefined
  }
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
      email: payload.email,
      name: payload.name,
      nickname: payload.nickname
    }
  }
}
export function removeToken () {
  return new Promise((resolve) => {
    window && Cookie.delete('csrf')
    window && (window.localStorage.removeItem('csrf'))
    resolve()
  })
}
