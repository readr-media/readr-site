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
      post: {}
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
      console.log(response)
      commit('SET_POST', _.get(response, [ 'body', 'items', 0 ], {}))
    }
  },
  mutations: {
    SET_POST (state, post) {
      state.post = post
    }
  }
}
