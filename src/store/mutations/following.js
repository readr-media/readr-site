import _ from 'lodash'
import Vue from 'vue'
import { POST_TYPE } from 'api/config'

const ADD_ITEM_TO_FOLLOWING_BY_USER = (state, params) => {
  const followingByUser = state.followingByUser[params.userId]
  const followingByUserResource = followingByUser[params.resource]
  if (params.resource === 'post') {
    followingByUserResource[params.resourceType].push(params.item)
  } else {
    followingByUserResource.push(params.item)
  }
}

const ADD_USER_TO_FOLLOWING_BY_RESOURCE = (state, params) => {
  const resourceIndex = _.findIndex(state.followingByResource[params.resource], { resourceID: params.resourceId })
  if (resourceIndex === -1) {
    state.followingByResource[params.resource].push({
      resourceID: params.resourceId,
      followers: [ params.userId ]
    })
  } else {
    state.followingByResource[params.resource][resourceIndex].followers.push(params.userId)
  }
}

const REMOVE_ITEM_FROM_FOLLOWING_BY_USER = (state, params) => {
  const followingByUser = state.followingByUser[params.userId]
  const followingByUserResource = followingByUser[params.resource]
  if (params.resource === 'post') {
    const resourceIndex = _.findIndex(followingByUserResource[params.resourceType], { id: params.item.id })
    Vue.delete(followingByUserResource[params.resourceType], resourceIndex)
  } else {
    const resourceIndex = _.findIndex(followingByUserResource, { id: params.item.id })
    Vue.delete(followingByUserResource, resourceIndex)
  }
}

const REMOVE_USER_FROM_FOLLOWING_BY_RESOURCE = (state, params) => {
  const resourceIndex = _.findIndex(state.followingByResource[params.resource], { resourceID: params.resourceId })
  const userIndex = state.followingByResource[params.resource][resourceIndex].followers.indexOf(params.userId)
  Vue.delete(state.followingByResource[params.resource][resourceIndex].followers, userIndex)
}

const SET_FOLLOWING_BY_RESOURCE = (state, { resourceType, following }) => {
  state['followingByResource'][resourceType] = following
}

const SET_FOLLOWING_BY_USER = (state, { following = [], userId }) => {
  if (!(userId in state['followingByUser'])) {
    Vue.set(state['followingByUser'], userId, {
      post: {
        review: [],
        news: []
      },
      report: [],
      memo: [],
      project: [],
      tag: []
    })
  }

  following.forEach(follow => {
    const id = _.get(follow, [ 'item', 'id' ], '')
    const resource = _.get(follow, 'resource', '')
    const isFollowExist = _.find(state['followingByUser'][userId][resource], follow => _.get(follow, 'resource') === resource && _.get(follow, [ 'item', 'id' ]) === id) !== undefined

    if (!isFollowExist) {
      if (resource !== 'post') {
        state['followingByUser'][userId][resource].push(follow)
      } else {
        const postType = Object.entries(POST_TYPE)
        const currentResourceType = _.get(_.find(postType, [ 1, follow.item.type ]), 0, '').toLowerCase()

        if (currentResourceType !== null && currentResourceType in state['followingByUser'][userId]) {
          state['followingByUser'][userId][resource][currentResourceType].push(follow)
        }
      }
    }
  })
}

const SET_FOLLOWING_BY_USER_STATS = (state, { following = [] }) => {
  following.forEach(follow => {
    const id = _.get(follow, [ 'item', 'id' ], '')
    const resource = _.get(follow, 'resource', '')

    if (!(id in state['followingByUserStats'][resource])) {
      if (resource !== 'post') {
        Vue.set(state['followingByUserStats'][resource], id, true)
      } else {
        const postType = Object.entries(POST_TYPE)
        const currentResourceType = _.get(_.find(postType, [ 1, follow.item.type ]), 0, '').toLowerCase()

        if (currentResourceType !== null && currentResourceType in state['followingByUserStats'][resource]) {
          Vue.set(state['followingByUserStats'][resource][currentResourceType], id, true)
        }
      }
    }
  })
}

const TOOGLE_FOLLOWING_BY_USER_STAT = (state, { params }) => {
  if (params.resource === 'post') {
    const isNotFollowed = !(params.targetId in state.followingByUserStats[params.resource][params.resourceType])
    if (isNotFollowed) {
      Vue.set(state.followingByUserStats[params.resource][params.resourceType], params.targetId, true)
    } else {
      state.followingByUserStats[params.resource][params.resourceType][params.targetId] = !state.followingByUserStats[params.resource][params.resourceType][params.targetId]
    }
  } else {
    const isNotFollowed = !(params.targetId in state.followingByUserStats[params.resource])
    if (isNotFollowed) {
      Vue.set(state.followingByUserStats[params.resource], params.targetId, true)
    } else {
      state.followingByUserStats[params.resource][params.targetId] = !state.followingByUserStats[params.resource][params.targetId]
    }
  }
}

const UPDATE_FOLLOWING_BY_RESOURCE = (state, { resourceType, following }) => {
  following && following.forEach(follow => {
    state['followingByResource'][resourceType].push(follow)
  })
}

export {
  ADD_ITEM_TO_FOLLOWING_BY_USER,
  ADD_USER_TO_FOLLOWING_BY_RESOURCE,
  REMOVE_ITEM_FROM_FOLLOWING_BY_USER,
  REMOVE_USER_FROM_FOLLOWING_BY_RESOURCE,
  SET_FOLLOWING_BY_RESOURCE,
  SET_FOLLOWING_BY_USER,
  SET_FOLLOWING_BY_USER_STATS,
  TOOGLE_FOLLOWING_BY_USER_STAT,
  UPDATE_FOLLOWING_BY_RESOURCE
}
