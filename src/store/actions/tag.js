/* eslint no-empty-pattern: 0 */
import { get, concat } from 'lodash'
import { addTags, deleteTags, getPostAndReportByTag, getTags, getTagsCount, updateTags } from 'src/api/tag'

// const debug = require('debug')('CLIENT:store:actions:tag')

const ADD_TAGS = ({}, { params }) => {
  return addTags(params)
}

const DELETE_TAGS = ({}, { params }) => {
  return deleteTags({ params })
}

const GET_POST_REPORT_BY_TAG = ({ commit, state }, { tagId, params, nextLink }) => {
  return getPostAndReportByTag({ tagId, params, nextLink }).then(({ status, body }) => {
    if (status === 200) {
      if (nextLink) {
        let orig = get(state, 'itemsByTag.items', [])
        body.items = concat(orig, body.items)
      }
      commit('SET_POST_REPORT_BY_TAG', body)
      return { status, body }
    }
  })
}

const GET_PUBLIC_TAGS = ({ commit, state }, { urlParam, params }) => {
  return getTags({ urlParam, params }).then(({ status, body }) => {
    if (status === 200) {
      let result = get(body, 'items', [])
      if (params.page > 1) {
        let orig = get(state, 'publicTags', [])
        result = concat(orig, result)
      }
      commit('SET_PUBLIC_TAGS', { tags: result })
      commit('INIT_TAGS_MOUSEEVENT', { tags: result })
    }
  })
}

const GET_TAGS = ({ commit }, { urlParam, params }) => {
  return getTags({ urlParam, params }).then(({ status, body }) => {
    if (status === 200) {
      commit('SET_TAGS', { tags: body.items })
    }
  })
}

const GET_TAGS_COUNT = ({ commit }, { params }) => {
  return getTagsCount({ params }).then(({ status, body }) => {
    if (status === 200) {
      commit('SET_TAGS_COUNT', { meta: body.meta })
    }
  })
}

const UPDATE_TAGS = ({}, { params }) => {
  return updateTags({ params })
}

export {
  ADD_TAGS,
  DELETE_TAGS,
  GET_POST_REPORT_BY_TAG,
  GET_PUBLIC_TAGS,
  GET_TAGS,
  GET_TAGS_COUNT,
  UPDATE_TAGS
}
