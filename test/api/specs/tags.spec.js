process.env.NODE_ENV = 'test'

const { SERVER_HOST, } = require('../../../api/config')
const getExpressApp = require('../helpers/getExpressApp')
const app = getExpressApp()

const chai = require('chai')
const faker = require('faker')
const should = chai.should()
const supertest = require('supertest')

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

// describe('/POST/tags', () => {
//   it('should add tags sucessfully', (done) => {
//     supertest(app).post('/api/tags')
//     .set('Authorization', `Bearer ${token}`)
//     .send({
//       name: 'tag2',
//     })
//     .end((err, res) => {
//       if (err) return console.log(err)
//       console.log('res', res.body)
//       res.status.should.equal(200)
//       done()
//     })
//   }).timeout(200)
// })

// describe('/PUT/tags', () => {
//   it(`should update tags data sucessfully`, (done) => {
//     supertest(app).put('/api/tags')
//     .set('Authorization', `Bearer ${token}`)    
//     .send({
//       id: 3,
//       text: '迷客夏'
//     })
//     .end((err, res) => {
//       if (err) return console.log(err)
//       res.status.should.equal(200)
//       done()
//     })
//   }).timeout(100)
// })

// describe('/DELETE/tags', () => {
//   it(`should delete tags data through api`, (done) => {
//     supertest(app).delete(`/api/tags?ids=[ 6 ]`)
//     .set('Authorization', `Bearer ${token}`)
//     .end((err, res) => {
//       if (err) return console.log(err)
//       res.status.should.equal(200)
//       done()
//     })
//   }).timeout(300)
// })

describe('/GET/tags', () => {
  it(`should get tags data through api`, (done) => {
    supertest(app).get(`/api/tags?keyword=tag`)
    .set('Authorization', `Bearer ${token}`)
    .end((err, res) => {
      if (err) return console.log(err)
      res.status.should.equal(200)
      res.body.should.be.an('object').and.have.property('_items')
      res.body._items.should.be.an('array')
      done()
    })
  }).timeout(100)
})

describe('/GET/tags/count', () => {
  it(`should get tags count through api`, (done) => {
    supertest(app).get(`/api/tags/count`)
    .set('Authorization', `Bearer ${token}`)
    .end((err, res) => {
      if (err) return console.log(err)
      res.status.should.equal(200)
      res.body.should.be.an('object').and.have.property('_meta')
      res.body._meta.should.be.an('object').and.have.property('total')
      done()
    })
  }).timeout(100)
})
