import _ from 'lodash'
import {
  getPost,
  getPublicPosts
} from 'src/api'
import {
  POST_TYPE
} from 'api/config'

export default {
  namespaced: true,
  state () {
    return {
      post: {},
      posts: []
    }
  },
  actions: {
    async GET_POST ({ commit }, { id, showAuthor = false, showTag = false }) {
      const response = await getPost({
        id,
        params: {
          showAuthor,
          showTag
        }
      })
      commit('SET_POST', response.body.items[0])
    },

    async GET_POST_REPORT ({ commit }, {
      // eslint-disable-next-line camelcase
      max_result = 1,
      page = 1,
      slug = ''
    } = {}) {
      const response = await getPublicPosts({
        params: {
          max_result: max_result,
          page: page,
          slug: slug,
          type: `{"$in":[${POST_TYPE.REPORT}]}`
        }
      })
      commit('SET_POST', _.get(response, [ 'body', 'items', 0 ], {}))
    },
    async GET_POSTS ({ commit, state }, {
      maxResult = 12,
      page = 1,
      projectId,
      showAuthor = false,
      showComment = false,
      showTag = false,
      showUpdater = false,
      sort = '-published_at'
    } = {}) {
      try {
        const response = await getPublicPosts({
          params: {
            max_result: maxResult,
            page,
            project_id: projectId,
            show_author: showAuthor,
            show_comment: showComment,
            show_tag: showTag,
            show_updater: showUpdater,
            sort
          }
        })
        let items = _.get(response, 'body.items', []) || []
        if (page > 1) {
          const orig = _.values(_.get(state, 'posts', []))
          items = _.concat(orig, items)
        }
        commit('SET_POSTS', items)
        return _.get(response, 'body.items', []) || []
      } catch (error) {
        return []
      }
    }
  },
  mutations: {
    SET_POST (state, post) {
      state.post = post
    },
    SET_POSTS (state, posts) {
      state.posts = posts
    }
  }
}
