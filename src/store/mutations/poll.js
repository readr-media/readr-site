const SET_CHOSEN_CHOICES = (state, { chosenChoices }) => {
  state['chosenChoices'] = chosenChoices
}

const SET_EMBED_POLL = (state, { body }) => {
  state['embedPoll'] = body.items ? body.items[0] : null
}

const UPDATE_POLL = (state, { action, choiceId }) => {
  const choiceIndex = state['embedPoll'].choices.findIndex(choice => choice.id === choiceId)
  if (action === 'add') {
    state['embedPoll'].totalVote += 1
    state['embedPoll'].choices[choiceIndex].totalVote += 1
  } else if (action === 'minus') {
    state['embedPoll'].totalVote -= 1
    state['embedPoll'].choices[choiceIndex].totalVote -= 1
  }
}

export {
  SET_CHOSEN_CHOICES,
  SET_EMBED_POLL,
  UPDATE_POLL
}
