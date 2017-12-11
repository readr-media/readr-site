import {
  login,
  register
} from '../api'

export default {
  LOGIN: ({ commit, dispatch, state }, { params }) => {
    return login(params)
  },
  REGISTER: ({ commit, dispatch, state }, { params }) => {
    return register(params)
  }
}
