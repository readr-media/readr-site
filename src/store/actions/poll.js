import { fetchChosenChoices, fetchPublicPolls, insertChosenChoice, updateChosenChoice, } from 'src/api/poll'

// const debug = require('debug')('CLIENT:store:actions:poll')

const FETCH_CHOSEN_CHOICES = ({ commit, }, params) => {
  return fetchChosenChoices(params).then(({ status, body, }) => {
    if (status === 200) {
      return commit('SET_CHOSEN_CHOICES', { body, })
    }
    return Promise.reject()
  })
}

const FETCH_EMBED_POLL = ({ commit, }, params) => {
  return fetchPublicPolls(params).then(({ status, body, }) => {
    if (status === 200) {
      commit('SET_EMBED_POLL', { body, })
      return body
    }
    return Promise.reject()
  })
}

const UNVOTE = ({ commit, }, params) => {
  commit('UPDATE_POLL', params)
  return updateChosenChoice(params)
}

const VOTE = ({ commit, }, params) => {
  commit('UPDATE_POLL', params)
  return insertChosenChoice(params)
}

export {
  FETCH_CHOSEN_CHOICES,
  FETCH_EMBED_POLL,
  UNVOTE,
  VOTE,
}