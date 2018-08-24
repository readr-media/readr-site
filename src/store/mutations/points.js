const debug = require('debug')('CLIENT:mutations:points')

const SET_CONSUME_FLAG = (state, { active, item, }) => {
  debug('Going to do mutation:', { active, item, })
  state[ 'consumeFlag' ].active = active
  state[ 'consumeFlag' ].item = item
}

const SET_POINT_HISTORIES = (state, { histories, }) => {
  state['pointHistories'] = histories.items || []
}

const SET_POINT_PERSONAL = (state, { personalPoints, }) => {
  state['personalPoints'] = personalPoints
}

const SET_STRIPE_REQUIREMENT = (state, { isStripeRequired, }) => {
  state['isStripeRequired'] = isStripeRequired
}

export {
  SET_CONSUME_FLAG,
  SET_POINT_HISTORIES,
  SET_POINT_PERSONAL,
  SET_STRIPE_REQUIREMENT,
}