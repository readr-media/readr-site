import About from 'src/components/About.vue'
import Admin from 'src/views/Admin.vue'
import Header from 'src/components/Header.vue'
import MembersPanel from 'src/components/admin/MembersPanel.vue'
import sinon from 'sinon'
import { mount } from 'avoriaz'

describe('Admin.vue', () => {
  sinon.stub(MembersPanel, 'beforeMount')
  const viewAdminComponent = mount(Admin)
  it('view admin should have class=admin', () => {
    expect(viewAdminComponent.hasClass('admin')).to.equal(true)
  })
  it('view admin should contain component Header', () => {
    expect(viewAdminComponent.contains(Header)).to.equal(true)
  })
  it('view admin should contain component about', () => {
    expect(viewAdminComponent.contains(About)).to.equal(true)
  })
  it('view admin should contain management block', () => {
    const management = viewAdminComponent.find('.management-items')[0]
    expect(management).to.not.be.undefined
  })
  it('view admin should contain component membersPanel', () => {
    expect(viewAdminComponent.contains(MembersPanel)).to.equal(true)
  })
})
