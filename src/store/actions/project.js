import _ from 'lodash'
import { PROJECT_STATUS } from 'api/config'
import {
  getPublicProjectsList
  // getPublicProjectContents,
  // getProjectContents
} from 'src/api'

const debug = require('debug')('CLIENT:store:actions:project')

const GET_PUBLIC_PROJECT = ({ commit }, { params }) => {
  return getPublicProjectsList({ params }).then(({ status, body }) => {
    debug('Get single pro!', status, body)
    if (status === 200) {
      commit('SET_PUBLIC_PROJECT_SINGLE', { item: _.get(body, [ 'items', 0 ]) })
      return _.get(body, [ 'items', 0 ])
    } else {
      return { status }
    }
  })
}

const GET_PUBLIC_PROJECTS = ({ commit, state }, { params }) => {
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
}

// const GET_PUBLIC_PROJECT_CONTENTS = ({ commit }, { mode = 'set', projectId = '', params }) => {
//   return getPublicProjectContents({ projectId, params })
//     .then(({ status, body }) => {
//       if (status === 200) {
//         const items = _.get(body, 'items')
//         if (mode === 'set') {
//           commit('SET_PUBLIC_PROJECT_CONTENTS', items)
//         } else if (mode === 'update') {
//           commit('UPDATE_PUBLIC_PROJECT_CONTENTS', items)
//         }

//         if (items.length === 0) { return { status: 'end' } }
//         return { status, body }
//       } else {
//         return { status }
//       }
//     })
//     .catch((res) => {
//       console.error(res)
//     })
// }

// const GET_PROJECT_CONTENTS = ({ commit }, { mode = 'set', projectId = '', params }) => {
//   return getProjectContents({ projectId, params })
//     .then(({ status, body }) => {
//       if (status === 200) {
//         const items = _.get(body, 'items')
//         if (mode === 'set') {
//           commit('SET_PROJECT_CONTENTS', items)
//         } else if (mode === 'update') {
//           commit('UPDATE_PROJECT_CONTENTS', items)
//         }

//         if (items.length === 0) { return { status: 'end' } }
//         return { status, body }
//       } else {
//         return { status }
//       }
//     })
//     .catch((res) => {
//       console.error(res)
//     })
// }

export {
  GET_PUBLIC_PROJECT,
  GET_PUBLIC_PROJECTS
  // GET_PUBLIC_PROJECT_CONTENTS,
  // GET_PROJECT_CONTENTS
}
