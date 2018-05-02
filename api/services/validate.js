const Joi = require('joi')

const validate = (schema) => (req, res, next) => {
  Joi.validate(req.query, schema, { allowUnknown: true, }, (err) => {
    if (err) {
      res.status(403).send('Forbidden. No right to access.').end()
    } else {
      next()
    }
  })
}

module.exports = {
  validate,
}
