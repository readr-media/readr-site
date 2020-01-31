process.env.NODE_ENV = 'test'

const { SERVER_HOST, } = require('../../../api/config')
const getExpressApp = require('../helpers/getExpressApp')
const app = getExpressApp()

const chai = require('chai')
const faker = require('faker')
const should = chai.should()
const supertest = require('supertest')

const updatedData = {
  ids: [ 12, 97, ],
  updated_by: 'wonderwomen@wonderwomen.com',
}

const deletedData = {
  ids: [ 72, 68, ],
  updated_by: 'wonderwomen@wonderwomen.com',
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

// describe('/PUT/posts', () => {
//   it(`should update article[${updatedData.ids[0]}, ${updatedData.ids[1]}] active to published`, (done) => {
//     supertest(app).put('/api/posts')
//     .set('Authorization', `Bearer ${token}`)    
//     .send(updatedData)
//     .end((err, res) => {
//       if (err) return console.log(err)
//       res.status.should.equal(200)
//       done()
//     })
//   }).timeout(400)
// })

// describe('/DELETE/posts', () => {
//   it(`should delete article data through api`, (done) => {
//     supertest(app).delete('/api/posts?ids= [ 72, 68 ]&updated_by=wonderwomen@wonderwomen.com')
//     .set('Authorization', `Bearer ${token}`) 
//     .end((err, res) => {
//       if (err) return console.log(err)
//       res.status.should.equal(200)
//       done()
//     })
//   }).timeout(400)
// })

describe('/GET/posts/count', () => {
  it(`should get post amount through api`, (done) => {
    supertest(app).get('/api/posts/count')
    .set('Authorization', `Bearer ${token}`) 
    .end((err, res) => {
      if (err) return console.log(err)
      res.status.should.equal(200)
      res.body.should.be.an('object')
      res.body.should.have.property('_meta')
      done()
    })
  }).timeout(400)
})
