<template>
  <div class="editor">
    <!-- <app-header :sections="sections"></app-header> -->
    <div class="editor__container">
      <aside class="editor__aside">
        <AppAsideNav/>
      </aside>
      <main class="editor__main">
        <main class="main-container">
          <app-about :profile="profile"></app-about>
          <base-control-bar @addPost="$_editor_textEditorHandler(true, 'add')" @editDraft="$_editor_editDraft"></base-control-bar>
          <section class="main-panel">
            <template>
              <pagination-nav :totalPages="10" @pageChanged="$_editor_pageChanged"></pagination-nav>
              <post-list
                :posts="posts"
                @deletePost="$_editor_showAlert"
                @editPost="$_editor_textEditorHandler"
                @filterChanged="$_editor_updatePostList">
              </post-list>
            </template>
          </section>
          <base-light-box :showLightBox.sync="showDraftList">
            <post-list-detailed
              :posts="postsUser"
              @editPost="$_editor_textEditorHandler"
              @deletePost="$_editor_showAlert">
            </post-list-detailed>
          </base-light-box>
          <base-light-box :showLightBox.sync="showEditor">
            <post-panel
              :action="action"
              :isCompleted="isCompleted"
              :post.sync="post"
              :showLightBox="showEditor"
              @closeLightBox="$_editor_textEditorHandler(false)"
              @deletePost="$_editor_showAlert"
              @showAlert="$_editor_alertHandler"
              @updatePostList="$_editor_updatePostList">
            </post-panel>
          </base-light-box>
          <base-light-box
            :isAlert="true"
            :showLightBox.sync="showAlert">
            <alert-panel
              :action="action"
              :active="postActive"
              :isCompleted="isCompleted"
              :post="post"
              :showLightBox="showAlert"
              @closeAlert="$_editor_alertHandler"
              @closeEditor="$_editor_textEditorHandler(false)"
              @deletePost="$_editor_deletePost"
              @publishPost="$_editor_publishPost">
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

  const addPost = (store, params) => {
    return store.dispatch('ADD_POST', { params })
  }

  const fetchPosts = (store, { page, sort }) => {
    return store.dispatch('GET_POSTS', {
      params: {
        max_result: MAXRESULT,
        page: page || DEFAULT_PAGE,
        sort: sort || DEFAULT_SORT
      }
    })
  }

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

  const deletePostSelf = (store, id) => {
    return store.dispatch('DELETE_POST_SELF', { id: id })
  }

  const updatePost = (store, params) => {
    return store.dispatch('UPDATE_POST', { params })
  }

  export default {
    name: 'AppEditor',
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
      Promise.all([
        fetchPosts(this.$store, {}),
        fetchUserPosts(this.$store, _.get(this.profile, [ 'id' ]))
      ])
    },
    methods: {
      $_editor_alertHandler (showAlert, active, isCompleted) {
        this.postActive = active
        this.isCompleted = isCompleted
        this.showAlert = showAlert
      },
      $_editor_deletePost () {
        const id = _.get(this.post, [ 'id' ])
        deletePostSelf(this.$store, id)
          .then(() => {
            if (this.showDraftList) {
              this.showDraftList = false
            }
            this.$_editor_updatePostList()
            this.isCompleted = true
          })
      },
      $_editor_editDraft () {
        this.showDraftList = true
      },
      $_editor_pageChanged (index) {
        this.$_editor_updatePostList({ page: index })
      },
      $_editor_publishPost () {
        const params = {}
        params.active = 1
        params.content = _.get(this.post, [ 'content' ])
        params.link = _.get(this.post, [ 'link' ])
        params.og_description = _.get(this.post, [ 'ogDescription' ])
        params.og_image = _.get(this.post, [ 'ogImage' ])
        params.og_title = _.get(this.post, [ 'ogTitle' ]) || _.get(this.post, [ 'title' ])
        params.title = _.get(this.post, [ 'title' ])
        params.updated_by = _.get(this.$store.state, [ 'profile', 'id' ])

        if (Date.parse(_.get(this.post, [ 'date' ]))) {
          params.published_at = _.get(this.post, [ 'date' ])
        }
        if (this.action === 'add') {
          params.author = _.get(this.$store.state, [ 'profile', 'id' ])
          addPost(this.$store, params)
            .then(() => {
              this.isCompleted = true
            })
        }

        if (this.action === 'edit') {
          params.id = _.get(this.post, [ 'id' ])
          params.author = _.get(this.post, [ 'author', 'id' ])
          updatePost(this.$store, params)
            .then(() => {
              this.isCompleted = true
            })
        }

      },
      $_editor_textEditorHandler (showEditor, action, id) {
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
          this.$_editor_updatePostList()
        }
      },
      $_editor_showAlert (id) {
        this.post = _.find(this.posts, { 'id': id })
        this.postActive = 0
        this.isCompleted = false
        this.showAlert = true
      },
      $_editor_updatePostList (params = {}) {
        this.page = params.page
        this.sort = params.sort
        Promise.all([
          fetchPosts(this.$store, {
            id: _.get(this.profile, [ 'id' ]),
            page: this.page,
            sort: this.sort
          }),
          fetchUserPosts(this.$store, _.get(this.profile, [ 'id' ]))
        ])
        
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .editor
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
  .main-panel
    background-color white
</style>