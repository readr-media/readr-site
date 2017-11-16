const google = require('googleapis');
const superagent = require('superagent')
const urlshortener = google.urlshortener('v1');

router.use('/googleLogin', function(req, res, next) {
  console.log('got googleReq')
  next()
})