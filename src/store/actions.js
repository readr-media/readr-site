import { POST_ACTIVE, POST_TYPE } from '../../api/config'
import {
  addMember,
  addPost,
  checkLoginStatus,
  checkPassword,
  deleteMember,
  deleteMembers,
  deletePost,
  deletePosts,
  deletePostSelf,
  fetchCommentCount,
  fetchMeComments,
  getDisposableToken,
  getFollowingByResource,
  getFollowingByUser,
  getProfile,
  getPosts,
  getPostsCount,
  getPublicPosts,
  getMembers,
  getMeta,
  login,
  publishAction,
  publishPosts,
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
  DELETE_POSTS: ({ commit, dispatch, state }, { params }) => {
    return deletePosts({params})
  },
  DELETE_POST_SELF: ({ commit, dispatch, state }, { id }) => {
    return deletePostSelf(id)
  },
  FETCH_COMMENT_COUNT: ({ commit, dispatch, state }, { params, type }) => {
    return fetchCommentCount({ params }).then((count) => {
      commit('SET_COMMENT_COUNT', { count, postId: params.postId, type })
    })
  },
  FETCH_COMMENTS_ME: ({ commit, dispatch, state }) => {
    return fetchMeComments().then((comments) => {
      commit('SET_COMMENTS_ME', { comments })
    })
  },
  GET_FOLLOWING_BY_RESOURCE: ({ commit, dispatch, state }, params) => {
    return getFollowingByResource(params).then(({ status, body }) => {
      if (status === 200) {
        if (params.mode === 'update') {
          commit('UPDATE_FOLLOWING_BY_RESOURCE', { following: body })
        } else {
          commit('SET_FOLLOWING_BY_RESOURCE', { following: body })
        }
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
    return getPosts({ params }).then(({ status, body }) => {
      if (status === 200) {
        commit('SET_POSTS', { posts: body })
      }
    })
  },
  GET_POSTS_COUNT: ({ commit, dispatch, state }, { params }) => {
    return getPostsCount({ params }).then(({ status, body }) => {
      if (status === 200) {
        if (params.where && params.where.active === POST_ACTIVE.DRAFT) {
          commit('SET_POSTS_DRAFT_COUNT', { meta: body.meta })
        } else {
          commit('SET_POSTS_COUNT', { meta: body.meta })
        }
      }
    })
  },
  GET_POSTS_BY_USER: ({ commit, dispatch, state }, { params }) => {
    return getPosts({ params }).then(({ status, body }) => {
      if (status === 200) {
        if (params.where && params.where.type === POST_TYPE.NEWS) {
          if (params.where.active && params.where.active === POST_ACTIVE.DRAFT) {
            commit('SET_POSTS_DRAFT', { posts: body })
          } else {
            commit('SET_POSTS', { posts: body })
          }
        } else if (params.where && params.where.type === POST_TYPE.REVIEW) {
          if (params.where.active && params.where.active === POST_ACTIVE.DRAFT) {
            commit('SET_POSTS_DRAFT', { posts: body })
          } else {
            commit('SET_POSTS', { posts: body })
          }
        }
      }
    })
  },
  GET_PUBLIC_POSTS: ({ commit, dispatch, state }, { params }) => {
    return new Promise((resolve, reject) => {
      getPublicPosts({ params })
      .then(({ status, body }) => {
        if (status === 200) {
          if (params.mode === 'set') {
            if (params.category === 'latest') {
              commit('SET_PUBLIC_POSTS', { posts: body })
            } else if (params.category === 'hot') {
              commit('SET_PUBLIC_POSTS_HOT', { posts: body })
            }
          } else if (params.mode === 'update') {
            commit('UPDATE_PUBLIC_POSTS', { posts: body })
          }
        }
        resolve(body)
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
    return new Promise((resolve, reject) => {
      publishAction({ params }).then(({ status }) => {
        if (status === 200) {
          resolve()
        }
      }).catch((err) => {
        reject()
      })
    })
  },
  PUBLISH_POSTS: ({ commit, dispatch, state }, { params }) => {
    return publishPosts({ params })
  },
  UPDATE_FOLLOWING_BY_USER: ({ commit, dispatch, state }, { params }) => {
    if (params.action === 'follow' && params.resource === 'post') {
      commit('ADD_ITEM_TO_FOLLOWING_BY_USER', params.data)
    } else {
      commit('REMOVE_ITEM_FROM_FOLLOWING_BY_USER', params.data)
    }
  },
  UPDATE_FOLLOWING_BY_RESOURCE: ({ commit, dispatch, state }, { params }) => {
    if (params.action === 'follow' && params.resource === 'post') {
      commit('ADD_USER_TO_FOLLOWING_BY_RESOURCE', params)
    } else {
      commit('REMOVE_USER_FROM_FOLLOWING_BY_RESOURCE', params)
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
