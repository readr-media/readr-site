import _ from 'lodash'
import { getPublicReportsList, } from 'src/api'

const debug = require('debug')('CLIENT:store:actions:report')

const GET_PUBLIC_REPORTS = ({ commit, }, { params, }) => {
  return new Promise((resolve, reject) => { 
    getPublicReportsList({ params, }).then(({ status, body, }) => {
      debug('Get reports!', status, body)
      if (status === 200) {
        commit('SET_PUBLIC_REPORTS', { reports: _.map(_.get(body, 'items', []), i => {
          i.flag = 'report'
          return i
        }), })
        resolve({ status: 200, res: body, })
      } else {
        reject({ status: status, })
      }
    })
    .catch((res) => {
      reject({ status: status, res: res,})
    })
  })
}

export {
  GET_PUBLIC_REPORTS,
}