import Tab from 'src/components/Tab.vue'
import { mount } from 'avoriaz'

describe('Tab.vue', () => {
  const TabComp = mount(Tab)
  it('compnent Tab shoud have class=tab', () => {
    expect(TabComp.hasClass('tab')).to.equal(true)
  })
  it('compnent Tab should contain nav and content blocks', () => {
    const nav = TabComp.find('.tab__nav')[0]
    const content = TabComp.find('.tab__content')[0]
    expect(nav).to.not.be.undefined
    expect(content).to.not.be.undefined
  })
})
