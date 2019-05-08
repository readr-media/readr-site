import chai from 'chai'
import { fetchUser } from 'src/api'

chai.should()
describe('Api: fetchUser', () => {
  it('should get user info from api', () => {
    // arrange
    const expected = {
      id: '',
      email: ''
    }

    // act
    const actual = fetchUser()

    // assert
    actual.should.to.deep.equal(expected)
  })
})
