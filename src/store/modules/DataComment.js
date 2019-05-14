import _ from 'lodash'
// import * as commentFunc from 'src/api/comment'
import {
  addComment,
  addCommentReport,
  deleteComment,
  fetchComment,
  fetchCommentPublic,
  fetchCommentCount,
  // fetchMeComments,
  hideComment,
  updateComment
} from 'src/api'

export default {
  namespaced: true,
  state () {
    return {
      commentCount: []
    }
  },
  mutations: {
    SET_COMMENT_COUNT (state, { count, postId }) {
      let commentCount = _.find(_.get(state, [ 'commentCount' ]), { postId })
      if (!commentCount) {
        commentCount = { postId, count: 0 }
        _.get(state, [ 'commentCount' ]).push(commentCount)
      }
      commentCount.count = count || 0
    }
    // SET_COMMENTS_ME (state, { comments, }) {
    //   const profile = state['profile']
    //   profile && (profile.comments = comments)
    // },
    // SET_COMMENTS_FOR_HOME (state, { comments, }) {
    //   state[ 'commentsForHome' ] = comments
    // },
  },
  actions: {
    ADD_COMMENT (context, { params }) {
      return addComment({ params })
    },
    ADD_COMMENT_REPORT (context, { params }) {
      return addCommentReport({ params })
    },
    DELETE_COMMENT (context, { params }) {
      return deleteComment({ params })
    },
    FETCH_COMMENT (context, { params }) {
      return fetchComment({ params }).then(({ body }) => {
        return _.get(body, 'items', [])
      })
    },
    FETCH_COMMENT_PUBLIC (context, { params }) {
      return fetchCommentPublic({ params }).then(({ body }) => {
        return _.get(body, 'items', [])
      })
    },
    // FETCH_COMMENT_FOR_HOME ({ commit, }, { params, }) {
    //   return commentFunc.fetchCommentForHome({ params, }).then(({ body,}) => {
    //     commit('SET_COMMENTS_FOR_HOME', { comments: _.get(body, 'items', []), })
    //     return _.get(body, 'items', [])
    //   })
    // },
    FETCH_COMMENT_COUNT ({ commit }, { params, type }) {
      return fetchCommentCount({ params }).then(count => {
        commit('SET_COMMENT_COUNT', { count, postId: params.postId, type })
      })
    },
    // FETCH_COMMENTS_ME ({ commit, }) {
    //   return fetchMeComments().then((comments) => {
    //     commit('SET_COMMENTS_ME', { comments, })
    //   })
    // },
    HIDE_COMMENT (context, { params }) {
      return hideComment({ params })
    },
    UPDATE_COMMENT (context, { params }) {
      return updateComment({ params })
    }
  },
  getters: {
    resourceUrl (state, getters, rootState) {
      const host = _.get(rootState, [ 'setting', 'HOST' ], '')
      const postId = _.get(rootState.DataPost.post, 'id', '')
      return `${host}/post/${postId}`
    }
  }
}
