import {
  addMember,
  addPost,
  checkLoginStatus,
  checkPassword,
  deleteMember,
  deleteMembers,
  deletePost,
  deletePostSelf,
  getDisposableToken,
  getFollowingByResource,
  getFollowingByUser,
  getProfile,
  getPosts,
  getPublicPosts,
  getMembers,
  getMeta,
  login,
  publishAction,
  register,
  setupBasicProfile,
  updateMember,
  updatePassword,
  updatePost,
  uploadImage,
  deleteImage,
  verifyRecaptchaToken
} from '../api'

export default {
  ADD_MEMBER: ({ commit, dispatch, state }, { params }) => {
    return addMember(params)
  },
  ADD_POST: ({ commit, dispatch, state }, { params }) => {
    return addPost(params)
  },
  CHECK_LOGIN_STATUS: ({ commit, dispatch, state }, { params }) => {
    return checkLoginStatus({ params }).then(({ status, body }) => {
      commit('SET_LOGGEIN_STATUS', { status, body })
    })
  },
  CHECK_PASSWORD: ({ commit, dispatch, state }, { params }) => {
    return checkPassword(params).then(({ status, profile }) => {
      return { status }
    })
  },
  DISPOSABLE_TOKEN: ({ commit, dispatch, state }, { type }) => {
    return getDisposableToken(type).then((token) => {
      commit('SET_TOKEN', { token, type })
    })
  },
  DELETE_IMAGE: ({ commit, dispatch }, { file, type }) => {
    return deleteImage(file, type)
  },
  DELETE_MEMBER: ({ commit, dispatch, state }, { params }) => {
    return deleteMember({ params })
  },
  DELETE_MEMBERS: ({ commit, dispatch, state }, { params }) => {
    return deleteMembers({ params })
  },
  DELETE_POST: ({ commit, dispatch, state }, { id }) => {
    return deletePost(id)
  },
  DELETE_POST_SELF: ({ commit, dispatch, state }, { id }) => {
    return deletePostSelf(id)
  },
  GET_FOLLOWING_BY_RESOURCE: ({ commit, dispatch, state }, { params }) => {
    return getFollowingByResource({ params }).then(({ status, body }) => {
      if (status === 200) {
        commit('SET_FOLLOWING_BY_RESOURCE', { following: body })
      }
    })
  },
  GET_FOLLOWING_BY_USER: ({ commit, dispatch, state }, params) => {
    return getFollowingByUser(params).then(({ status, body }) => {
      if (status === 200) {
        commit('SET_FOLLOWING_BY_USER', { following: body })
      }
    })
  },
  GET_MEMBERS: ({ commit, dispatch, state }, { params }) => {
    return getMembers({ params }).then(({ status, body }) => {
      if (status === 200) {
        if (params.custom_editor) {
          commit('SET_CUSTOM_EDITORS', { members: body })
        } else {
          commit('SET_MEMBERS', { members: body })
        }
      }
    })
  },
  GET_META: ({ commit, dispatch, state }, { url }) => {
    return getMeta(url)
  },
  GET_POSTS: ({ commit, dispatch, state }, { params }) => {
    console.log(params)
    return getPosts({ params }).then(({ status, body }) => {
      if (status === 200) {
        console.log(200)
        commit('SET_POSTS', { posts: body })
      }
    })
  },
  GET_PUBLIC_POSTS: ({ commit, dispatch, state }, { params }) => {
    return new Promise((resolve, reject) => {
      getPublicPosts({ params })
      .then(({ status, body }) => {
        if (status === 200) {
          if (params.mode === 'set') {
            if (params.category === 'hot') {
              commit('SET_PUBLIC_POSTS_HOT', { posts: body })
            } else {
              commit('SET_PUBLIC_POSTS', { posts: body })
            }
          } else if (params.mode === 'update') {
            commit('UPDATE_PUBLIC_POSTS', { posts: body })
          }
        }
        resolve(status)
      })
      .catch((res) => {
        reject(res)
      })
    }) 
  },
  GET_PROFILE: ({ commit, dispatch, state }, { params }) => {
    return getProfile({ params }).then(({ status, body }) => {
      if (status === 200) {
        commit('SET_PROFILE', { profile: body })
      }
    })
  },
  GET_USER_POSTS: ({ commit, dispatch, state }, { params }) => {
    return getPosts({ params }).then(({ status, body }) => {
      if (status === 200) {
        if (params.where.active) {
          commit('SET_USER_POSTS_DRAFT', { posts: body })
        } else {
          commit('SET_USER_POSTS', { posts: body })
        }
      }
    })
  },
  LOGIN: ({ commit, dispatch, state }, { params, token }) => {
    return login(params, token).then(({ status, profile }) => {
      commit('SET_LOGGEIN_STATUS', { body: true })
      commit('SET_PROFILE', { profile })
      return { status }
    })
  },
  LOGOUT: ({ commit, dispatch, state }) => {
    return new Promise((resolve) => {
      commit('SET_LOGGEIN_STATUS', { body: false })
      commit('SET_PROFILE', { profile: {}})
      resolve()
    })
  },
  PUBLISH_ACTION: ({ commit, dispatch, state }, { params }) => {
    return publishAction({ params })
  },
  MODIFY_FOLLOWING_BY_USER: ({ commit, dispatch, state }, { action, resource, data }) => {
    if (action === 'follow' && resource === 'post') {
      commit('ADD_ITEM_TO_FOLLOWING_BY_USER', data)
    } else {
      commit('REMOVE_ITEM_FROM_FOLLOWING_BY_USER', data)
    }
  },
  REGISTER: ({ commit, dispatch, state }, { params, token }) => {
    return register(params, token)
  },
  SETUP_BASIC_PROFILE: ({ commit, dispatch, state }, { params }) => {
    return setupBasicProfile({ params })
  },
  UPDATE_MEMBER: ({ commit, dispatch, state }, { params, type }) => {
    return updateMember({ params, type })
  },
  UPDATE_PROFILE: ({ commit, dispatch, state }, { params }) => {
    commit('UPDATED_PROFILE', { profile: params })
    return updateMember({ params })
  },
  UPDATE_PASSWORD: ({ commit, dispatch, state }, { params }) => {
    return updatePassword({ params })
  },
  UPDATE_POST: ({ commit, dispatch, state }, { params }) => {
    return updatePost({ params })
  },
  UPLOAD_IMAGE: ({ commit, dispatch }, { file, type }) => {
    return uploadImage(file, type)
  },
  VERIFY_RECAPTCHA_TOKEN: ({ commit, dispatch, state }, { token }) => {
    return verifyRecaptchaToken(token)
  }
}
