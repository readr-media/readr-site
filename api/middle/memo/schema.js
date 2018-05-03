const Joi = require('joi')

module.exports = {
  memos: Joi.object().keys({
    max_result: Joi.number(),
    page: Joi.number().min(1),
    publish_status: Joi.object().keys({
      '$in': Joi.array().items(Joi.number().min(2).max(2)),
    }),
    sort: Joi.string(),
  }),
}
