import MembersPanel from 'src/components/admin/MembersPanel.vue'
import PaginationNav from 'src/components/PaginationNav.vue'
import _ from 'lodash'
import { WORDING_ADMIN_NICKNAME, WORDING_ADMIN_EMAIL, WORDING_ADMIN_ROLE, ROLE_MAP } from 'src/constants'

import { mount } from 'avoriaz'

describe('MembersPanel.vue', () => {
  const MembersPanelComponent = mount(MembersPanel)
  const memberItems = MembersPanelComponent.find('.member-panel__items')[0]
  it('component MembersPanel should have class=member-panel', () => {
    expect(MembersPanelComponent.hasClass('member-panel')).to.equal(true)
  })
  it('component MembersPanel should contain a list block', () => {
    expect(memberItems).to.not.be.undefined
  })
  it('pagination should exist', () => {
    const pagination = MembersPanelComponent.find('.member-panel__pagination')[0]
    expect(pagination).to.not.be.undefined
    expect(pagination.contains(PaginationNav)).to.equal(true)
  })
  it('component MembersPanel should contain a title bar', () => {
    const titleBar = memberItems.find('.member-panel__items__item')[0]
    const checkbox = titleBar.find('.checkbox')[0]
    const nickname = titleBar.find('.nickname')[0]
    const email = titleBar.find('.email')[0]
    const role = titleBar.find('.role')[0]
    const actions = titleBar.find('.actions')[0]
    const filter = titleBar.find('.filter')[0]
    expect(titleBar).to.not.be.undefined
    expect(checkbox).to.not.be.undefined
    expect(nickname).to.not.be.undefined
    expect(email).to.not.be.undefined
    expect(role).to.not.be.undefined
    expect(actions).to.not.be.undefined
    expect(filter).to.not.be.undefined
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
        expect(role.text()).to.be.string(_.get(_.filter(ROLE_MAP, { key: memberList[i - 1].role }), [ 0, 'value' ]))
      } else {
        expect(nickname.text()).to.be.string(WORDING_ADMIN_NICKNAME)
        expect(email.text()).to.be.string(WORDING_ADMIN_EMAIL)
        expect(role.text()).to.be.string(WORDING_ADMIN_ROLE)
      }
    })
  })
  it('click update or del btn on each member data would call up member editor', () => {
    memberItemsWidthMemberList.map((m, i) => {
      if (i > 0) {
        const updateBtn = m.first('.actions__update')
        const deleteBtn = m.first('.actions__delete')
        updateBtn.trigger('click')
        expect(MembersPanelComponentWidthMemberList.vm.showLightBox).to.equal(true)
        MembersPanelComponentWidthMemberList.setData({
          showLightBox: false
        })
        deleteBtn.trigger('click')
        expect(MembersPanelComponentWidthMemberList.vm.showLightBox).to.equal(true)
        MembersPanelComponentWidthMemberList.setData({
          showLightBox: false
        })
      }
    })
  })
})
