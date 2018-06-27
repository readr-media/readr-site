
import * as memberFunc from 'src/api/member'

// const debug = require('debug')('CLIENT:store:actions:member')
const GET_MEMBERS = ({ commit, }, { params, type, }) => {
  const process = type !== 'byname' ? memberFunc.getMembers : memberFunc.getMembersByName
  return process({ params, }).then(({ status, body, }) => {
    if (status === 200) {
      if (params.custom_editor) {
        commit('SET_CUSTOM_EDITORS', { members: body, })
      } else {
        commit('SET_MEMBERS', { members: body, })
      }
    }
  })
}
const FETCH_PERSONAL_SETTONG = ({ commit, }) => {
  return memberFunc.fetchPersonalSetting().then(({ status, body, }) => {
    if (status === 200) {
      commit('SET_PERSONAL_SETTING', { setting: body, })
      return body
    }
  })
}

export {
  FETCH_PERSONAL_SETTONG,
  GET_MEMBERS,
}