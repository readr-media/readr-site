import _ from 'lodash'
import Vue from 'vue'

const debug = require('debug')('CLIENT:STORE:mutations:member')
const { camelize } = require('humps')

const SET_MEMBERS = (state, { members }) => {
  state['members'] = members
}

const SET_MEMBERS_COUNT = (state, { count }) => {
  state['membersCount'] = count
}

const SET_PERSONAL_SETTING = (state, { setting }) => {
  state['personalSetting'] = setting
}

const SET_PROFILE = (state, { profile }) => {
  state['profile'] = profile
}

const SET_PUBLIC_MEMBER = (state, { member }) => {
  state['publicMember'] = _.get(member, [ 'items', 0 ])
  debug('SET_PUBLIC_MEMBER', state['publicMember'])
}

const SET_PUBLIC_MEMBERS = (state, { members, role }) => {
  if (!(role in state['publicMembers'])) {
    Vue.set(state['publicMembers'], role, { items: [] })
  }

  _.get(members, 'items', []).forEach(item => { state['publicMembers'][role].items.push(item) })
}

const UPDATED_PROFILE = (state, { profile }) => {
  // Update the entry when user saving the profile value which has been edited
  Object.entries(profile).forEach((entry) => {
    const profileKey = camelize(entry[0])
    const profileValue = entry[1]
    state['profile'][profileKey] = profileValue
  })
}

export {
  SET_MEMBERS,
  SET_MEMBERS_COUNT,
  SET_PERSONAL_SETTING,
  SET_PROFILE,
  SET_PUBLIC_MEMBER,
  SET_PUBLIC_MEMBERS,
  UPDATED_PROFILE
}
