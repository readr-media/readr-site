import {
  addMember,
  addPost,
  checkLoginStatus,
  deleteMember,
  getDisposableToken,
  getProfile,
  getPosts,
  getMembers,
  login,
  register,
  updateMember,
  uploadImage,
  verifyRecaptchaToken
} from '../api'

export default {
  ADD_MEMBER: ({ commit, dispatch, state }, { params }) => {
    return addMember(params)
  },
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
  DELETE_MEMBER: ({ commit, dispatch, state }, { params }) => {
    return deleteMember({ params })
  },
  GET_MEMBERS: ({ commit, dispatch, state }, { params }) => {
    return getMembers({ params }).then(({ status, body }) => {
      if (status === 200) {
        commit('SET_MEMBERS', { members: body })
      }
    })
  },
  GET_POSTS: ({ commit, dispatch, state }, { params }) => {
    return getPosts({ params }).then(({ status, body }) => {
      if (status === 200) {
        commit('SET_POSTS', { members: body })
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
  UPDATE_MEMBER: ({ commit, dispatch, state }, { params }) => {
    return updateMember({ params })
  },
  UPLOAD_IMAGE: ({ commit, dispatch }, { file }) => {
    return uploadImage(file)
  },
  VERIFY_RECAPTCHA_TOKEN: ({ commit, dispatch, state }, { token }) => {
    return verifyRecaptchaToken(token)
  }
}
