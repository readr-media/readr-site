import {
  getDisposableToken,
  getProfile,
  login,
  register,
  verifyRecaptchaToken
} from '../api'

export default {
  DISPOSABLE_TOKEN: ({ commit, dispatch, state }, { type }) => {
    return getDisposableToken(type).then((token) => {
      commit('SET_TOKEN', { token, type })
    })
  },
  GET_PROFILE: ({ commit, dispatch }) => {
    return getProfile().then(({ body }) => {
      commit('SET_PROFILE', { profile: body })
    })
  },
  LOGIN: ({ commit, dispatch, state }, { params, token }) => {
    return login(params, token).then(({ profile }) => {
      commit('SET_PROFILE', { profile })
    })
  },
  REGISTER: ({ commit, dispatch, state }, { params, token }) => {
    return register(params, token)
  },
  VERIFY_RECAPTCHA_TOKEN: ({ commit, dispatch, state }, { token }) => {
    return verifyRecaptchaToken(token)
  }
}
