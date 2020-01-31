process.env.NODE_ENV = 'test'

const { SERVER_HOST, } = require('../../../api/config')
const getExpressApp = require('../helpers/getExpressApp')
const app = getExpressApp()

const chai = require('chai')
const faker = require('faker')
const should = chai.should()
const supertest = require('supertest')

const testUrl = 'https://www.mirrormedia.mg/'

let disposableToken
let token

describe('/POST/token', () => {
  it('should get disposable token sucessfully', (done) => {
    supertest(app).post('/api/token')
    .send({
      'type': 'register',
      'host': SERVER_HOST,
    })
    .end(function (err, res) {
      if (err) return console.log(err)
      res.status.should.equal(200)
      res.body.token.should.be.a('string')
      disposableToken = res.body.token
      done()
    })
  })
})

describe('/POST/login', () => {
  it('should login & get token sucessfully', (done) => {
    supertest(app).post('/api/login')
    .set('Authorization', `Bearer ${disposableToken}`)
    .send({
      'email': 'wonderwomen@wonderwomen.com',
      'password': 'wonderwomen@wonderwomen.com',
    })
    .end(function (err, res) {
      if (err) return console.log(err)
      res.status.should.equal(200)
      res.body.token.should.be.a('string')
      token = res.body.token
      done()
    })
  })
})

describe('/POST/meta', () => {
  it(`should get meta through api`, (done) => {
    supertest(app).post('/api/meta/')
    .set('Authorization', `Bearer ${token}`)
    .send({
      'url': testUrl,
    })
    .end((err, res) => {
      if (err) return console.log(err)
      res.status.should.equal(200)
      res.body.should.have.property('openGraph')
      done()
    })
  }).timeout(1000)
})
