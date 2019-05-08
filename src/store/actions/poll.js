import { fetchChosenChoices, fetchPublicPolls, insertChosenChoice, updateChosenChoice } from 'src/api/poll'

const FETCH_CHOSEN_CHOICES = ({ commit }, params) => {
  return fetchChosenChoices(params)
    .then(({ status, body }) => {
      if (status === 200) {
        return commit('SET_CHOSEN_CHOICES', { chosenChoices: body.items })
      }
      // return Promise.reject()
    })
}

const FETCH_EMBED_POLL = ({ commit }, params) => {
  return fetchPublicPolls(params).then(({ status, body }) => {
    if (status === 200) {
      commit('SET_EMBED_POLL', { body })
      return body
    }
    // return Promise.reject()
  })
}

const UNVOTE = ({ commit, state }, params) => {
  const chosenChoices = state.chosenChoices || []
  const choiceIndex = chosenChoices.findIndex(choice => choice.id === params.id)
  if (choiceIndex > -1) {
    chosenChoices.splice(choiceIndex, 1)
  }
  commit('SET_CHOSEN_CHOICES', { chosenChoices: chosenChoices })
  commit('UPDATE_POLL', params)
  return updateChosenChoice(params)
}

const VOTE = ({ commit, state }, params) => {
  const chosenChoices = state.chosenChoices || []
  chosenChoices.push(params)
  commit('SET_CHOSEN_CHOICES', { chosenChoices: chosenChoices })
  commit('UPDATE_POLL', params)
  return insertChosenChoice(params)
}

export {
  FETCH_CHOSEN_CHOICES,
  FETCH_EMBED_POLL,
  UNVOTE,
  VOTE
}
