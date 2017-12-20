const getExpressApp = require('../helpers/getExpressApp')
const app = getExpressApp()

const chai = require('chai')
const faker = require('faker')
const should = chai.should()
const supertest = require('supertest')

const testData = {
  id: '12345678',
  author: 'Faker',
  title: 'This is test'
}

const updatedData = {
  id: '12345678',
  title: 'This is test 2',
  active: 1
}

let token

describe('/POST/login', () => {
  it('should login & get token sucessfully', (done) => {
    supertest(app).post('/api/login')
    .send({
      'email': 'test9474',
      'password': 'testfasdf',
    })
    .end((err, res) => {
      if (err) return console.log(err)
      res.status.should.equal(200)
      res.body.token.should.be.a('string')
      token = res.body.token
      done()
    })
  })
})

// describe('/POST/article', () => {
//   it('should add article sucessfully', (done) => {
//     supertest(app).post('/api/article')
//     .set('Authorization', `Bearer ${token}`)
//     .send({
//       id: testData.id,
//       author: testData.author,
//       title: testData.title,
//       content: '',
//       link: '',
//       og_title: '',
//       og_description: '',
//       og_image: '',
//     })
//     .end((err, res) => {
//       if (err) return console.log(err)
//       res.status.should.equal(200)
//       done()
//     })
//   })
// })

describe('/PUT/article', () => {
  it(`should update article[${updatedData.id}] data sucessfully`, (done) => {
    supertest(app).put('/api/article')
    .set('Authorization', `Bearer ${token}`)    
    .send(updatedData)
    .end((err, res) => {
      if (err) return console.log(err)
      res.status.should.equal(200)
      done()
    })
  })
})

describe('/GET/article/:id', () => {
  it(`should get article[${testData.id}] data through api`, (done) => {
    supertest(app).get('/api/article/' + testData.id)
    .set('Authorization', `Bearer ${token}`)
    .end((err, res) => {
      if (err) return console.log(err)
      res.body.should.be.an('object').and.have.property('id').to.be.equal(testData.id)
      res.body.should.have.property('author').and.to.equal(testData.author)
      res.body.should.have.property('title').and.to.equal(updatedData.title)
      done()
    })
  }).timeout(500)
})

describe('/DELETE/article/:id', () => {
  it(`should delete article[${testData.id}] data through api`, (done) => {
    supertest(app).delete('/api/article/' + testData.id)
    .set('Authorization', `Bearer ${token}`) 
    .end((err, res) => {
      if (err) return console.log(err)
      res.status.should.equal(200)
      res.body.should.have.property('active').and.to.equal(0)
      done()
    })
  })
})
