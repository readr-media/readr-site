process.env.NODE_ENV = 'test'

const getExpressApp = require('../helpers/getExpressApp')
const { SERVER_HOST, } = require('../../../api/config')
const app = getExpressApp()

const chai = require('chai')
const should = chai.should()
const supertest = require('supertest')

const faker = require('faker')
const random = Math.round(Math.random() * 10000)
const id = faker.internet.email()

let disposableToken
describe('/POST/token', () => {
  it('should get disposable token in fail without params', (done) => {
    supertest(app).get('/api/token')
    .end(function (err, res) {
      if (err) return console.log(err)
      res.status.should.equal(403)
      res.text.should.equal('Forbidden.')
      done()
    })
  })
  it('should get disposable token in fail with wrong param { type }', (done) => {
    supertest(app).get('/api/token/nono')
    .end(function (err, res) {
      if (err) return console.log(err)
      res.status.should.equal(403)
      res.text.should.equal('Forbidden.')
      done()
    })
  })
  it('should get disposable token sucessfully', (done) => {
    supertest(app).get('/api/token/register')
    .end(function (err, res) {
      if (err) return console.log(err)
      res.status.should.equal(200)
      res.body.token.should.be.a('string')
      disposableToken = res.body.token
      done()
    })
  })
})

let activeToken = ''
describe('/POST/register', () => {
//   // it('should register by google account sucessfully', (done) => {
//   //   supertest(app).post('/api/register')
//   //   .set('Authorization', `Bearer ${disposableToken}`)
//   //   .send({
//   //     idToken: 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjM1M2JhOTlhOTgyMWZmNDhlMzAzNjVlZjFjMjRhMzAzZmIzMzE3ZTYifQ.eyJhenAiOiI5ODM5NTY5MzE1NTMtYm50anNhM2M2bWs2dmtrc2NhdTMxZTZyZHYxa2pydm8uYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI5ODM5NTY5MzE1NTMtYm50anNhM2M2bWs2dmtrc2NhdTMxZTZyZHYxa2pydm8uYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDA3Nzk0OTEwNjk0NDQ5Mzg5NzMiLCJoZCI6Im1pcnJvcm1lZGlhLm1nIiwiZW1haWwiOiJrZWl0aGNoaWFuZ0BtaXJyb3JtZWRpYS5tZyIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhdF9oYXNoIjoiRkh3MkpNMkpIX3pITWNmc2RlWENCdyIsImlzcyI6ImFjY291bnRzLmdvb2dsZS5jb20iLCJqdGkiOiI2Njk0Y2NhMWM5ZjUwN2NjODg2NGQ2NzFjMzlhZTBjMDI2MzEwNjViIiwiaWF0IjoxNTEzODUxOTY3LCJleHAiOjE1MTM4NTU1NjcsIm5hbWUiOiLmsZ_pjqfoh7MiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDUuZ29vZ2xldXNlcmNvbnRlbnQuY29tLy12djk3aktWME5RQS9BQUFBQUFBQUFBSS9BQUFBQUFBQUFBQS9BRmlZb2YzM084WTllbnpZNU1Tbldwczc4MW92dTE5WUpBL3M5Ni1jL3Bob3RvLmpwZyIsImdpdmVuX25hbWUiOiLpjqfoh7MiLCJmYW1pbHlfbmFtZSI6IuaxnyIsImxvY2FsZSI6InpoLVRXIn0.hoJc-zvcbPw30u0h8oguyENNow5jnv6cLT_frAi4B7CCo6JwWZC4VYlBUhQZBZC5HN5BI3u7hdMUX4CsFrua3ITXdkZ04wby9NR9oFDX0T0FPlaGJkEF9J5RnFtk0qwNWwvmeXOWM-URPq8V3Dj-_CNAA6m4Q6M6o26XaMdwo-YK1ulyYtQ4ETpmqqqW7k09mi4KTh_MXpCvMzJvUXCj3BN5yR0-ouZeTtRTtbEaRVtML0_lXPbuzdmIX4YEmNv2W_p-4jGuk-w64o4x4GJ39j0ZReEAzvltkFZzZgt-PGmnHnZy2mG1iz2DlWbzwpDY_thU7JSWXW3_YfgeWckS5Q',
//   //     register_mode: 'google'
//   //   })
//   //   .end(function (err, res) {
//   //     if (err) return console.log(err)
//   //     res.status.should.equal(200)
//   //     done()
//   //   })
//   // })
//   // it('should register by google account in fail with a expired token', (done) => {
//   //   supertest(app).post('/api/register')
//   //   .set('Authorization', `Bearer ${disposableToken}`)
//   //   .send({
//   //     idToken: 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjM1M2JhOTlhOTgyMWZmNDhlMzAzNjVlZjFjMjRhMzAzZmIzMzE3ZTYifQ.eyJhenAiOiI5ODM5NTY5MzE1NTMtYm50anNhM2M2bWs2dmtrc2NhdTMxZTZyZHYxa2pydm8uYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI5ODM5NTY5MzE1NTMtYm50anNhM2M2bWs2dmtrc2NhdTMxZTZyZHYxa2pydm8uYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDA3Nzk0OTEwNjk0NDQ5Mzg5NzMiLCJoZCI6Im1pcnJvcm1lZGlhLm1nIiwiZW1haWwiOiJrZWl0aGNoaWFuZ0BtaXJyb3JtZWRpYS5tZyIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhdF9oYXNoIjoidm9xcjF1MXlsR3Vtb2dac1BLUzVHUSIsImlzcyI6ImFjY291bnRzLmdvb2dsZS5jb20iLCJqdGkiOiJmMmY0NmI0NThhYzU4YzdkNGVkZmE1NDdmYmQyZTc5ZmQyNmY3MjdkIiwiaWF0IjoxNTEzODQ3NTE1LCJleHAiOjE1MTM4NTExMTUsIm5hbWUiOiLmsZ_pjqfoh7MiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDUuZ29vZ2xldXNlcmNvbnRlbnQuY29tLy12djk3aktWME5RQS9BQUFBQUFBQUFBSS9BQUFBQUFBQUFBQS9BRmlZb2YzM084WTllbnpZNU1Tbldwczc4MW92dTE5WUpBL3M5Ni1jL3Bob3RvLmpwZyIsImdpdmVuX25hbWUiOiLpjqfoh7MiLCJmYW1pbHlfbmFtZSI6IuaxnyIsImxvY2FsZSI6InpoLVRXIn0.Cu7OStT4jUzmk07d0yZTBcDarxhypVAEPmUvM8usfDkQM870Q-9oOo-0taUAwIj8pRVUQDFTziXPLgQev56Xv355kIVmRh74-LDGMjcc2xtiF_3wrpZVuVvKtqiMjN3jmSwwAarv9KWNCc_nzFBH986Jgp06JlBDokke0C_hTI1DkRJvHxpttq24jEzqHayRzwVxoz3UH2EpOENMxDCmT0JT1fkpGDBMNW_ikz55si4cVXzXS7TThjzvIaIIkGitJYvwAgIQC4CJlZqlBHSMzu7QEePdig-rPrOCqco4RUy7rjM2_kXpLoSEDlDi2ZZgJWKmuq9_gY1ueacONDqy_g',
//   //     register_mode: 'google'
//   //   })
//   //   .end(function (err, res) {
//   //     if (err) return console.log(err)
//   //     res.text.should.have.string('Token used too late')
//   //     res.status.should.equal(403)
//   //     done()
//   //   })
//   // })
  it('should register in fail without any param', (done) => {
    supertest(app).post('/api/register')
    .set('Authorization', `Bearer ${disposableToken}`)
    .end(function (err, res) {
      if (err) return console.log(err)
      res.body.should.have.property('message').to.be.string('Please offer all requirements.')
      res.status.should.equal(400)
      done()
    })
  })
  // it('should register by facebook account successfully', (done) => {
  //   supertest(app).post('/api/register')
  //   .set('Authorization', `Bearer ${disposableToken}`)
  //   .send({
  //     email: 'test@test.test',
  //     register_mode: 'oauth-fb',
  //     social_id: 'test' + random
  //   })
  //   .end(function (err, res) {
  //     if (err) return console.log(err)
  //     res.status.should.equal(200)
  //     done()
  //   })
  // }).timeout(50000)
  it('should register [ ' + id + ' ] sucessfully', (done) => {
    supertest(app).post('/api/register')
    .set('Authorization', `Bearer ${disposableToken}`)
    .send({
      'id': id,
      'name': faker.name.findName(),
      'nickname': faker.name.title(),
      'birthday': faker.date.past(),
      'gender': 'M',
      'work': faker.name.jobTitle(),
      'email': id,
      'register_mode': 'ordinary',
      'social_id': null,
      'updated_by': null,
      'description': null,
      'profile_image': null,
      'identity': null,
      'custom_editor': false,
      'hide_profile': false,
      'password': 'ohoh',
      'profile_push': false,
      'post_push': false,
      'comment_push': false,
    })
    .end(function (err, res) {
      if (err) return console.log(err)
      activeToken = res.body.token
      res.status.should.equal(200)
      activeToken.should.be.not.undefined
      done()
    })
  })
  it('should register [ ' + id + '2 ] in fail because of the disposableToken is revoked', (done) => {
    supertest(app).post('/api/register')
    .set('Authorization', `Bearer ${disposableToken}`)
    .send({
      'id': id + '2',
      'name': faker.name.findName(),
      'nickname': faker.name.title(),
      'birthday': faker.date.past(),
      'gender': 'M',
      'work': faker.name.jobTitle(),
      'email': id + '2',
      'register_mode': 'ordinary',
      'social_id': null,
      'updated_by': null,
      'description': null,
      'profile_image': null,
      'identity': null,
      'custom_editor': false,
      'hide_profile': false,
      'password': 'ohoh',
      'profile_push': false,
      'post_push': false,
      'comment_push': false,
    })
    .end(function (err, res) {
      if (err) return console.log(err)
      res.status.should.equal(401)
      done()
    })
  }).timeout(50000)
  it('should activate the new account \'' + id + '\'', (done) => {
    supertest(app).get('/api/activate/' + activeToken)
    .end(function (err, res) {
      if (err) return console.log(err)
      res.status.should.equal(302)
      done()
    })
  }).timeout(50000)
})