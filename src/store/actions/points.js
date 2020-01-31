import * as pointsFunc from 'src/api/points'

export const GET_POINT_HISTORIES = ({ commit }, { params }) => {
  return pointsFunc.getPointHistories({ params }).then(({ status, body }) => {
    if (status === 200) {
      commit('SET_POINT_HISTORIES', { histories: body })
    }
  })
}

export const GET_POINT_CURRENT = ({ commit }, { params }) => {
  return pointsFunc.getPointCurrent({ params }).then(({ status, body }) => {
    if (status === 200) {
      commit('SET_POINT_PERSONAL', { personalPoints: body })
    }
  })
}

export const LOAD_TAPPAY_SDK = ({ commit }) => {
  commit('SET_TAPPAY_REQUIREMENT', { isTappayRequired: true })
}

export const SET_TAPPAY_LOADED = ({ commit }) => {
  return commit('SET_TAPPAY_LOADED', { isLoaded: true })
}

export const ADD_REWARD_POINTS_TRANSACTIONS = (action, { params }) => {
  return pointsFunc.addRewardPointsTransactions(params)
}
export const DONATE = (action, { params }) => {
  return pointsFunc.donate(params)
}

export const SWITCH_OFF_CONSUME_PANEL = ({ commit }, { active }) => {
  return commit('SET_CONSUME_FLAG', {
    active,
    item: {}
  })
}

export const SWITCH_ON_CONSUME_PANEL = ({ commit }, { active, item }) => {
  return commit('SET_CONSUME_FLAG', {
    active,
    item
  })
}

export const SWITCH_ON_TAPPAY_PANEL = ({ commit }, { active, item }) => {
  return commit('SET_TAPPAY_FLAG', {
    active,
    item
  })
}

export const SWITCH_OFF_TAPPAY_PANEL = ({ commit }) => {
  return commit('SET_TAPPAY_FLAG', {
    active: false,
    item: {}
  })
}

export const SWITCH_OFF_DONATE_PANEL = ({ commit }) => {
  return commit('SET_DONATE_FLAG', {
    active: false,
    item: {}
  })
}

export const SWITCH_ON_DONATE_PANEL = ({ commit }, { item }) => {
  return commit('SET_DONATE_FLAG', {
    active: true,
    item
  })
}
