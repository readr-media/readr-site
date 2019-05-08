import _ from 'lodash'
import About from 'src/components/member/About.vue'
import BaseLightBox from 'src/components/BaseLightBox.vue'
import BaseLightBoxProfileEdit from 'src/components/BaseLightBoxProfileEdit.vue'
import { ROLE_MAP } from 'src/constants'
import { mount } from 'avoriaz'

describe('About.vue', () => {
  const AboutComponent = mount(About)
  const thumbnail = AboutComponent.find('.about__thumbnail')[0]
  const name = AboutComponent.find('.about__name')[0]
  const introduction = AboutComponent.find('.about__introduction')[0]
  it('component About should has class=about', () => {
    expect(AboutComponent.hasClass('about')).to.equal(true)
  })
  it('component About should contain thumbnail, name and introduction blocks', () => {
    expect(thumbnail).to.not.be.undefined
    expect(name).to.not.be.undefined
    expect(introduction).to.not.be.undefined
  })
  it('block name should render correct name and introduction', () => {
    const profile = {
      nickname: 'Justin BB',
      description: '先速不生間發，處水是車內可紅，這在心相日價得推會當術重而而地後，把人司小一活整資為，家身無就好空人算請著營種的變車商突：臉我安以可吃結出而技冷水新戰口都紀！通快低死事媽兩建子那與的畫語了係來站車外。',
      profileImage: 'https://dev.readr.tw/assets/images/justinbb.png',
      role: 1
    }
    const AboutWithProfile = mount(About)
    AboutWithProfile.setProps({
      profile
    })
    const nameWithProfile = AboutWithProfile.find('.about__name > .name')[0]
    const roleWithProfile = AboutWithProfile.find('.about__name > .role')[0]
    const introductionWithProfile = AboutWithProfile.find('.about__introduction')[0]
    const imageWithProfile = AboutWithProfile.find('.about__thumbnail > img')[0]
    expect(nameWithProfile.text()).to.be.string(profile.nickname)
    expect(roleWithProfile.text()).to.be.string(_.get(_.filter(ROLE_MAP, { key: profile.role }), [ 0, 'value' ]))
    expect(introductionWithProfile.text()).to.be.string(profile.description)
    expect(imageWithProfile.getAttribute('src')).to.be.string(profile.profileImage)
  })
  it('should provide default profile image url, if user don\'t have their own profile image', () => {
    const profile = {
      nickname: 'Mr. NoProfileImage',
      description: '沒有大頭貼先生',
      profileImage: undefined,
      role: 1
    }
    const AboutWithProfile = mount(About)
    AboutWithProfile.setProps({
      profile
    })
    const imageWithProfile = AboutWithProfile.find('.about__thumbnail > img')[0]
    expect(imageWithProfile.getAttribute('src')).to.be.string('/public/icons/exclamation.png')
  })
  it('should set the showLightBox to true while the (edit) button has been clicked', () => {
    const editButton = AboutComponent.find('.about__edit__btn')[0]
    editButton.trigger('click')
    expect(AboutComponent.vm.showLightBox).to.equal(true)
  })
  it('lightbox should contain component profile editor', () => {
    const lightBoxes = AboutComponent.find(BaseLightBox)
    for (let i = 0; i < lightBoxes.length; i += 1) {
      expect(lightBoxes[ i ].contains(BaseLightBoxProfileEdit)).to.equal(true)
    }
  })
})
