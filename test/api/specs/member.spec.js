const supertest = require('supertest')

const chai = require('chai')
const should = chai.should()

const api = supertest('http://localhost:8080')
// const api2 = supertest('http://localhost:8080')
const faker = require('faker')
const random = Math.round(Math.random() * 10000)
const id = `test${random}`
const updatedData = {
  'id': 'test7642',
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
  'comment_push': false 
}
console.log('id', id)

// describe('/POST/member', () => {
//   it('should post sucessfully', (done) => {
//     api.post('/api/member')
//     .send({
//       'id': id,
//       'name': faker.name.findName(),
//       'nickname': faker.name.title(),
//       'birthday': faker.date.past(),
//       'gender': 'M',
//       'work': faker.name.jobTitle(),
//       'mail': faker.internet.email(),
//       'register_mode': null,
//       'social_id': null,
//       'updated_by': null,
//       'description': null,
//       'profile_image': null,
//       'identity': null,
//       'custom_editor': false,
//       'hide_profile': false,
//       'profile_push': false,
//       'post_push': false,
//       'comment_push': false,
//       'active': true
//     })
//     .end(function (err, res) {
//       if (err) return console.log(err)
//       res.body.status.should.equal(200)
//       done()
//     })
//   })
// })
// describe('/GET/member/:id', () => {
//   it('should get member data from api', (done) => {
//     api.get('/api/member/' + id)
//     .end(function (err, res) {
//       if (err) return console.log(err)
//       res.body.should.be.an('object').and.have.property('id').to.be.equal(id)
//       res.body.should.have.property('name')
//       res.body.should.have.property('nickname')
//       res.body.should.have.property('birthday')
//       res.body.should.have.property('gender')
//       res.body.should.have.property('occupation')
//       res.body.should.have.property('mail')
//       res.body.should.have.property('register_mode')
//       res.body.should.have.property('social_id')
//       res.body.should.have.property('created_at')
//       res.body.should.have.property('updated_at')
//       res.body.should.have.property('updated_by')
//       res.body.should.have.property('description')
//       res.body.should.have.property('profile_image')
//       res.body.should.have.property('identity')
//       res.body.should.have.property('custom_editor')
//       res.body.should.have.property('hide_profile')
//       res.body.should.have.property('profile_push')
//       res.body.should.have.property('post_push')
//       res.body.should.have.property('comment_push')
//       res.body.should.have.property('active')
//       console.log('dondone')
//       done()
//     })
//   })
// })

// describe('/PUT/member', () => {
//   it(`should update member[${updatedData.id}] data sucessfully`, (done) => {
//     console.log('cd')
//     api.put('/api/member')
//     .send(updatedData)
//     .end(function (err, res) {
//       if (err) return console.log(err)
//       res.body.status.should.equal(200)
//       console.log('done')
//       done()
//     })
//   })
// })
// describe('/GET/member/:id', () => {
//   it(`should get member[${updatedData.id}] data through api`, (done) => {
//     console.log('cd2')
//     api.get('/api/member/' + updatedData.id)
//     .end(function (err, res) {
//       if (err) return console.log(err)
//       res.body.should.be.an('object').and.have.property('id').to.be.equal(updatedData.id)
//       console.log('res', res.body)
//       // res.body.should.have.property('name').and.to.equal(updatedData.name)
//       // res.body.should.have.property('nickname').and.to.equal(updatedData.nickname)
//       // // res.body.should.have.property('birthday').and.to.equal(updatedData.birthday)
//       // // res.body.should.have.property('work').and.to.equal(updatedData.work)
//       // res.body.should.have.property('mail').and.to.equal(updatedData.mail)
//       done()
//     })
//   })
// })
describe('/DELETE/member/:id', () => {
  it(`should delete member[${updatedData.id}] data through api`, (done) => {
    api.delete('/api/member/' + updatedData.id)
    .end(function (err, res) {
      if (err) return console.log(err)
      res.body.status.should.equal(200)
      done()
    })
  })
})