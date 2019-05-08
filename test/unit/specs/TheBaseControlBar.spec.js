import { mount } from 'avoriaz'
import TheBaseControlBar from 'src/components/TheBaseControlBar.vue'

describe('TheBaseControlBar.vue', () => {
  const wrapper = mount(TheBaseControlBar)
  it('TheBaseControlBar should be Vue Component', () => {
    expect(wrapper.isVueComponent).to.equal(true)
  })

  it('data should be correct', () => {
    expect(wrapper.data().openBtnBox).to.equal(false)
  })

  it('TheBaseControlBar should have class', () => {
    expect(wrapper.hasClass('controlBar')).to.equal(true)
  })

  it('TheBaseControlBar should be html section', () => {
    expect(wrapper.is('section')).to.equal(true)
  })

  // it('TheBaseControlBar should have methods', () => {
  //   expect(typeof wrapper.methods().$_baseControlBar_addPost).to.equal('function')
  //   expect(typeof wrapper.methods().$_baseControlBar_addAccount).to.equal('function')
  //   expect(typeof wrapper.methods().$_baseControlBar_manageAccount).to.equal('function')
  //   expect(typeof wrapper.methods().$_baseControlBar_btnBoxToggle).to.equal('function')
  // })
})
