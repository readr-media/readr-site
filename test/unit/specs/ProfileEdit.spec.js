import ProfileEdit from 'src/components/ProfileEdit.vue'
import Vue from 'vue'
import Vuex from 'vuex'
import { mount } from 'avoriaz'
import sinon from 'sinon'

Vue.use(Vuex)

describe('ProfileEdit.vue', () => {
  let actions
  let store
  beforeEach(() => {
    actions = {
      UPDATE_PROFILE: sinon.stub(),
      CHECK_PASSWORD: sinon.stub(),
      UPDATE_PASSWORD: sinon.stub()
    }
    store = new Vuex.Store({
      state: {},
      actions
    })
  })

  it('nickname, description and protrait thumbnail should equal to value in props', () => {
    const ProfileEditComponent = mount(ProfileEdit)
    const profile = {
      nickname: 'Justin BB',
      mail: 'justinbb@justinbb.com',
      description: '先速不生間發，處水是車內可紅，這在心相日價得推會當術重而而地後，把人司小一活整資為，家身無就好空人算請著營種的變車商突：臉我安以可吃結出而技冷水新戰口都紀！通快低死事媽兩建子那與的畫語了係來站車外。',
      profileImage: 'https://dev.readr.tw/assets/images/justinbb.png'
    }
    ProfileEditComponent.setProps({
      profile
    })
    const inputNickname = ProfileEditComponent.find('input[name=nickname]')[0]
    const inputDescription = ProfileEditComponent.find('textarea[name=description]')[0]
    const thumbnail = ProfileEditComponent.find('img[alt=thumbnail]')[0]

    expect(inputNickname.value()).to.equal(profile.nickname)
    expect(inputDescription.value()).to.equal(profile.description)
    expect(thumbnail.getAttribute('src')).to.equal(profile.profileImage)
  })

  it('should dispatch action when user is update their nickname, description', () => {
    const ProfileEditComponent = mount(ProfileEdit, { store })
    const profile = {
      nickname: 'Justin BB',
      mail: 'justinbb@justinbb.com',
      description: '先速不生間發，處水是車內可紅，這在心相日價得推會當術重而而地後，把人司小一活整資為，家身無就好空人算請著營種的變車商突：臉我安以可吃結出而技冷水新戰口都紀！通快低死事媽兩建子那與的畫語了係來站車外。',
      profileImage: 'https://dev.readr.tw/assets/images/justinbb.png'
    }
    ProfileEditComponent.setProps({
      profile
    })
    // const inputNickname = ProfileEditComponent.find('input[name=nickname]')[0]
    const save = ProfileEditComponent.find('.save-button')[0]

    ProfileEditComponent.vm.inputNickname = 'Justin BB Modified'
    save.trigger('click')
    expect(actions.UPDATE_PROFILE.calledOnce).to.equal(true)
  })

  it('should not dispatch action when save button has been clicked but user\'s nickname, description is remaining the same as initial', () => {
    const ProfileEditComponent = mount(ProfileEdit, { store })
    const profile = {
      nickname: 'Justin BB',
      mail: 'justinbb@justinbb.com',
      description: '先速不生間發，處水是車內可紅，這在心相日價得推會當術重而而地後，把人司小一活整資為，家身無就好空人算請著營種的變車商突：臉我安以可吃結出而技冷水新戰口都紀！通快低死事媽兩建子那與的畫語了係來站車外。',
      profileImage: 'https://dev.readr.tw/assets/images/justinbb.png'
    }
    ProfileEditComponent.setProps({
      profile
    })
    const save = ProfileEditComponent.find('.save-button')[0]

    ProfileEditComponent.vm.inputNickname = profile.nickname
    ProfileEditComponent.vm.inputDescription = profile.description
    save.trigger('click')
    expect(actions.UPDATE_PROFILE.calledOnce).to.equal(false)
  })

  it('should not update user\'s password if old password input is empty, but new/confirm password input is not', () => {
    const ProfileEditComponent = mount(ProfileEdit, { store })
    const save = ProfileEditComponent.find('.save-button')[0]

    ProfileEditComponent.vm.inputOldPassword = ''
    ProfileEditComponent.vm.inputNewPassword = 'this_is_a_test_password123456'
    ProfileEditComponent.vm.inputConfirmPassword = 'this_is_a_test_password123456'
    save.trigger('click')
    expect(actions.UPDATE_PASSWORD.calledOnce).to.equal(false)
  })

  it('should not update user\'s password if new/confirm password inputs both are empty, but old password input is not', () => {
    const ProfileEditComponent = mount(ProfileEdit, { store })
    const save = ProfileEditComponent.find('.save-button')[0]

    ProfileEditComponent.vm.inputOldPassword = 'this_is_a_old_password123456'
    ProfileEditComponent.vm.inputNewPassword = ''
    ProfileEditComponent.vm.inputConfirmPassword = ''
    save.trigger('click')
    expect(actions.UPDATE_PASSWORD.calledOnce).to.equal(false)
  })

  // it('should update user\'s password if password inputs both are not empty, and equal to each other, moreover, clear the password inputs value after password has been updated', () => {
  //   const ProfileEditComponent = mount(ProfileEdit, { store })
  //   const profile = {
  //     id: 'wonderwomen@wonderwomen.com'
  //   }
  //   ProfileEditComponent.setProps({
  //     profile
  //   })
  //   const save = ProfileEditComponent.find('.save-button')[0]

  //   ProfileEditComponent.vm.inputOldPassword = 'wonderwomen@wonderwomen.com'
  //   ProfileEditComponent.vm.inputNewPassword = 'this_is_a_test_password123456'
  //   ProfileEditComponent.vm.inputConfirmPassword = 'this_is_a_test_password123456'
  //   save.trigger('click')
  //   expect(actions.UPDATE_PASSWORD.calledOnce).to.equal(true)
  //   expect(ProfileEditComponent.vm.inputNewPassword).to.be.empty
  //   expect(ProfileEditComponent.vm.inputConfirmPassword).to.be.empty
  // })
})
