import { mount, } from 'avoriaz'
import PostList from 'src/components/PostList.vue'

describe('PostList.vue', () => {
  const wrapper = mount(PostList)
  it('PostList should be Vue Component', () => {
    expect(wrapper.isVueComponent).to.equal(true)
  })

  it('PostList should have class', () => {
    expect(wrapper.hasClass('postList')).to.equal(true)
  })

  it('PostList should be html section', () => {
    expect(wrapper.is('table')).to.equal(true)
  })
})
