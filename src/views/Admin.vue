<template>
  <div class="admin">
    <app-header :sections="sections"></app-header>
    <About :profile="profile"></About>
    <div class="control-bar">
      <TheBaseControlBar></TheBaseControlBar>
    </div>
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
  import { SECTIONS_DEFAULT } from '../constants'
  import About from '../components/About.vue'
  import Header from '../components/Header.vue'
  import MembersPanel from '../components/admin/MembersPanel.vue'
  import MemberAccountEditor from '../components/admin/MemberAccountEditor.vue'
  import TheBaseControlBar from '../components/TheBaseControlBar.vue'

  export default {
    components: {
      'app-header': Header,
      About,
      MembersPanel,
      MemberAccountEditor,
      TheBaseControlBar
    },
    computed: {
      profile () {
        return _.get(this.$store, [ 'state', 'profile' ], {})
      },
      sections () {
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
    .control-bar
      width 100%
      margin 0 auto
  @media (min-width 950px)
    .admin
      .control-bar
        max-width 950px
</style>