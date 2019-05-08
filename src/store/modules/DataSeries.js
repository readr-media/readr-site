import Vue from 'vue'
import _ from 'lodash'
import { PROJECT_STATUS, PROJECT_PUBLISH_STATUS } from 'api/config'
import { getPublicProjectsList } from 'src/api'

const DEFAULT_PAGE = 1
const DEFAULT_SORT = 'project_order,-updated_at'
const MAX_RESULT = 12

export default {
  namespaced: true,
  state: {
    publicProjects: {
      inProgress: [],
      done: [],
      normal: [],
      recommends: [],
      trends: []
    }
  },
  mutations: {
    SET_PUBLIC_PROJECTS (state, { status, publicProjects }) {
      Vue.set(state['publicProjects'], status, publicProjects)
    }
  },
  actions: {
    GET_PUBLIC_PROJECTS ({ commit, state }, { params }) {
      const setPublicProject = (body) => {
        const projectStatus = _.get(params, [ 'where', 'status' ])
        let orig
        switch (projectStatus) {
          case PROJECT_STATUS.WIP:
            if (params.page > 1) {
              orig = _.values(_.get(state, [ 'publicProjects', 'inProgress' ], []))
              body.items = _.concat(orig, body.items)
            }
            return commit('SET_PUBLIC_PROJECTS', { status: 'inProgress', publicProjects: body.items })
          case PROJECT_STATUS.DONE:
            if (params.page > 1) {
              orig = _.values(_.get(state, [ 'publicProjects', 'done' ], []))
              body.items = _.concat(orig, body.items)
            }
            return commit('SET_PUBLIC_PROJECTS', { status: 'done', publicProjects: body.items })
          default:
            if (params.page > 1) {
              orig = _.values(_.get(state, [ 'publicProjects', 'normal' ], []))
              body.items = _.concat(orig, body.items)
            }
            return commit('SET_PUBLIC_PROJECTS', { status: 'normal', publicProjects: body.items })
        }
      }
      return new Promise((resolve, reject) => {
        getPublicProjectsList({ params })
          .then(({ status, body }) => {
            if (status === 200) {
              setPublicProject(body)
              resolve({ status: 200, res: body })
            }
          })
          .catch((res) => {
            reject(new Error({ status: status, res: res }))
          })
      })
    },

    FETCH ({ dispatch }, {
      maxResult = MAX_RESULT,
      page = DEFAULT_PAGE,
      sort = DEFAULT_SORT,
      slugs = []
    } = {}) {
      return dispatch('GET_PUBLIC_PROJECTS', {
        params: {
          max_result: maxResult,
          page: page,
          sort: sort,
          slugs,
          where: {
            status: [ PROJECT_STATUS.DONE, PROJECT_STATUS.WIP ],
            publish_status: PROJECT_PUBLISH_STATUS.PUBLISHED
          }
        }
      })
    }
  }
}
