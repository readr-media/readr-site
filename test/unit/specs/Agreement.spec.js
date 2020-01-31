import Agreement from 'src/views/Agreement.vue'
import AppHeader from 'src/components/header/AppHeader.vue'
import Tab from 'src/components/Tab.vue'
// import sinon from 'sinon'
import { mount } from 'avoriaz'

describe('Agreement.vue', () => {
  const AgreementComponent = mount(Agreement)
  const terms = AgreementComponent.find('.terms')[0]
  it('view Agreement should has class="agreement"', () => {
    expect(AgreementComponent.hasClass('agreement')).to.equal(true)
  })
  it('view Agreement should contain component Header', () => {
    expect(AgreementComponent.contains(AppHeader)).to.equal(true)
  })
  it('view Agreement should contain terms block', () => {
    expect(terms).to.not.be.undefined
  })
  it('block terms should contain component Tab', () => {
    expect(terms.contains(Tab)).to.equal(true)
  })
})
