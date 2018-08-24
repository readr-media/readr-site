import _ from 'lodash'

const debug = require('debug')('CLIENT:STORE:mutations:memo')

const SET_MEMO_SINGLE = (state, { item, }) => {
  debug('SET_MEMO_SINGLE', item)
  state['memoSingle'] = item
}

const SET_MEMOS = (state, { items, }) => {
  state['memos'] = items
}

const SET_PUBLIC_MEMOS = (state, { memos, }) => {
  state['publicMemos'] = memos
}

const UPDATE_MEMOS = (state, { items, }) => {
  state['memos'] = _.concat(_.get(state, `memos`, []), items)
}

export {
  SET_MEMO_SINGLE,
  SET_MEMOS,
  SET_PUBLIC_MEMOS,
  UPDATE_MEMOS,
}
