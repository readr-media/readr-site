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
    <BaseLightBox :showLightBox.sync="showLightBox" borderStyle="nonBorder" :hideCloseButton="true">
      <MemberAccountEditor slot="postPanelEdit" :shouldShow="showLightBox" :title="wording.WORDING_ADMIN_MEMBER_EDITOR_ADD_MEMBER" action="add"></MemberAccountEditor>
    </BaseLightBox>
  </div>
</template>
<script>
  import _ from 'lodash'
  import { WORDING_ADMIN_MEMBER_EDITOR_ADD_MEMBER } from '../constants'
  import { SECTIONS_DEFAULT } from '../constants'
  import About from '../components/About.vue'
  import BaseLightBox from '../components/BaseLightBox.vue'
  import Header from '../components/Header.vue'
  import MembersPanel from '../components/admin/MembersPanel.vue'
  import MemberAccountEditor from '../components/admin/MemberAccountEditor.vue'
  import TheBaseControlBar from '../components/TheBaseControlBar.vue'

  export default {
    components: {
      'app-header': Header,
      About,
      BaseLightBox,
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
        showLightBox: false,
        wording: {
          WORDING_ADMIN_MEMBER_EDITOR_ADD_MEMBER
        }
      }
    },
    name: 'admin-page',
    methods: {
      addMember () {
        this.showLightBox = true
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