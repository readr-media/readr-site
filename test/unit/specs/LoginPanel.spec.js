import Login from 'src/components/login/Login.vue'
import LoginPanel from 'src/components/LoginPanel.vue'
import FacebookLogin from 'src/components/login/FacebookLogin.vue'
import GooglePlusLogin from 'src/components/login/GooglePlusLogin.vue'
import Register from 'src/components/register/Register.vue'
import Vue from 'vue'
import sinon from 'sinon'
import { get } from 'lodash'
import { mount } from 'avoriaz'

import VueI18n from 'vue-i18n'
import ZHTW from 'src/locale/zh-TW'
Vue.use(VueI18n)

describe('LoginPanel.vue', () => {
  let i18n
  beforeEach(() => {
    const messages = {
      'zh-TW': ZHTW
    }
    i18n = new VueI18n({
      locale: 'zh-TW', // set locale
      messages // set locale messages
    })
  })

  let LoginPanelComponent
  let blockLeft
  let blockRight

  const mockRouterLink = {
    name: 'router-link',
    render: h => h('div')
  }
  Vue.component('router-link', mockRouterLink)
  sinon.stub(LoginPanel, 'beforeMount')

  it('should display two blocks: left and right', () => {
    LoginPanelComponent = mount(LoginPanel, { i18n })
    blockLeft = LoginPanelComponent.find('.login-panel__left')[0]
    blockRight = LoginPanelComponent.find('.login-panel__right')[0]

    expect(blockLeft).to.not.be.undefined
    expect(blockRight).to.not.be.undefined
  })
  it('blocks left and right should contain div.title and div.container', () => {
    const titleLeft = blockLeft.find('.title')[0]
    const containerLeft = blockLeft.find('.container')[0]
    const titleRight = blockRight.find('.title')[0]
    const containerRitght = blockRight.find('.container')[0]
    expect(titleLeft).to.not.be.undefined
    expect(containerLeft).to.not.be.undefined
    expect(titleRight).to.not.be.undefined
    expect(containerRitght).to.not.be.undefined
  })
  it('left div.title should contain span.login and span.register', () => {
    const spanLogin = blockLeft.find('.title > .login')[0]
    const spanRegister = blockLeft.find('.title > .register')[0]
    expect(spanLogin.text()).to.be.string(get(ZHTW, 'login.WORDING_LOGIN'))
    expect(spanRegister.text()).to.be.string(get(ZHTW, 'login.WORDING_REGISTER'))
  })
  it('left div.container should contain compnent Login', () => {
    const containerLeft = blockLeft.find('.container')[0]
    expect(containerLeft.contains(Login)).to.equal(true)
  })
  it('right div.container should contain component FacebookLogin and GooglePlusLogin', () => {
    const containerRitght = blockRight.find('.container')[0]
    expect(containerRitght.contains(FacebookLogin)).to.equal(true)
    expect(containerRitght.contains(GooglePlusLogin)).to.equal(true)
  })
  let LoginPanelComponentRegister
  let blockLeftRegister
  let blockRightRegister
  it('left div.container should contain component Register', () => {
    LoginPanelComponentRegister = mount(LoginPanel, {
      i18n,
      data () {
        return {
          isLoginTabAcitve: false
        }
      }
    })
    blockLeftRegister = LoginPanelComponentRegister.find('.login-panel__left')[0]
    blockRightRegister = LoginPanelComponentRegister.find('.login-panel__right')[0]
    const containerLeft = blockLeftRegister.find('.container')[0]
    expect(containerLeft.contains(Register)).to.equal(true)
  })
  it('right div.container should contain component FacebookLogin && GooglePlusLogin', () => {
    expect(blockRightRegister.contains(FacebookLogin)).to.equal(true)
    expect(blockRightRegister.contains(GooglePlusLogin)).to.equal(true)
  })
})
