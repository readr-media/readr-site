const supertest = require('supertest')

const api = supertest('http://localhost:8080')
const chai = require('chai')
const should = chai.should()

describe('GET/POST/PUT/DELETE to /member', () => {
  it('should get member data from api', (done) => {
    api.get('/api/member/abc1231')
    .end(function (err, res) {
      if (err) return console.log(err)
      res.body.should.be.an('object').and.have.property('id')
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
  })
  it('should post sucessfully', () => {
    const faker = require('faker')
    const id = `test${Math.round(Math.random() * 10000)}`
    api.post('/member')
    .send({
      'id': id,
      'name': faker.name.findName(),
      'nickname': faker.name.title(),
      'birthday': faker.date.past(),
      'gender': 'M',
      'occupation': faker.name.jobTitle(),
      'mail': faker.internet.email(),
      'register_mode': null,
      'social_id': null,
      'created_at': '2017-09-29T20:23:45Z',
      'updated_at': '2017-11-08T04:28:34Z',
      'updated_by': null,
      'description': null,
      'profile_image': null,
      'identity': null,
      'custom_editor': false,
      'hide_profile': false,
      'profile_push': false,
      'post_push': false,
      'comment_push': false,
      'active': false      
    })
    .end(function (err, res) {
      if (err) return console.log(err)
      console.log(res)
    })
  })
})
