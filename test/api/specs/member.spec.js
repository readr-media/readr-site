const getExpressApp = require('../helpers/getExpressApp')
const app = getExpressApp()

const chai = require('chai')
const should = chai.should()
const supertest = require('supertest')

const faker = require('faker')
const random = Math.round(Math.random() * 10000)
const id = `test${random}`
const updatedData = {
  'id': 'test9474',
  'name': `UPDATED NAME ${random}`,
  'nickname': `UPDATED TITLE ${random}`,
  'birthday': faker.date.past(),
  'gender': 'M',
  'work': faker.name.jobTitle(),
  'mail': faker.internet.email(),
  'register_mode': null,
  'social_id': null,
  'updated_by': null,
  'description': null,
  'profile_image': null,
  'identity': null,
  'custom_editor': false,
  'hide_profile': false,
  'profile_push': false,
  'post_push': false,
  'comment_push': false,
}

// describe('/POST/register', () => {
//   it('should register sucessfully', (done) => {
//     supertest(app).post('/api/register')
//     .send({
//       'id': id,
//       'name': faker.name.findName(),
//       'nickname': faker.name.title(),
//       'birthday': faker.date.past(),
//       'gender': 'M',
//       'work': faker.name.jobTitle(),
//       'email': faker.internet.email(),
//       'register_mode': null,
//       'social_id': null,
//       'updated_by': null,
//       'description': null,
//       'profile_image': null,
//       'identity': null,
//       'custom_editor': false,
//       'hide_profile': false,
//       'password': 'testfasdf',
//       'profile_push': false,
//       'post_push': false,
//       'comment_push': false,
//     })
//     .end(function (err, res) {
//       if (err) return console.log(err)
//       res.status.should.equal(200)
//       done()
//     })
//   })
// })

let token
describe('/POST/login', () => {
  it('should login & get token sucessfully', (done) => {
    supertest(app).post('/api/login')
    .send({
      'email': faker.internet.email(),
      'password': 'testfasdf',
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

describe('/GET/member/:id', () => {
  it('should get member data from api', (done) => {
    setTimeout(() => {
      supertest(app).get('/api/member/' + updatedData.id)
      .set('Authorization', `Bearer ${token}`)
      .end(function (err, res) {
        if (err) return console.log(err)
        res.body.should.be.an('object').and.have.property('id').to.be.equal(updatedData.id)
        res.body.should.have.property('name')
        res.body.should.have.property('nickname')
        res.body.should.have.property('birthday')
        res.body.should.have.property('gender')
        res.body.should.have.property('occupation')
        res.body.should.have.property('mail')
        res.body.should.have.property('register_mode')
        res.body.should.have.property('social_id')
        res.body.should.have.property('created_at')
        res.body.should.have.property('updated_at')
        res.body.should.have.property('updated_by')
        res.body.should.have.property('description')
        res.body.should.have.property('profile_image')
        res.body.should.have.property('identity')
        res.body.should.have.property('custom_editor')
        res.body.should.have.property('hide_profile')
        res.body.should.have.property('profile_push')
        res.body.should.have.property('post_push')
        res.body.should.have.property('comment_push')
        res.body.should.have.property('active')
        done()
      })
    }, 500)
  })
})

describe('/PUT/member', () => {
  it(`should update member[${updatedData.id}] data sucessfully`, (done) => {
    supertest(app).put('/api/member')
    .set('Authorization', `Bearer ${token}`)    
    .send(updatedData)
    .end(function (err, res) {
      if (err) return console.log(err)
      res.status.should.equal(200)
      done()
    })
  })
})
describe('/GET/member/:id', () => {
  it(`should get member[${updatedData.id}] data through api`, (done) => {
    setTimeout(() => {
      supertest(app).get('/api/member/' + updatedData.id)
      .set('Authorization', `Bearer ${token}`)
      .end(function (err, res) {
        if (err) return console.log(err)
        res.body.should.be.an('object').and.have.property('id').to.be.equal(updatedData.id)
        res.body.should.have.property('name').and.to.equal(updatedData.name)
        res.body.should.have.property('nickname').and.to.equal(updatedData.nickname)
        res.body.should.have.property('mail').and.to.equal(updatedData.mail)
        done()
      })      
    }, 1000)
  })
})
describe('/DELETE/member/:id', () => {
  it(`should delete member[${updatedData.id}] data through api`, (done) => {
    supertest(app).delete('/api/member/' + updatedData.id)
    .set('Authorization', `Bearer ${token}`) 
    .end(function (err, res) {
      if (err) return console.log(err)
      res.status.should.equal(200)
      done()
    })
  })
})