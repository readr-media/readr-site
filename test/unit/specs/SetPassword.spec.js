import SetPassword from 'src/views/SetPassword.vue'
import AppHeader from 'src/components/header/AppHeader.vue'
import InitBasicProfile from 'src/components/register/InitBasicProfile.vue'
import { mount } from 'avoriaz'

describe('SetPassword.vue', () => {
  const SetPasswordComponent = mount(SetPassword)
  it('view SetPassword should has class="pwd-set"', () => {
    expect(SetPasswordComponent.hasClass('pwd-set')).to.equal(true)
  })
  it('view SetPassword should contain component Header', () => {
    expect(SetPasswordComponent.contains(AppHeader)).to.equal(true)
  })
  it('view SetPassword should contain component InitBasicProfile', () => {
    expect(SetPasswordComponent.contains(InitBasicProfile)).to.equal(true)
  })
})
