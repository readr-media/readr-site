import Header from 'src/components/Header.vue'
import Vue from 'vue'
import { mount } from 'avoriaz'

describe('Header.vue', () => {
  const HeaderComponent = mount(Header)
  const headerTop = HeaderComponent.find('.header__top')[0]
  const headerBtm = HeaderComponent.find('.header__bottom')[0]
  const logo = headerTop.find('.header__top__wrapper > .logo')[0]
  const shareBar = headerTop.find('.header__top__wrapper > .sharebar')[0]
  const nav = headerBtm.find('.header__bottom__wrapper > .nav')[0]
  const loginStatus = headerBtm.find('.header__bottom__wrapper > .login-status')[0]
  it('should contains logo, navigation, share-bar and login(logout) btn', () => {
    // assert
    expect(HeaderComponent.hasClass('header')).to.equal(true)
    expect(headerTop.hasClass('header__top')).to.equal(true)
    expect(headerBtm.hasClass('header__bottom')).to.equal(true)
    expect(logo).to.not.be.undefined
    expect(shareBar).to.not.be.undefined
    expect(nav).to.not.be.undefined
    expect(loginStatus).to.not.be.undefined
  })
  it('sharebar should contains four btns: search, facebook, github and about', () => {
    // arrange
    const search = shareBar.find('.sharebar__search')[0]
    const facebook = shareBar.find('.sharebar__fb-page')[0]
    const github = shareBar.find('.sharebar__github')[0]
    const about = shareBar.find('.sharebar__about')[0]
    
    // assert
    expect(search).to.not.be.undefined
    expect(facebook).to.not.be.undefined
    expect(github).to.not.be.undefined
    expect(about).to.not.be.undefined
  })
  it('sharebar should contains sections link', () => {
    // arrange
    const sections = {
      'chief-editor-talk': '總編評論',
      'celebrity-talk': '名人聊新聞',
      'hot-talk': '熱門評論',
      'chief-editor-list': '總編列表',
      'projects': '新聞專題'
    }

    // act
    // HeaderComponent.vm.sections = sections
    // HeaderComponent.update()
    HeaderComponent.setProps({
      sections
    })
    // const navChildren = nav.find('a')
    // console.log(navChildren)
    // console.log(nav.html())
    
    // assert
    expect(nav.contains('.nav__item.chief-editor-talk')).to.equal(true)
    expect(nav.contains('.nav__item.celebrity-talk')).to.equal(true)
    expect(nav.contains('.nav__item.hot-talk')).to.equal(true)
    expect(nav.contains('.nav__item.chief-editor-list')).to.equal(true)
    expect(nav.contains('.nav__item.projects')).to.equal(true)
  })
})