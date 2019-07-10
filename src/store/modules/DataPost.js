import _ from 'lodash'
import {
  getPost,
  getPublicReportsList
} from 'src/api'
import {
  POST_PUBLISH_STATUS,
  PROJECT_PUBLISH_STATUS
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
      slugs = []
    } = {}) {
      const response = await getPublicReportsList({
        params: {
          max_result: max_result,
          page: page,
          report_slugs: slugs,
          publish_status: `{"$in":[${POST_PUBLISH_STATUS.PUBLISHED}]}`,
          project_publish_status: `{"$in":[${PROJECT_PUBLISH_STATUS.PUBLISHED}]}`
        }
      })
      commit('SET_POST', _.get(response, [ 'body', 'items', 0 ], {}))
    }
  },
  mutations: {
    SET_POST (state, post) {
      state.post = post
    }
  }
}
