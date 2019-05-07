import _ from 'lodash'

import { getPublicReportsList, } from 'src/api'
import { POST_PUBLISH_STATUS, PROJECT_PUBLISH_STATUS, } from 'api/config'

const DEFAULT_PAGE = 1
const MAX_RESULT = 1

export default {
  namespaced: true,
  state () {
    return {
      reports: [],
    }
  },
  mutations: {
    RESET_REPORTS (state) {
      state.reports = []
    },
    PUSH_REPORT (state, items) {
      state.reports.push(...items)
    },
  },
  actions: {
    FETCH ({ commit, }, {
      max_result = MAX_RESULT,
      page = DEFAULT_PAGE,
      slugs = [],
    } = {}) {
      return getPublicReportsList({
        params: {
          max_result: max_result,
          page: page,
          report_slugs: slugs,
          publish_status: `{"$in":[${POST_PUBLISH_STATUS.PUBLISHED}]}`,
          project_publish_status: `{"$in":[${PROJECT_PUBLISH_STATUS.PUBLISHED}]}`,
        },
      }).then(res => {
        console.log(_.get(res, [ 'body', 'items', ], []).length)
        commit('PUSH_REPORT', _.get(res, [ 'body', 'items', ], []))
      })
    },
  },
}
