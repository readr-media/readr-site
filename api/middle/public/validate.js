const Joi = require('joi')

const validate = (scheme) => (req, res, next) => {
  Joi.validate(req.query, scheme, { allowUnknown: true }, (err, result) => {
    if (err) {
      res.status(403).send('Forbidden. No right to access.').end()
    } else {
      next()
    }
  })
}

module.exports = {
  validate
}
