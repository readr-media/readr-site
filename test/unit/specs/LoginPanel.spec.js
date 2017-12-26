import Login from 'src/components/login/Login.vue'
import LoginPanel from 'src/components/LoginPanel.vue'
import FacebookLogin from 'src/components/login/FacebookLogin.vue'
import GooglePlusLogin from 'src/components/login/GooglePlusLogin.vue'
import Register from 'src/components/register/Register.vue'
import Vue from 'vue'
import sinon from 'sinon'
import { WORDING_LOGIN, WORDING_REGISTER } from 'src/constants'
import { mount } from 'avoriaz'

describe('LoginPanel.vue', () => {
  sinon.stub(LoginPanel, 'beforeMount')
  const LoginPanelComponent = mount(LoginPanel)
  const blockLeft = LoginPanelComponent.find('.login-panel__left')[0]
  const blockRight = LoginPanelComponent.find('.login-panel__right')[0]
  const mockRouterLink = {
    name: 'router-link',
    render: h => h('div')
  }
  Vue.component('router-link', mockRouterLink)
  it('should display two blocks: left and right', () => {
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
    expect(spanLogin.text()).to.be.string(WORDING_LOGIN)
    expect(spanRegister.text()).to.be.string(WORDING_REGISTER)
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
  const LoginPanelComponentRegister = mount(LoginPanel, {
    data () {
      return {
        isLoginTabAcitve: false
      }
    }
  })
  const blockLeftRegister = LoginPanelComponentRegister.find('.login-panel__left')[0]
  const blockRightRegister = LoginPanelComponentRegister.find('.login-panel__right')[0]
  it('left div.container should contain component Register', () => {
    const containerLeft = blockLeftRegister.find('.container')[0]
    expect(containerLeft.contains(Register)).to.equal(true)
  })
  it('right div.container should contain component FacebookLogin && GooglePlusLogin', () => {
    expect(blockRightRegister.contains(FacebookLogin)).to.equal(true)
    expect(blockRightRegister.contains(GooglePlusLogin)).to.equal(true)
  })
})
