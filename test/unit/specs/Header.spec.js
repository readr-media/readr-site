import AppHeader from 'src/components/header/AppHeader.vue'
// import Vue from 'vue'
import { WORDING_HEADER_LOGIN, WORDING_HEADER_LOGOUT, WORIDNG_HEADER_MEMBER_CENTRE } from 'src/constants'
import { mount } from 'avoriaz'

describe('AppHeader.vue', () => {
  const HeaderComponent = mount(AppHeader, {
    data () {
      return {
        isClientSide: true
      }
    }
  })
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
  it('navigation should contains sections link', () => {
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
  it('if user dose not log in yet, should show login btn', () => {
    // arrange
    // act
    const HeaderComponentForLogin = mount(AppHeader, {
      computed: {
        isLoggedIn: () => {
          return false
        }
      },
      data () {
        return {
          isClientSide: true
        }
      }
    })
    const loginBtn = HeaderComponentForLogin.find('.login-status__login-btn')[0]
    const logoutBtn = HeaderComponentForLogin.find('.login-status__logout-btn')[0]
    const nickname = HeaderComponentForLogin.find('.login-status__nickname')[0]
    // assert
    expect(loginBtn).to.not.be.undefined
    expect(loginBtn.text()).to.be.string(WORDING_HEADER_LOGIN)
    expect(loginBtn.getAttribute('href')).to.be.string('/login')
    expect(logoutBtn).to.be.undefined
    expect(nickname).to.be.undefined
  })
  it('if user has logged in, should show user nickname', () => {
    const nicknameText = 'test'
    const HeaderComponentForLogout = mount(AppHeader, {
      computed: {
        isLoggedIn: () => {
          return true
        },
        userNickname: () => {
          return nicknameText
        }
      },
      data () {
        return {
          isClientSide: true
        }
      }
    })
    const loginBtn = HeaderComponentForLogout.find('.login-status__login-btn')[0]
    const logoutBtn = HeaderComponentForLogout.find('.login-status__logout-btn')[0]
    const nickname = HeaderComponentForLogout.find('.login-status__nickname')[0]
    expect(loginBtn).to.be.undefined
    expect(logoutBtn).to.not.be.undefined
    expect(logoutBtn.text()).to.be.string(WORDING_HEADER_LOGOUT)
    expect(nickname).to.not.be.undefined
    expect(nickname.text()).to.be.string(nicknameText)
  })
  it('if user has logged in, should show user nickname should be rendered by cases', () => {
    const basicSet = {
      data () {
        return {
          isClientSide: true
        }
      }
    }
    const nicknameText = 'GotNickname'
    const HeaderComponentForNicknameExisting = mount(AppHeader, Object.assign({}, basicSet, {
      computed: {
        isLoggedIn: () => (true),
        currentUser: () => {
          return {
            nickname: nicknameText
          }
        }
      }
    }))
    let nickname = HeaderComponentForNicknameExisting.find('.login-status__nickname')[0]
    expect(nickname.text()).to.be.string(nicknameText)

    const nameText = 'GotName'
    const HeaderComponentForNicknameNoneButNameExisting = mount(AppHeader, Object.assign({}, basicSet, {
      computed: {
        isLoggedIn: () => (true),
        currentUser: () => {
          return {
            name: nameText
          }
        }
      }
    }))
    nickname = HeaderComponentForNicknameNoneButNameExisting.find('.login-status__nickname')[0]
    expect(nickname.text()).to.be.string(nameText)

    const HeaderComponentForNicknameAndNameNone = mount(AppHeader, Object.assign({}, basicSet, {
      computed: {
        isLoggedIn: () => (true),
        currentUser: () => {
          return {}
        }
      }
    }))
    nickname = HeaderComponentForNicknameAndNameNone.find('.login-status__nickname')[0]
    expect(nickname.text()).to.be.string(WORIDNG_HEADER_MEMBER_CENTRE)
  })
})
