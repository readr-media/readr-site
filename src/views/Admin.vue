<template>
  <div class="admin">
    <app-header :sections="sections"></app-header>
    <About :profile="profile"></About>
    <div class="control-bar">
      <TheBaseControlBar @manageAccount="manageMember" @addAccount="addMember"></TheBaseControlBar>
    </div>
    <MembersPanel @filterChanged="filterChanged"></MembersPanel>
    <BaseLightBox :showLightBox.sync="showLightBox" borderStyle="nonBorder" :isConversation="true">
      <MemberAccountEditor @updated="filterChanged" slot="postPanelEdit" :shouldShow="showLightBox" :title="wording.WORDING_ADMIN_MEMBER_EDITOR_ADD_MEMBER" action="add"></MemberAccountEditor>
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

  const MAXRESULT = 20
  const DEFAULT_PAGE = 1
  const DEFAULT_SORT = 'updated_at'

  const getMembers = (store, { page, sort }) => {
    return store.dispatch('GET_MEMBERS', {
      params: {
        max_result: MAXRESULT,
        page: page || DEFAULT_PAGE,
        sort: sort || DEFAULT_SORT
      }
    })
  }

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
        currPage: 1,
        currSort: 'updated_at',
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
      },
      filterChanged (filter = {}) {
        this.currPage = filter.page || this.currPage
        this.currSort = filter.sort || this.currSort
        getMembers(this.$store, {
          page: this.currPage,
          sort: this.currPage
        })
      },
      manageMember () {

      }
    },
    mounted () {},
    beforeMount () {
      Promise.all([
        getMembers(this.$store, {})
      ])
    }
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