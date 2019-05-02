process.env.NODE_ENV = 'test'

const { SERVER_HOST, } = require('../../../api/config')
const getExpressApp = require('../helpers/getExpressApp')
const app = getExpressApp()

const chai = require('chai')
const faker = require('faker')
const should = chai.should()
const supertest = require('supertest')

const testDataByUser = {
  subject: 'wonderwomen2@wonderwomen.com',
  resource: 'post',
}

const testDataByResource = {
  resource: 'post',
  ids: [ 'wonderwomen2@wonderwomen.com', ],
}

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

describe('/GET/following/byuser', () => {
  it(`should get following[${testDataByUser.subject} ${testDataByUser.resource}] data through api`, (done) => {
    supertest(app).get('/api/following/byuser')
    .set('Authorization', `Bearer ${token}`)
    .query(testDataByUser)
    .end((err, res) => {
      if (err) return console.log(err)
      res.status.should.equal(200)
      res.body.should.be.an('array')
      done()
    })
  }).timeout(300)
})

describe('/GET/following/byresource', () => {
  it(`should get following[${testDataByResource.resource} ${testDataByResource.ids}] data through api`, (done) => {
    supertest(app).get('/api/following/byresource')
    .set('Authorization', `Bearer ${token}`)
    .query(testDataByResource)
    .end((err, res) => {
      if (err) return console.log(err)
      res.status.should.equal(200)
      res.body.should.be.an('array')
      done()
    })
  }).timeout(300)
})
