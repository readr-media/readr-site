import _ from 'lodash'
import { getMemo, getMemos, getPublicMemos, } from 'src/api'

const debug = require('debug')('CLIENT:store:actions:memo')

const GET_MEMO = ({ commit, }, { params, }) => {
  return getMemo({ params, }).then(({ status, body, }) => {
    debug('GET_MEMO', body)
    if (status === 200) {
      commit('SET_MEMO_SINGLE', { item: Object.assign({}, _.get(body, 'items.0', {}), { flag: 'memo', }), })
    } else {
      commit('SET_MEMO_SINGLE', { item: null, })
    }
  }).catch(() => {
    commit('SET_MEMO_SINGLE', { item: null, })
  })
}

const GET_MEMOS = ({ commit, }, { params, mode, }) => {
  return getMemos({ params, }).then(({ status, body, }) => {
    if (status === 200) {
      if (mode == 'set') {
        commit('SET_MEMOS', { items: _.map(_.get(body, 'items', []), i => {
          i.flag = 'memo'
          return i
        }), })
      } else if (mode === 'update') {
        if (_.get(body, 'items', []).length === 0) {
          return { status: 'end', body, }
        }
        commit('UPDATE_MEMOS', { items: _.map(_.get(body, 'items', []), i => {
          i.flag = 'memo'
          return i
        }), })          
      }
      return { status, body, }
    } else {
      commit('SET_MEMOS', { items: [], })
    }
  }).catch(() => {
    commit('SET_MEMOS', { items: [], })
  })
}

const GET_PUBLIC_MEMOS = ({ commit, }, { params, mode, }) => {
  return new Promise((resolve) => { 
    getPublicMemos({ params, }).then(({ status, body, }) => {
      debug('Get memos!', status, body)
      if (status === 200) {
        if (mode == 'set') {
          commit('SET_PUBLIC_MEMOS', { memos: body.items, })
        } else if (mode === 'update') {
          if (_.get(body, 'items', []).length === 0) {
            resolve({ status: 'end', body, })
          }
          commit('UPDATE_PUBLIC_MEMOS', { memos: body.items, })
        }        
        resolve({ status: 200, res: body, })
      } else {
        commit('SET_PUBLIC_MEMOS', { items: [], })
        // reject({ status: status, })
      }
    })
    .catch(() => {
      // reject({ status: status, res: res,})
      commit('SET_PUBLIC_MEMOS', { items: [], })
    })
  })
}

export {
  GET_MEMO,
  GET_MEMOS,
  GET_PUBLIC_MEMOS,
}
