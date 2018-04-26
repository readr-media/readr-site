const config = require('../../config')
const Joi = require('joi')
const activePostQueryString = `{"$in":[${config.POST_ACTIVE.ACTIVE}]}`

module.exports = {
  members: Joi.object().keys({
    custom_editor: Joi.string().valid('true'),
    role: Joi.number().valid(config.ROLE_MAP.GUESTEDITOR),
  }).or('custom_editor', 'role'),
  posts: Joi.object().keys({
    active: Joi.string().valid(activePostQueryString),
  }),
  projects: Joi.object().keys({
    active: Joi.any().forbidden(),
    max_result: Joi.number(),
    page: Joi.number().min(1),
    publish_status: Joi.object().keys({
      '$in': Joi.array().items(Joi.number().min(2).max(2)),
    }),
    sort: Joi.string(),
  }),
  videos: Joi.object().keys({
    active: Joi.any().forbidden(),
    max_result: Joi.number(),
    page: Joi.number().min(1),
    sort: Joi.string(),
    type: Joi.any().forbidden(),
  }),
}
