import * as pointsFunc from 'src/api/points'

export const GET_POINT_HISTORIES = ({ commit, }, { params, }) => {
  return pointsFunc.getPointHistories({ params, }).then(({ status, body, }) => {
    if (status === 200) {
      commit('SET_POINT_HISTORIES', { histories: body, })
    }
  })
}

export const GET_POINT_CURRENT = ({ commit, }, { params, }) => {
  return pointsFunc.getPointCurrent({ params, }).then(({ status, body, }) => {
    if (status === 200) {
      commit('SET_POINT_PERSONAL', { personalPoints: body, })
    }
  })
}

export const LOAD_STRIPE_SDK = ({ commit, }) => {
  commit('SET_STRIPE_REQUIREMENT', { isStripeRequired: true, })
}

export const ADD_REWARD_POINTS_TRANSACTIONS = (action, { params, }) => {
  return pointsFunc.addRewardPointsTransactions(params)
}