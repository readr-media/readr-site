<template>
  <div class="admin">
    <app-header :sections="sections"></app-header>
    <About :profile="profile"></About>
    <div class="control-bar">
      <TheBaseControlBar @openPanel="openPanel" @addAccount="addMember"></TheBaseControlBar>
    </div>
    <template v-if="activePanel === 'accounts'">
      <MembersPanel v-if="$can('memberManage')" @filterChanged="filterChanged"></MembersPanel>
    </template>
    <template v-else-if="activePanel === 'posts'">
      <section class="panel">
        <post-list :posts="posts"></post-list>
      </section>
    </template>
    <BaseLightBox :showLightBox.sync="showLightBox" borderStyle="nonBorder" :isConversation="true">
      <MemberAccountEditor @updated="filterChanged" :shouldShow="showLightBox" :title="wording.WORDING_ADMIN_MEMBER_EDITOR_ADD_MEMBER" action="add"></MemberAccountEditor>
    </BaseLightBox>
  </div>
</template>
<script>
  import _ from 'lodash'
  import { WORDING_ADMIN_MEMBER_EDITOR_ADD_MEMBER } from '../constants'
  import { SECTIONS_DEFAULT } from '../constants'
  import About from '../components/About.vue'
  import BaseLightBox from '../components/BaseLightBox.vue'
  import AppHeader from '../components/AppHeader.vue'
  import MembersPanel from '../components/admin/MembersPanel.vue'
  import MemberAccountEditor from '../components/admin/MemberAccountEditor.vue'
  import PostList from '../components/PostList.vue'
  import TheBaseControlBar from '../components/TheBaseControlBar.vue'

  const MAXRESULT = 20
  const DEFAULT_PAGE = 1
  const DEFAULT_SORT = '-updated_at'

  const fetchPosts = (store, id) => {
    return store.dispatch('GET_POSTS', {
      params: {
        where: {
          author: id
        }
      }
    })
  }

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
      'app-header': AppHeader,
      'post-list': PostList,
      About,
      BaseLightBox,
      MembersPanel,
      MemberAccountEditor,
      TheBaseControlBar
    },
    computed: {
      posts () {
        return _.get(this.$store, [ 'state', 'posts', 'items' ], [])
      },
      profile () {
        return _.get(this.$store, [ 'state', 'profile' ], {})
      },
      sections () {
        return SECTIONS_DEFAULT
      }
    },
    data () {
      return {
        activePanel: 'accounts',
        currPage: 1,
        currSort: '-updated_at',
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
          sort: this.currSort
        })
      },
      openPanel (panel) {
        switch (panel) {
          case 'accounts':
            this.activePanel = 'accounts'
            break
          case 'posts':
            this.activePanel = 'posts'
            fetchPosts(this.$store, _.get(this.profile, [ 'id' ]))
            break
        }
      }
    },
    mounted () {},
    beforeMount () {
      this.$can('memberManage') && Promise.all([
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
    .panel
      width 100%
      padding 22px 84px 33px
      border 5px solid #d8ca21
      margin 0 auto
  @media (min-width 950px)
    .admin
      .control-bar
        max-width 950px
      .panel
        max-width 950px
</style>