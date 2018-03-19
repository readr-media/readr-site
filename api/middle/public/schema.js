const config = require('../../config')
const Joi = require('joi')
const activePostQueryString = `{"$in":[${config.POST_ACTIVE.ACTIVE}]}`

module.exports = {
  members: Joi.object().keys({
    custom_editor: Joi.string().valid('true'),
    role: Joi.number().valid(2)
  }).or('custom_editor', 'role'),
  posts: Joi.object().keys({
    active: Joi.string().valid(activePostQueryString)
  })
}
