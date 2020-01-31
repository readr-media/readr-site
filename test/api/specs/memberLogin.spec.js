process.env.NODE_ENV = 'test'

const getExpressApp = require('../helpers/getExpressApp')
const { SERVER_HOST, } = require('../../../api/config')
const app = getExpressApp()

const chai = require('chai')
const should = chai.should()
const supertest = require('supertest')

// const faker = require('faker')
// const random = Math.round(Math.random() * 10000)
// const id = faker.internet.email() // `test${random}`
// const updatedData = {
//   'id': id,
//   'name': `UPDATED NAME ${random}`,
//   'nickname': `UPDATED TITLE ${random}`,
//   'birthday': faker.date.past(),
//   'gender': 'M',
//   // 'work': faker.name.jobTitle(),
//   'mail': id,
//   'register_mode': 'ordinary',
//   'social_id': null,
//   'updated_by': null,
//   'description': null,
//   'profile_image': null,
//   'identity': null,
//   'custom_editor': false,
//   'hide_profile': false,
//   'profile_push': false,
//   'post_push': false,
//   'comment_push': false,
// }

// let token
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
    supertest(app).get('/api/token/login')
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
      'register_mode': 'ordinary',
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

describe('/POST/login', () => {
  it('should login in fail because of the disposableToken is revoked', (done) => {
    supertest(app).post('/api/login')
    .set('Authorization', `Bearer ${disposableToken}`)
    .send({
      'email': 'wonderwomen@wonderwomen.com',
      'password': 'wonderwomen@wonderwomen.com',
      'register_mode': 'ordinary',
    })
    .end(function (err, res) {
      if (err) return console.log(err)
      res.status.should.equal(401)
      done()
    })
  })
})

// describe('/GET/member/:id', () => {
//   it('should get member data from api', (done) => {
//     setTimeout(() => {
//       supertest(app).get('/api/member/' + updatedData.id)
//       .set('Authorization', `Bearer ${token}`)
//       .end(function (err, res) {
//         if (err) return console.log(err)
//         res.body._items[ 0 ].should.be.an('object').and.have.property('id').to.be.equal(updatedData.id)
//         res.body._items[ 0 ].should.have.property('name')
//         res.body._items[ 0 ].should.have.property('nickname')
//         res.body._items[ 0 ].should.have.property('birthday')
//         res.body._items[ 0 ].should.have.property('gender')
//         // res.body._items[ 0 ].should.have.property('work')
//         res.body._items[ 0 ].should.have.property('mail')
//         res.body._items[ 0 ].should.have.property('register_mode')
//         res.body._items[ 0 ].should.have.property('social_id')
//         res.body._items[ 0 ].should.have.property('created_at')
//         res.body._items[ 0 ].should.have.property('updated_at')
//         res.body._items[ 0 ].should.have.property('updated_by')
//         res.body._items[ 0 ].should.have.property('description')
//         res.body._items[ 0 ].should.have.property('profile_image')
//         res.body._items[ 0 ].should.have.property('identity')
//         res.body._items[ 0 ].should.have.property('custom_editor')
//         res.body._items[ 0 ].should.have.property('hide_profile')
//         res.body._items[ 0 ].should.have.property('profile_push')
//         res.body._items[ 0 ].should.have.property('post_push')
//         res.body._items[ 0 ].should.have.property('comment_push')
//         res.body._items[ 0 ].should.have.property('active')
//         done()
//       })
//     }, 1000)
//   })
// })
// describe('/PUT/member', () => {
//   it(`should update member[${updatedData.id}] data sucessfully`, (done) => {
//     supertest(app).put('/api/member')
//     .set('Authorization', `Bearer ${token}`)    
//     .send(updatedData)
//     .end(function (err, res) {
//       if (err) return console.log(err)
//       res.status.should.equal(200)
//       done()
//     })
//   })
// })
// describe('/GET/member/:id', () => {
//   it(`should get member[${updatedData.id}] data through api`, (done) => {
//     setTimeout(() => {
//       supertest(app).get('/api/member/' + updatedData.id)
//       .set('Authorization', `Bearer ${token}`)
//       .end(function (err, res) {
//         if (err) return console.log(err)
//         res.body._items[ 0 ].should.be.an('object').and.have.property('id').to.be.equal(updatedData.id)
//         res.body._items[ 0 ].should.have.property('name').and.to.equal(updatedData.name)
//         res.body._items[ 0 ].should.have.property('nickname').and.to.equal(updatedData.nickname)
//         res.body._items[ 0 ].should.have.property('mail').and.to.equal(updatedData.mail)
//         done()
//       })      
//     }, 1000)
//   })
// })
// describe('/DELETE/member/:id', () => {
//   // it(`would delete member data in fail with member id dosent exist in db`, (done) => {
//   //   supertest(app).delete('/api/member/nowxistid')
//   //   .set('Authorization', `Bearer ${token}`) 
//   //   .end(function (err, res) {
//   //     if (err) return console.log(err)
//   //     res.status.should.equal(500)
//   //     done()
//   //   })
//   // })
//   it(`should delete member[${updatedData.id}] data through api`, (done) => {
//     supertest(app).delete('/api/member/' + updatedData.id)
//     .set('Authorization', `Bearer ${token}`) 
//     .end(function (err, res) {
//       if (err) return console.log(err)
//       res.status.should.equal(200)
//       done()
//     })
//   })
//   it(`should get inactive member[${updatedData.id}] data through api`, (done) => {
//     setTimeout(() => {
//       supertest(app).get('/api/member/' + updatedData.id)
//       .set('Authorization', `Bearer ${token}`)
//       .end(function (err, res) {
//         if (err) return console.log(err)
//         res.body._items[ 0 ].should.be.an('object').and.have.property('id').to.be.equal(updatedData.id)
//         res.body._items[ 0 ].should.have.property('name').and.to.equal(updatedData.name)
//         res.body._items[ 0 ].should.have.property('nickname').and.to.equal(updatedData.nickname)
//         res.body._items[ 0 ].should.have.property('mail').and.to.equal(updatedData.mail)
//         res.body._items[ 0 ].should.have.property('active').and.to.equal(-1)
//         done()
//       })      
//     }, 1000)
//   })
// })