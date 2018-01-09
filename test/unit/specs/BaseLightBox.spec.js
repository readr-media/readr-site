import { mount } from 'avoriaz'
import BaseLightBox from 'src/components/BaseLightBox.vue'

describe('BaseLightBox.vue', () => {
  const wrapper = mount(BaseLightBox)
  it('BaseLightBox should be Vue Component', () => {
    expect(wrapper.isVueComponent).to.equal(true)
  })

  it('props should be correct', () => {
    expect(wrapper.propsData().borderStyle).to.equal('normal')
    expect(wrapper.propsData().isConversation).to.equal(false)
    expect(wrapper.propsData().hideCloseButton).to.equal(false)
    expect(wrapper.propsData().showLightBox).to.equal(false)
  })

  it('BaseLightBox should have class', () => {
    expect(wrapper.hasClass('baseLightBox')).to.equal(true)
  })

  it('BaseLightBox should be html section', () => {
    expect(wrapper.is('section')).to.equal(true)
  })
})
