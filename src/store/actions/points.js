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