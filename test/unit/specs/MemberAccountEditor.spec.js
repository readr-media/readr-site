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
})
