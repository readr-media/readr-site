import { mount } from 'avoriaz'
import Editor from 'src/components/Editor.vue'

describe('Editor.vue', () => {
  const wrapper = mount(Editor)
  it('Editor should be Vue Component', () => {
    expect(wrapper.isVueComponent).to.equal(true)
  })

  it('data should be correct', () => {
    // expect(wrapper.data().content).to.equal('')
    expect(wrapper.data().showHtml).to.equal(false)
  })

  it('props should be correct', () => {
    expect(wrapper.propsData().contentEdit).to.equal('')
  })

  it('Editor should have class', () => {
    expect(wrapper.hasClass('editor')).to.equal(true)
  })

  it('Editor should be html section', () => {
    expect(wrapper.is('section')).to.equal(true)
  })
})
