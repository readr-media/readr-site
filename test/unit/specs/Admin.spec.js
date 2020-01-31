import About from 'src/components/member/About.vue'
import Admin from 'src/views/Admin.vue'
import BaseLightBox from 'src/components/BaseLightBox.vue'
import AppHeader from 'src/components/header/AppHeader.vue'
import MembersPanel from 'src/components/admin/MembersPanel.vue'
// import MemberAccountEditor from 'src/components/admin/MemberAccountEditor.vue'
import TheBaseControlBar from 'src/components/TheBaseControlBar.vue'
import Vue from 'vue'
import sinon from 'sinon'
import { mount } from 'avoriaz'

describe('Admin.vue', () => {
  sinon.stub(Admin, 'beforeMount')
  sinon.stub(AppHeader, 'beforeMount')
  // mock $can
  Vue.use((Vue) => {
    Vue.prototype.$can = () => (true)
  })
  const viewAdminComponent = mount(Admin)
  it('view admin should have class=admin', () => {
    expect(viewAdminComponent.hasClass('admin')).to.equal(true)
  })
  it('view admin should contain component Header', () => {
    expect(viewAdminComponent.contains(AppHeader)).to.equal(true)
  })
  it('view admin should contain component about', () => {
    expect(viewAdminComponent.contains(About)).to.equal(true)
  })
  it('view admin should contain management block', () => {
    expect(viewAdminComponent.contains(TheBaseControlBar)).to.equal(true)
  })
  it('there\'s an add member btn, after clicking it, the var showLightBox would be true', () => {
    const addMemberBtn = viewAdminComponent.find('.controlBar--btn').filter((btn) => {
      return btn.text() === '新增帳號'
    })[ 0 ]
    expect(addMemberBtn).to.not.be.undefind

    addMemberBtn.trigger('click')
    expect(viewAdminComponent.vm.showLightBox).to.equal(true)
  })
  it('view admin should contain a lighbox which is used to contain the mamber editor', () => {
    expect(viewAdminComponent.contains(BaseLightBox)).to.equal(true)
  })
  // it('lightbox should contain component member editor', () => {
  //   const lightBoxes = viewAdminComponent.first(BaseLightBox)
  //   for (let i = 0; i < lightBoxes.length; i += 1) {
  //     expect(lightBoxes[ i ].contains(MemberAccountEditor)).to.equal(true)
  //   }
  // })
  it('view admin should contain component membersPanel', () => {
    expect(viewAdminComponent.contains(MembersPanel)).to.equal(true)
  })
})
