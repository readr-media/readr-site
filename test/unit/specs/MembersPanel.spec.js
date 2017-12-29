import MembersPanel from 'src/components/admin/MembersPanel.vue'
// import sinon from 'sinon'
import { WORDING_ADMIN_NICKNAME, WORDING_ADMIN_EMAIL, WORDING_ADMIN_ROLE } from 'src/constants'
import { ROLE_MAP } from 'src/constants'
import { mount } from 'avoriaz'

describe('MembersPanel.vue', () => {
  // sinon.stub(MembersPanel, 'beforeMount')
  const MembersPanelComponent = mount(MembersPanel)
  // const id = MembersPanelComponent.find('member-panel__id')
  // const email = MembersPanelComponent.find('member-panel__email')
  // const role = MembersPanelComponent.find('member-panel__role')
  // const actions = MembersPanelComponent.find('member-panel__actions')
  const memberItems = MembersPanelComponent.find('.member-panel__items')[0]
  it('component MembersPanel should have class=member-panel', () => {
    expect(MembersPanelComponent.hasClass('member-panel')).to.equal(true)
  })
  it('component MembersPanel should contain a list block', () => {
    expect(memberItems).to.not.be.undefined
  })

  const memberList = [
    { nickname: '1', mail: 'a', role: 1 },
    { nickname: '2', mail: 'b', role: 2 },
    { nickname: '3', mail: 'c', role: 3 },
    { nickname: '4', mail: 'd', role: 9 }
  ]
  const MembersPanelComponentWidthMemberList = mount(MembersPanel, {
    computed: {
      members () {
        return memberList
      }
    }
  })
  const memberItemsWidthMemberList = MembersPanelComponentWidthMemberList.find('.member-panel__items > .member-panel__items__item')
  it('component MembersPanel should render correct member list', () => {
    expect(memberItemsWidthMemberList.length).to.equal(5)
    memberItemsWidthMemberList.map((m, i) => {
      const nickname = m.find('.nickname')[0]
      const email = m.find('.email')[0]
      const role = m.find('.role')[0]
      if (i !== 0) {
        expect(nickname.text()).to.be.string(memberList[i - 1].nickname)
        expect(email.text()).to.be.string(memberList[i - 1].mail)
        expect(role.text()).to.be.string(ROLE_MAP[ memberList[i - 1].role ])
      } else {
        expect(nickname.text()).to.be.string(WORDING_ADMIN_NICKNAME)
        expect(email.text()).to.be.string(WORDING_ADMIN_EMAIL)
        expect(role.text()).to.be.string(WORDING_ADMIN_ROLE)
      }
    })
  })
})
