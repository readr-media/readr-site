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
          <base-control-bar @addPost="$_guestEditor_editorHandler(true, 'add')" @editDraft="$_guestEditor_editDraft"></base-control-bar>
          <section class="main-panel">
          </section>
          <base-light-box :showLightBox.sync="showDraftList">
            <post-list-detailed
              :posts="postsUser"
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
  import { SECTIONS_DEFAULT } from '../constants'
  import _ from 'lodash'
  import About from '../components/About.vue'
  import AlertPanel from '../components/AlertPanel.vue'
  import BaseLightBox from '../components/BaseLightBox.vue'
  import AppHeader from '../components/AppHeader.vue'
  import PaginationNav from '../components/PaginationNav.vue'
  import PostList from '../components/PostList.vue'
  import PostListDetailed from '../components/PostListDetailed.vue'
  import PostPanel from '../components/PostPanel.vue'
  import TheBaseControlBar from '../components/TheBaseControlBar.vue'
  import AppAsideNav from '../components/AppAsideNav.vue'

  const MAXRESULT = 20
  const DEFAULT_PAGE = 1
  const DEFAULT_SORT = '-updated_at'

  const fetchUserPosts = (store, id, page, sort) => {
    return store.dispatch('GET_USER_POSTS', {
      params: {
        max_result: MAXRESULT,
        page: page || DEFAULT_PAGE,
        sort: sort || DEFAULT_SORT,
        where: {
          author: id
        }
      }
    })
  }

  const deletePost = (store, id) => {
    return store.dispatch('DELETE_POST', { id: id })
  }

  export default {
    name: 'GuestEditor',
    components: {
      'alert-panel': AlertPanel,
      'app-about': About,
      'app-header': AppHeader,
      'base-control-bar': TheBaseControlBar,
      'base-light-box': BaseLightBox,
      'pagination-nav': PaginationNav,
      'post-list': PostList,
      'post-list-detailed': PostListDetailed,
      'post-panel': PostPanel,
      AppAsideNav
    },
    data () {
      return {
        action: undefined,
        isCompleted: false,
        page: DEFAULT_PAGE,
        post: {},
        postActive: undefined,
        showAlert: false,
        showDraftList: false,
        showEditor: false,
        sort: DEFAULT_SORT
      }
    },
    computed: {
      posts () {
        return _.get(this.$store, [ 'state', 'posts', 'items' ], [])
      },
      postsUser () {
        return _.get(this.$store, [ 'state', 'posts-user', 'items' ], [])
      },
      profile () {
        return _.get(this.$store, [ 'state', 'profile' ], {})
      },
      sections () {
        return SECTIONS_DEFAULT
      }
    },
    mounted () {
      fetchUserPosts(this.$store, _.get(this.profile, [ 'id' ]))
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
      $_guestEditor_pageChanged (index) {
        this.$_guestEditor_updatePostList({ page: index })
      },
      $_guestEditor_showAlert (id) {
        this.post = _.find(this.posts, { 'id': id })
        this.postActive = 0
        this.isCompleted = false
        this.showAlert = true
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
        fetchUserPosts(this.$store, _.get(this.profile, [ 'id' ]))
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
      max-width 1085px
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
      margin-left 30px
</style>