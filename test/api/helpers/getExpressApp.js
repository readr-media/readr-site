const express = require('express')

module.exports = function () {
  const app = express()
  app.use('/api', require('../../../api/index'))
  app.listen(8080, () => {
    console.log(`server started at localhost: 8080`)
  })
  return app
}