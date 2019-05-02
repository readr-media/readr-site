process.env.NODE_ENV = 'test'

const { SERVER_HOST, } = require('../../../api/config')
const getExpressApp = require('../helpers/getExpressApp')
const app = getExpressApp()

const chai = require('chai')
const faker = require('faker')
const should = chai.should()
const supertest = require('supertest')

const testData = {
  id: 3,
  author: 'Faker',
  title: 'This is test',
  content: '<p>This is test content<p>',
  link: 'https://www.mirrormedia.mg/',
}

const updatedData = {
  id: 3,
  title: 'This is test 2',
  content: '<p>This is test content 2<p>',
  link: 'https://dev.readr.tw/',
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

// describe('/POST/post', () => {
//   it('should add article sucessfully', (done) => {
//     supertest(app).post('/api/post')
//     .set('Authorization', `Bearer ${token}`)
//     .send({
//       author: testData.author,
//       title: testData.title,
//       content: testData.content,
//       link: testData.link
//     })
//     .end((err, res) => {
//       if (err) return console.log(err)
//       res.status.should.equal(200)
//       done()
//     })
//   })
// })

describe('/PUT/post', () => {
  it(`should update article[${updatedData.id}] data sucessfully`, (done) => {
    supertest(app).put('/api/post')
    .set('Authorization', `Bearer ${token}`)    
    .send(updatedData)
    .end((err, res) => {
      if (err) return console.log(err)
      res.status.should.equal(200)
      done()
    })
  }).timeout(100)
})

describe('/GET/post/:id', () => {
  it(`should get article[${testData.id}] data through api`, (done) => {
    supertest(app).get('/api/post/' + testData.id)
    .set('Authorization', `Bearer ${token}`)
    .end((err, res) => {
      if (err) return console.log(err)
      res.status.should.equal(200)
      res.body.should.be.an('object').and.have.property('id').to.be.equal(testData.id)
      res.body.should.have.property('title').and.to.equal(updatedData.title)
      res.body.should.have.property('content').and.to.equal(updatedData.content)
      res.body.should.have.property('link').and.to.equal(updatedData.link)
      done()
    })
  }).timeout(100)
})

describe('/DELETE/post/:id', () => {
  it(`should delete article[${testData.id}] data through api`, (done) => {
    supertest(app).delete('/api/post/' + testData.id)
    .set('Authorization', `Bearer ${token}`) 
    .end((err, res) => {
      if (err) return console.log(err)
      res.status.should.equal(200)
      // res.body.should.have.property('active').and.to.equal(0)
      done()
    })
  }).timeout(100)
})

describe('/GET/posts', () => {
  it(`should get articles data through api`, (done) => {
    supertest(app).get('/api/posts/')
    .set('Authorization', `Bearer ${token}`)
    .end((err, res) => {
      if (err) return console.log(err)
      res.status.should.equal(200)
      res.body.should.be.an('array')
      done()
    })
  }).timeout(100)
})

// describe('/POST/uploadImg', () => {
//   it(`should upload image through api`, (done) => {
//     supertest(app).post('/api/uploadImg/')
//     .set('Authorization', `Bearer ${token}`)
//     .attach('image', '../../../public/404.jpg')
//     .end((err, res) => {
//       if (err) return console.log(err)
//       res.status.should.equal(200)
//       done()
//     })
//   }).timeout(500)
// })
