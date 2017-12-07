import {
  register
} from '../api'

export default {
  REGISTER: ({ commit, dispatch, state }, { params }) => {
    return register(params)
  }
}
