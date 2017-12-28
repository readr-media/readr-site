import {
  addPost,
  checkLoginStatus,
  getDisposableToken,
  getProfile,
  getMembers,
  login,
  register,
  verifyRecaptchaToken
} from '../api'

export default {
  ADD_POST: ({ commit, dispatch, state }, { params }) => {
    return addPost(params)
  },
  CHECK_LOGIN_STATUS: ({ commit, dispatch, state }) => {
    return checkLoginStatus().then(({ status, body }) => {
      commit('SET_LOGGEIN_STATUS', { status, body })
    })
  },
  DISPOSABLE_TOKEN: ({ commit, dispatch, state }, { type }) => {
    return getDisposableToken(type).then((token) => {
      commit('SET_TOKEN', { token, type })
    })
  },
  GET_MEMBERS: ({ commit, dispatch, state }, { params }) => {
    return getMembers({ params }).then(({ status, body }) => {
      if (status === 200) {
        commit('SET_MEMBERS', { members: body })
      }
    })
  },
  GET_PROFILE: ({ commit, dispatch, state }) => {
    return getProfile().then(({ status, body }) => {
      if (status === 200) {
        commit('SET_PROFILE', { profile: body })
      }
    })
  },
  LOGIN: ({ commit, dispatch, state }, { params, token }) => {
    return login(params, token).then(({ status, profile }) => {
      commit('SET_PROFILE', { profile })
      return { status }
    })
  },
  REGISTER: ({ commit, dispatch, state }, { params, token }) => {
    return register(params, token)
  },
  VERIFY_RECAPTCHA_TOKEN: ({ commit, dispatch, state }, { token }) => {
    return verifyRecaptchaToken(token)
  }
}
