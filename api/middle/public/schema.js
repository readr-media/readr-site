const Joi = require('joi')
const activePostQueryString = '{"$in":[1]}'

module.exports = {
  members: Joi.object().keys({
    custom_editor: Joi.string().valid('true'),
    role: Joi.number().valid(2)
  }).or('custom_editor', 'role'),
  posts: Joi.object().keys({
    active: Joi.string().valid(activePostQueryString)
  })
}
