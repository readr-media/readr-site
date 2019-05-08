/* eslint no-empty-pattern: 0 */
import * as memberFunc from 'src/api/member'
import _ from 'lodash'
import { ROLE_MAP } from 'src/constants'
import {
  addMember,
  deleteMemberProfileThumbnails,
  deleteMember,
  deleteMembers,
  getMembersCount,
  getProfile,
  getPublicMember,
  getPublicMembers,
  setupBasicProfile,
  updateMember
} from 'src/api'

const debug = require('debug')('CLIENT:store:actions:member')

const ADD_MEMBER = ({}, { params }) => {
  return addMember(params)
}

const DELETE_MEMBER = ({}, { params }) => {
  return deleteMember({ params })
}

const DELETE_MEMBER_PROFILE_THUMBNAILS = ({}, { id }) => {
  return deleteMemberProfileThumbnails(id)
}

const DELETE_MEMBERS = ({}, { params }) => {
  return deleteMembers({ params })
}

const FETCH_PERSONAL_SETTONG = ({ commit }) => {
  return memberFunc.fetchPersonalSetting().then(({ status, body }) => {
    if (status === 200) {
      commit('SET_PERSONAL_SETTING', { setting: body })
      return body
    }
  })
}

const GET_MEMBERS_COUNT = ({ commit }, { params }) => {
  return getMembersCount({ params }).then(({ status, body }) => {
    if (status === 200) {
      debug(`Member's count recieved.`, body)
      commit('SET_MEMBERS_COUNT', { count: _.get(body, 'meta.total', 0) })
    }
  })
}

const GET_PROFILE = ({ commit }, { params }) => {
  return getProfile({ params }).then(({ status, body }) => {
    if (status === 200) {
      commit('SET_PROFILE', { profile: body })
    }
    return { status, body }
  })
}

const GET_PUBLIC_MEMBER = ({ commit }, { params }) => {
  return getPublicMember({ params }).then(({ status, body }) => {
    debug('GET_PUBLIC_MEMBER', body)
    if (status === 200) {
      commit('SET_PUBLIC_MEMBER', { member: body })
    }
  })
}

const GET_PUBLIC_MEMBERS = ({ commit }, { params }) => {
  return getPublicMembers({ params }).then(({ status, body }) => {
    if (status === 200) {
      if (params.custom_editor) {
        commit('SET_CUSTOM_EDITORS', { members: body })
      } else if (params.role) {
        commit('SET_PUBLIC_MEMBERS', { members: body, role: _.find(ROLE_MAP, { key: params.role }).value })
      }
    }
    return { status, body }
  })
}

const GET_MEMBERS = ({ commit }, { params, type }) => {
  const process = type !== 'byname' ? memberFunc.getMembers : memberFunc.getMembersByName
  return process({ params }).then(({ status, body }) => {
    if (status === 200) {
      if (params.custom_editor) {
        commit('SET_CUSTOM_EDITORS', { members: body })
      } else {
        commit('SET_MEMBERS', { members: body })
      }
    }
  })
}

const REGISTER = ({}, { params, token }) => {
  return memberFunc.register(params, token)
}

const SETUP_BASIC_PROFILE = ({}, { params }) => {
  return setupBasicProfile({ params })
}

const UPDATE_MEMBER = ({}, { params, type }) => {
  return updateMember({ params, type })
}

const UPDATE_PROFILE = ({ commit }, { params }) => {
  commit('UPDATED_PROFILE', { profile: params })
  return updateMember({ params })
}

export {
  ADD_MEMBER,
  DELETE_MEMBER,
  DELETE_MEMBER_PROFILE_THUMBNAILS,
  DELETE_MEMBERS,
  FETCH_PERSONAL_SETTONG,
  GET_MEMBERS,
  GET_MEMBERS_COUNT,
  GET_PROFILE,
  GET_PUBLIC_MEMBER,
  GET_PUBLIC_MEMBERS,
  REGISTER,
  SETUP_BASIC_PROFILE,
  UPDATE_MEMBER,
  UPDATE_PROFILE
}
