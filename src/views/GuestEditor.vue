<template>
  <div class="guestEditor">
    <!-- <app-header :sections="sections"></app-header> -->
    <div class="guestEditor__container">
      <aside class="guestEditor__aside">
        <AppAsideNav/>
      </aside>
      <main class="guestEditor__main">
        <main class="main-container">
          <app-about :profile="profile"></app-about>
          <base-control-bar
            @addPost="$_guestEditor_editorHandler(true, 'add')"
            @editDraft="$_guestEditor_editDraft"
            @openPanel="$_guestEditor_openPanel">
          </base-control-bar>
          <template v-if="activePanel === 'record'">
            <section class="guestEditor__record">
              <app-tab :tabs="tabs" @changeTab="$_guestEditor_tabHandler">
                <post-list-tab slot="0" :posts="postsUser"></post-list-tab>
                <following-list-tab slot="1" :followingByUser="followingByUser" @changeResource="$_guestEditor_followingHandler"></following-list-tab>
              </app-tab>
            </section>
          </template>
          <base-light-box :showLightBox.sync="showDraftList">
            <post-list-detailed
              :posts="postsUserDraft"
              @editPost="$_guestEditor_textEditorHandler"
              @deletePost="$_guestEditor_showAlert">
            </post-list-detailed>
          </base-light-box>
          <base-light-box :showLightBox.sync="showEditor">
            <post-panel
              :action="action"
              :isCompleted="isCompleted"
              :post.sync="post"
              :showLightBox="showEditor"
              @closeLightBox="$_guestEditor_editorHandler(false)"
              @showAlert="$_guestEditor_alertHandler"
              @updatePostList="$_guestEditor_updatePostList">
            </post-panel>
          </base-light-box>
          <base-light-box :isAlert="true" :showLightBox.sync="showAlert">
            <alert-panel
              :action="action"
              :active="postActive"
              :isCompleted="isCompleted"
              :post="post"
              :showLightBox="showAlert"
              @closeAlert="$_guestEditor_alertHandler"
              @closeEditor="$_guestEditor_editorHandler(false)"
              @deletePost="$_guestEditor_deletePost">
            </alert-panel>
          </base-light-box>
        </main>
      </main>
    </div>
  </div>
</template>
<script>
  import {
    POST_ACTIVE,
    SECTIONS_DEFAULT,
    WORDING_TAB_COMMENT_RECORD,
    WORDING_TAB_FOLLOW_RECORD,
    WORDING_TAB_POST_RECORD
  } from '../constants'
  import _ from 'lodash'
  import About from '../components/About.vue'
  import AlertPanel from '../components/AlertPanel.vue'
  import AppAsideNav from '../components/AppAsideNav.vue'
  import AppHeader from '../components/AppHeader.vue'
  import BaseLightBox from '../components/BaseLightBox.vue'
  import FollowingListInTab from '../components/FollowingListInTab.vue'
  import PaginationNav from '../components/PaginationNav.vue'
  import PostList from '../components/PostList.vue'
  import PostListDetailed from '../components/PostListDetailed.vue'
  import PostListInTab from '../components/PostListInTab.vue'
  import PostPanel from '../components/PostPanel.vue'
  import Tab from '../components/Tab.vue'
  import TheBaseControlBar from '../components/TheBaseControlBar.vue'

  const MAXRESULT = 20
  const DEFAULT_PAGE = 1
  const DEFAULT_SORT = '-updated_at'

  const fetchUserPosts = (store, {
    maxResult = MAXRESULT,
    page = DEFAULT_PAGE,
    sort = DEFAULT_SORT,
    where = {}
  }) => {
    return store.dispatch('GET_USER_POSTS', {
      params: {
        max_result: maxResult,
        page: page,
        sort: sort,
        where: where
      }
    })
  }

  const deletePost = (store, id) => {
    return store.dispatch('DELETE_POST', { id: id })
  }

  const fetchFollowing = (store, params) => {
    if (params.subject) {
      return store.dispatch('GET_FOLLOWING_BY_USER', {
        subject: params.subject,
        resource: params.resource
      })
    } else {
      return store.dispatch('GET_FOLLOWING_BY_RESOURCE', {
        resource: params.resource,
        ids: params.ids
      })
    }
  }

  export default {
    name: 'GuestEditor',
    components: {
      'alert-panel': AlertPanel,
      'app-about': About,
      'app-header': AppHeader,
      'app-tab': Tab,
      'base-control-bar': TheBaseControlBar,
      'base-light-box': BaseLightBox,
      'following-list-tab': FollowingListInTab,
      'pagination-nav': PaginationNav,
      'post-list': PostList,
      'post-list-detailed': PostListDetailed,
      'post-list-tab': PostListInTab,
      'post-panel': PostPanel,
      AppAsideNav
    },
    data () {
      return {
        action: undefined,
        activePanel: 'record',
        isCompleted: false,
        page: DEFAULT_PAGE,
        post: {},
        postActive: undefined,
        showAlert: false,
        showDraftList: false,
        showEditor: false,
        sort: DEFAULT_SORT,
        tabs: [
          WORDING_TAB_POST_RECORD,
          WORDING_TAB_FOLLOW_RECORD,
          WORDING_TAB_COMMENT_RECORD
        ]
      }
    },
    computed: {
      followingByUser () {
        return _.get(this.$store, [ 'state', 'followingByUser' ], [])
      },
      posts () {
        return _.get(this.$store, [ 'state', 'posts', 'items' ], [])
      },
      postsUser () {
        return _.get(this.$store, [ 'state', 'posts-user', 'items' ], [])
      },
      postsUserDraft () {
        return _.get(this.$store, [ 'state', 'posts-user-draft', 'items' ], [])
      },
      profile () {
        return _.get(this.$store, [ 'state', 'profile' ], {})
      },
      sections () {
        return SECTIONS_DEFAULT
      }
    },
    mounted () {
      Promise.all([
        fetchUserPosts(this.$store, { where: { author: _.get(this.profile, [ 'id' ])}}),
        fetchUserPosts(this.$store, {
          where: {
            author: _.get(this.profile, [ 'id' ]),
            active: POST_ACTIVE.draft
          }
        }),
        fetchFollowing(this.$store, { subject: _.get(this.profile, [ 'id' ]), resource: 'member' })
      ])
      
    },
    methods: {
      $_guestEditor_alertHandler (showAlert, active, isCompleted) {
        this.postActive = active
        this.isCompleted = isCompleted
        this.showAlert = showAlert
      },
      $_guestEditor_deletePost () {
        const id = _.get(this.post, [ 'id' ])
        deletePost(this.$store, id)
          .then(() => {
            if (this.showDraftList) {
              this.showDraftList = false
            }
            this.$_guestEditor_updatePostList()
            this.isCompleted = true
          })
      },
      $_guestEditor_editDraft () {
        this.showDraftList = true
      },
      $_guestEditor_editorHandler (showEditor, action, id) {
        this.isCompleted = false
        this.post = _.find(this.posts, { 'id': id }) || {}
        this.action = action
        this.showEditor = showEditor
        if (!this.showEditor) {
          this.action = undefined
          this.isCompleted = true
          this.post = {}
          this.$_guestEditor_updatePostList()
        }
      },
      $_guestEditor_followingHandler (resource) {
        fetchFollowing(this.$store, { subject: _.get(this.profile, [ 'id' ]), resource: resource })
      },
      $_guestEditor_openPanel (panel) {
        this.activePanel = panel
      },
      $_guestEditor_pageChanged (index) {
        this.$_guestEditor_updatePostList({ page: index })
      },
      $_guestEditor_showAlert (id) {
        this.post = _.find(this.posts, { 'id': id })
        this.postActive = 0
        this.isCompleted = false
        this.showAlert = true
      },
      $_guestEditor_tabHandler (tab) {
        if (tab === 1) {
          fetchFollowing(this.$store, { subject: _.get(this.profile, [ 'id' ]), resource: 'member' })
        }
      },
      $_guestEditor_textEditorHandler (showEditor, action, id) {
        this.isCompleted = false
        this.post = _.find(this.posts, { 'id': id }) || {}
        if (action === 'add') {
          this.post.author = _.get(this.$store.state, [ 'profile' ])
        }
        this.action = action
        this.showEditor = showEditor
        if (!this.showEditor) {
          if (this.showDraftList) {
            this.showDraftList = false
          }
          this.action = undefined
          this.isCompleted = true
          this.post = {}
          this.$_guestEditor_updatePostList()
        }
      },
      $_guestEditor_updatePostList (params = {}) {
        this.page = params.page
        this.sort = params.sort
        fetchUserPosts(this.$store, {
          page: this.page,
          sort: this.sort,
          where: { author: _.get(this.profile, [ 'id' ])}
        })
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .guestEditor
    background-color #e6e6e6
    width 100%
    min-height 100vh
    &__container
      max-width 1200px
      margin auto
      padding 60px 0
      display flex
    &__aside
      width 75px
      height 100%
      position sticky
      // position fixed
      top 60px
    &__main
      margin-left 93.5px
    &__record
      background-color #fff
</style>