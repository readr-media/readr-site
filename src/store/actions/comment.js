/* eslint no-empty-pattern: 0 */
import _ from 'lodash'
import * as commentFunc from 'src/api/comment'
import {
  addComment,
  addCommentReport,
  deleteComment,
  fetchComment,
  fetchCommentPublic,
  fetchCommentCount,
  fetchMeComments,
  hideComment,
  updateComment
} from 'src/api'

const ADD_COMMENT = ({}, { params }) => {
  return addComment({ params })
}

const ADD_COMMENT_REPORT = ({}, { params }) => {
  return addCommentReport({ params })
}

const DELETE_COMMENT = ({}, { params }) => {
  return deleteComment({ params })
}

const FETCH_COMMENT = ({}, { params }) => {
  return fetchComment({ params }).then(({ body }) => {
    return _.get(body, 'items', [])
  })
}

const FETCH_COMMENT_PUBLIC = ({}, { params }) => {
  return fetchCommentPublic({ params }).then(({ body }) => {
    return _.get(body, 'items', [])
  })
}

const FETCH_COMMENT_FOR_HOME = ({ commit }, { params }) => {
  return commentFunc.fetchCommentForHome({ params }).then(({ body }) => {
    commit('SET_COMMENTS_FOR_HOME', { comments: _.get(body, 'items', []) })
    return _.get(body, 'items', [])
  })
}

const FETCH_COMMENT_COUNT = ({ commit }, { params, type }) => {
  return fetchCommentCount({ params }).then(count => {
    commit('SET_COMMENT_COUNT', { count, postId: params.postId, type })
  })
}

const FETCH_COMMENTS_ME = ({ commit }) => {
  return fetchMeComments().then((comments) => {
    commit('SET_COMMENTS_ME', { comments })
  })
}

const HIDE_COMMENT = ({}, { params }) => {
  return hideComment({ params })
}

const UPDATE_COMMENT = ({}, { params }) => {
  return updateComment({ params })
}

export {
  ADD_COMMENT,
  ADD_COMMENT_REPORT,
  DELETE_COMMENT,
  FETCH_COMMENT,
  FETCH_COMMENT_FOR_HOME,
  FETCH_COMMENT_PUBLIC,
  FETCH_COMMENT_COUNT,
  FETCH_COMMENTS_ME,
  HIDE_COMMENT,
  UPDATE_COMMENT
}
