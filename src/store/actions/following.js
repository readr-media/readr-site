/* eslint no-empty-pattern: 0 */
import { follow, getFollowingByResource, getFollowingByUser } from 'src/api'

const FOLLOW = ({}, { params }) => {
  return new Promise((resolve, reject) => {
    follow({ params }).then(({ status }) => {
      if (status === 200) {
        resolve()
      }
    }).catch(err => {
      reject(err)
    })
  })
}

const GET_FOLLOWING_BY_RESOURCE = ({ commit }, params) => {
  return getFollowingByResource(params).then(({ status, body }) => {
    if (status === 200) {
      if (params.mode === 'update') {
        commit('UPDATE_FOLLOWING_BY_RESOURCE', { resourceType: params.resource, following: body.items })
      } else {
        if (body.status !== 400) {
          commit('SET_FOLLOWING_BY_RESOURCE', { resourceType: params.resource, following: body.items })
        }
      }
    }
  })
}

const GET_FOLLOWING_BY_USER = ({ commit, state }, params) => {
  if (!state.isLoggedIn) return

  return getFollowingByUser(params).then(({ status, body }) => {
    if (status === 200) {
      commit('SET_FOLLOWING_BY_USER', { following: body.items, userId: params.id })
      if (params.id === state.profile.id) {
        commit('SET_FOLLOWING_BY_USER_STATS', { following: body.items, userId: params.id })
      }
    }
    return { status, body }
  })
}

const UPDATE_FOLLOWING_BY_USER = ({ commit }, { params }) => {
  if (params.action === 'follow') {
    commit('ADD_ITEM_TO_FOLLOWING_BY_USER', params)
  } else {
    commit('REMOVE_ITEM_FROM_FOLLOWING_BY_USER', params)
  }
}

const UPDATE_FOLLOWING_BY_RESOURCE = ({ commit }, { params }) => {
  if (params.action === 'follow') {
    commit('ADD_USER_TO_FOLLOWING_BY_RESOURCE', params)
  } else if (params.action === 'unfollow') {
    commit('REMOVE_USER_FROM_FOLLOWING_BY_RESOURCE', params)
  }
}

export {
  FOLLOW,
  GET_FOLLOWING_BY_RESOURCE,
  GET_FOLLOWING_BY_USER,
  UPDATE_FOLLOWING_BY_USER,
  UPDATE_FOLLOWING_BY_RESOURCE
}
