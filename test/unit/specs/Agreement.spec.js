import Agreement from 'src/views/Agreement.vue'
import Header from 'src/components/Header.vue'
// import sinon from 'sinon'
import { WORDING_AGREEMENT_TERMS_AND_SERVICE, WORDING_AGREEMENT_IPR, WORDING_AGREEMENT_PRIVACY } from 'src/constants'
import { mount } from 'avoriaz'

describe('Agreement.vue', () => {
  const AgreementComponent = mount(Agreement)
  const terms = AgreementComponent.find('.terms')[0]
  it('view Agreement should has class="agreement"', () => {
    expect(AgreementComponent.hasClass('agreement')).to.equal(true)
  })
  it('view Agreement should contain component Header', () => {
    expect(AgreementComponent.contains(Header)).to.equal(true)
  })
  it('view Agreement should contain terms block', () => {
    expect(terms).to.not.be.undefined
  })
  it('block terms should contain nav and content', () => {
    const nav = terms.find('.terms__nav')[0]
    const content = terms.find('.terms__content')[0]
    expect(nav).to.not.be.undefined
    expect(content).to.not.be.undefined
  })
  it('terms should render correct nav', () => {
    const termsItems = [
      { item: 'termsAndService', title: WORDING_AGREEMENT_TERMS_AND_SERVICE, content: '' },
      { item: 'IPR', title: WORDING_AGREEMENT_IPR, content: '' },
      { item: 'privacy', title: WORDING_AGREEMENT_PRIVACY, content: '' }
    ]
    AgreementComponent.setData({
      termsItems
    })
    const navigation = terms.find('.terms__nav')[0]
    const navItems = navigation.find('.terms__nav__item')
    expect(navItems.length).to.equal(3)
    navItems.map((item, i) => {
      expect(item.text()).to.be.string(termsItems[i].title)
    })
  })
  it('the variable activeItem should be update after any nav item being clicked', () => {
    // const clickHandler = sinon.stub()
    const termsItems = [
      { item: 'termsAndService', title: WORDING_AGREEMENT_TERMS_AND_SERVICE, content: '' },
      { item: 'IPR', title: WORDING_AGREEMENT_IPR, content: 'second tab' },
      { item: 'privacy', title: WORDING_AGREEMENT_PRIVACY, content: '' }
    ]
    AgreementComponent.setData({
      termsItems
    })
    const navigation = terms.find('.terms__nav')[0]
    const navSecondItem = navigation.find('.terms__nav__item')[1]
    navSecondItem.trigger('click')

    const content = terms.find('.terms__content')[0]

    expect(navSecondItem).to.not.be.undefined
    expect(navSecondItem.hasClass('active')).to.equal(true)
    expect(AgreementComponent.data().activeItem).to.equal(1)
    expect(content.text()).to.be.string(termsItems[1].content)
  })
})
