import _ from 'lodash'
// const debug = require('debug')('CLIENT:STORE:mutations:memo')

const SET_MEMO_SINGLE = (state, { item }) => {
  state['memoSingle'] = item
}
const SET_PUBLIC_MEMO_SINGLE = (state, { item }) => {
  state['publicMemoSingle'] = item
}

const SET_MEMOS = (state, { items }) => {
  state['memos'] = items
}

const SET_PUBLIC_MEMOS = (state, { memos }) => {
  state['publicMemos'] = memos
}

const UPDATE_PUBLIC_MEMOS = (state, { memos }) => {
  state['publicMemos'] = _.concat(_.get(state, `publicMemos`, []), memos)
}

const UPDATE_MEMOS = (state, { items }) => {
  state['memos'] = _.concat(_.get(state, `memos`, []), items)
}

export {
  SET_MEMO_SINGLE,
  SET_MEMOS,
  SET_PUBLIC_MEMOS,
  SET_PUBLIC_MEMO_SINGLE,
  UPDATE_MEMOS,
  UPDATE_PUBLIC_MEMOS
}
