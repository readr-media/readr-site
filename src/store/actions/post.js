/* eslint no-empty-pattern: 0 */
import { get } from 'lodash'
import * as postFunc from 'src/api/post'
import { POST_PUBLISH_STATUS, POST_TYPE } from 'api/config'
import {
  addPost,
  deletePost,
  deletePosts,
  deletePostSelf,
  getPost,
  getPostStrict,
  getPosts,
  getPostsCount,
  getPublicPosts,
  publishPosts,
  updatePost
} from 'src/api'

const debug = require('debug')('CLIENT:actions:post')

const ADD_POST = ({}, { params }) => {
  return addPost(params)
}

const DELETE_POST = ({}, { id }) => {
  return deletePost(id)
}

const DELETE_POSTS = ({}, { params }) => {
  return deletePosts({ params })
}

const DELETE_POST_SELF = ({}, { id }) => {
  return deletePostSelf(id)
}

const GET_POST = ({ commit }, { id, isPreview, params }) => {
  return new Promise((resolve, reject) => {
    const fetcher = isPreview ? getPostStrict : getPost
    debug('isPreview', isPreview)
    fetcher({ id, params })
      .then(response => {
        const { status, body } = response
        debug('Get fetching result. status:', status, body)
        if (status === 200) {
          commit('SET_PUBLIC_POST_SINGLE', { posts: body })
          resolve({ status: 200 })
        } else {
          reject(response)
        }
      }).catch(err => {
        debug('Get fetching error.', { status: 'error', res: err })
        reject(new Error({ status: 'error', res: err }))
      })
  })
}

const GET_POSTS = ({ commit }, { params }) => {
  return getPosts({ params }).then(({ status, body }) => {
    if (status === 200) {
      commit('SET_POSTS', { posts: body })
    }
  })
}

const GET_POSTS_COUNT = ({ commit }, { params }) => {
  return getPostsCount({ params }).then(({ status, body }) => {
    if (status === 200) {
      if (params.publish_status && params.where.publish_status === POST_PUBLISH_STATUS.DRAFT) {
        commit('SET_POSTS_DRAFT_COUNT', { meta: body.meta })
      } else {
        commit('SET_POSTS_COUNT', { meta: body.meta })
      }
    }
  })
}

const GET_POSTS_BY_TAG = ({ commit }, { params }) => {
  debug('params', params)
  return postFunc.getPostsByTag({ params }).then(({ status, body }) => {
    if (status === 200) {
      commit('SET_POST_BY_TAG', { posts: body })
    }
  })
}

const GET_POSTS_BY_USER = ({ commit }, { params }) => {
  return getPosts({ params }).then(({ status, body }) => {
    if (status === 200) {
      if (params.where && params.where.type === POST_TYPE.NEWS) {
        if (params.where.publish_status && params.where.publish_status === POST_PUBLISH_STATUS.DRAFT) {
          commit('SET_POSTS_DRAFT', { posts: body })
        } else {
          commit('SET_POSTS', { posts: body })
        }
      } else if (params.where && params.where.type === POST_TYPE.REVIEW) {
        if (params.where.publish_status && params.where.publish_status === POST_PUBLISH_STATUS.DRAFT) {
          commit('SET_POSTS_DRAFT', { posts: body })
        } else {
          commit('SET_POSTS', { posts: body })
        }
      }
    }
  })
}

// Todos: sync the logic design the same as GET_PUBLIC_PROJECTS
const GET_PUBLIC_POSTS = ({ commit }, { params, outputStateTarget = 'publicPosts' }) => {
  return new Promise((resolve) => {
    getPublicPosts({ params })
      .then(({ status, body }) => {
        if (status === 200 && body.items) {
          body.items = get(body, 'items', []).filter(post => post.publishStatus === POST_PUBLISH_STATUS.PUBLISHED)
          if (params.mode === 'set') {
            if (params.category === 'hot') {
              commit('SET_PUBLIC_POSTS', { posts: body, outputStateTarget: 'publicPostsHot' })
            } else {
              commit('SET_PUBLIC_POSTS', { posts: body, outputStateTarget })
            }
          } else if (params.mode === 'update') {
            commit('UPDATE_PUBLIC_POSTS', { posts: body, outputStateTarget })
          }
          resolve({ status: 200, res: body })
        } else {
        // reject('end')
          if (body.items === null) {
            if (params.mode === 'set') {
              commit('SET_PUBLIC_POSTS', { posts: [], outputStateTarget })
            }
          }
          resolve({ status: 'end', res: {} })
        }
      })
      .catch((res) => {
      // reject(res)
        resolve({ status: 'error', res: res })
      })
  })
}

const PUBLISH_POSTS = ({}, { params }) => {
  return publishPosts({ params })
}

const UPDATE_POST = ({}, { params }) => {
  return updatePost({ params })
}

export {
  ADD_POST,
  DELETE_POST,
  DELETE_POSTS,
  DELETE_POST_SELF,
  GET_POST,
  GET_POSTS,
  GET_POSTS_COUNT,
  GET_POSTS_BY_TAG,
  GET_POSTS_BY_USER,
  GET_PUBLIC_POSTS,
  PUBLISH_POSTS,
  UPDATE_POST
}
