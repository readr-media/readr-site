import MemberAccountEditor from 'src/components/admin/MemberAccountEditor.vue'
import { mount } from 'avoriaz'

describe('MemberAccountEditor.vue', () => {
  const MemberAccountEditorComponent = mount(MemberAccountEditor)
  it('component MemberAccountEditor should have class=member-editor', () => {
    MemberAccountEditorComponent.setProps({
      shouldShow: true
    })
    expect(MemberAccountEditorComponent.hasClass('member-editor')).to.equal(true)
  })
  it('component MemberAccountEditor should contain a form, which has title, email and btns blocks', () => {
    MemberAccountEditorComponent.setProps({
      shouldShow: true,
      action: 'add'
    })
    const form = MemberAccountEditorComponent.find('.member-editor__form')[0]
    const email = form.find('.email')[0]
    const title = form.find('.title')[0]
    const role = form.find('.role')[0]
    const btnSave = form.find('.btn--save')[0]
    // const message = form.find('.message')[0]
    expect(form).to.not.be.undefined
    expect(email).to.not.be.undefined
    expect(title).to.not.be.undefined
    expect(btnSave).to.not.be.undefined
    // expect(message).to.not.be.undefined
    expect(role).to.not.be.undefined
  })
})
