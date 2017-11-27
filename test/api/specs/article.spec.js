const supertest = require('supertest')

const api = supertest('http://localhost:8080')
const chai = require('chai')
const should = chai.should()

describe('test article data fetching', () => {
  it('should get ariticle data from api', (done) => {
    api.get('/api/article/3345678')
    .end(function(err, res) {
      if (err) return console.log(err)
      res.body.should.be.an('object').and.have.property('id')
      res.body.should.have.property('author')
      res.body.should.have.property('created_at')
      res.body.should.have.property('title')
      res.body.should.have.property('content')
      res.body.should.have.property('link')
      res.body.should.have.property('og_title')
      res.body.should.have.property('og_description')
      res.body.should.have.property('og_image')
      res.body.should.have.property('active')
      res.body.should.have.property('updated_at')
      res.body.should.have.property('updated_by')
      res.body.should.have.property('liked')
      res.body.should.have.property('comment_amount')
      done()
    })
  })
})
