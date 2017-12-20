import {
  getDisposableToken,
  login,
  register
} from '../api'

export default {
  DISPOSABLE_TOKEN: ({ commit, dispatch, state }, { type }) => {
    return getDisposableToken(type).then((token) => {
      commit('SET_TOKEN', { token, type })
    })
  },
  LOGIN: ({ commit, dispatch, state }, { params, token }) => {
    return login(params, token)
  },
  REGISTER: ({ commit, dispatch, state }, { params, token }) => {
    return register(params, token)
  }
}
