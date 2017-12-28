<template>
  <div class="admin">
    <app-header :section="section"></app-header>
    <About :profile="profile"></About>
    <div class="management-items">
      <div style="width: 200px; height: 50px; margin: 0 auto;" @click="addMember">add</div>
    </div>
    <MembersPanel></MembersPanel>
    <MemberAccountEditor :shouldShow="shouldShow" @close="closeEditor" :title="wording.WORDING_ADMIN_MEMBER_EDITOR_ADD_MEMBER" action="add"></MemberAccountEditor>
  </div>
</template>
<script>
  import _ from 'lodash'
  import { WORDING_ADMIN_MEMBER_EDITOR_ADD_MEMBER } from '../constants'
  import About from '../components/About.vue'
  import Header from '../components/Header.vue'
  import MembersPanel from '../components/admin/MembersPanel.vue'
  import MemberAccountEditor from '../components/admin/MemberAccountEditor.vue'

  const SECTIONS_DEFAULT = {
    'chief-editor-talk': '總編評論',
    'celebrity-talk': '名人聊新聞',
    'hot-talk': '熱門評論',
    'chief-editor-list': '總編列表',
    'projects': '新聞專題'
  }

  export default {
    components: {
      'app-header': Header,
      About,
      MembersPanel,
      MemberAccountEditor
    },
    computed: {
      profile () {
        return _.get(this.$store, [ 'state', 'profile' ], {})
      },
      section () {
        return SECTIONS_DEFAULT
      }
    },
    data () {
      return {
        shouldShow: false,
        wording: {
          WORDING_ADMIN_MEMBER_EDITOR_ADD_MEMBER
        }
      }
    },
    name: 'admin-page',
    methods: {
      addMember () {
        this.shouldShow = true
      },
      closeEditor () {
        this.shouldShow = false
      }
    },
    mounted () {}
  }
</script>
<style lang="stylus" scoped>
  .admin
    width 100%
</style>