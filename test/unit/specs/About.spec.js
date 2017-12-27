import About from 'src/components/About.vue'
// import sinon from 'sinon'
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
      name: 'Justin BB',
      role: 'admin',
      description: '先速不生間發，處水是車內可紅，這在心相日價得推會當術重而而地後，把人司小一活整資為，家身無就好空人算請著營種的變車商突：臉我安以可吃結出而技冷水新戰口都紀！通快低死事媽兩建子那與的畫語了係來站車外。',
      image: {
        url: '/public/icons/exclamation.png'
      }
    }
    const AboutWithProfile = mount(About)
    AboutWithProfile.setProps({
      profile
    })
    const nameWithProfile = AboutWithProfile.find('.about__name > .name')[0]
    const roleWithProfile = AboutWithProfile.find('.about__name > .role')[0]
    const introductionWithProfile = AboutWithProfile.find('.about__introduction')[0]
    const imageWithProfile = AboutWithProfile.find('.about__thumbnail > img')[0]
    expect(nameWithProfile.text()).to.be.string(profile.name)
    expect(roleWithProfile.text()).to.be.string(profile.role)
    expect(introductionWithProfile.text()).to.be.string(profile.description)
    expect(imageWithProfile.getAttribute('src')).to.be.string(profile.image.url)
  })
})
