<template>
  <div class="admin">
    <div class="admin__container">
      <aside class="admin__aside">
        <AppAsideNav/>
      </aside>
      <main class="admin__main">
        <!-- <app-header :sections="sections"></app-header> -->
        <About :profile="profile"></About>
        <div class="control-bar">
          <TheBaseControlBar @openPanel="openPanel" @addAccount="addMember" @addPost="$_admin_editorHandler(true, 'add')"></TheBaseControlBar>
        </div>
        <template v-if="activePanel === 'accounts'">
          <MembersPanel v-if="$can('memberManage')" @filterChanged="filterChanged"></MembersPanel>
        </template>
        <template v-else-if="activePanel === 'posts'">
          <section class="panel">
            <post-list
              :posts="posts"
              @deletePost="$_admin_showAlert"
              @editPost="$_admin_editorHandler"
              @filterChanged="$_admin_updatePostList"
            ></post-list>
          </section>
        </template>
        <BaseLightBox :showLightBox.sync="showLightBox" borderStyle="nonBorder" :isConversation="true">
          <MemberAccountEditor @updated="filterChanged" :shouldShow="showLightBox" :title="wording.WORDING_ADMIN_MEMBER_EDITOR_ADD_MEMBER" action="add"></MemberAccountEditor>
        </BaseLightBox>
        <BaseLightBox :showLightBox.sync="showEditor">
          <PostPanel
            :action="action"
            :isCompleted="isCompleted"
            :post.sync="post"
            :showLightBox="showEditor"
            @closeLightBox="$_admin_editorHandler(false)"
            @showAlert="$_admin_alertHandler"
            @updatePostList="$_admin_updatePostList">
          </PostPanel>
        </BaseLightBox>
        <BaseLightBox :isAlert="true" :showLightBox.sync="showAlert">
          <AlertPanel
            :action="action"
            :active="postActive"
            :isCompleted="isCompleted"
            :post="post"
            :showLightBox="showAlert"
            @closeAlert="$_admin_alertHandler"
            @closeEditor="$_admin_editorHandler(false)"
            @deletePost="$_admin_deletePost"
            @publishPost="$_admin_publishPost">
          </AlertPanel>
        </BaseLightBox>
        <div id="coral_talk_stream"></div>
      </main>
    </div>
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
  import PostPanel from '../components/PostPanel.vue'
  import AlertPanel from '../components/AlertPanel.vue'
  import AppAsideNav from '../components/AppAsideNav.vue'
  import { renderComment } from '../util/talk'

  const MAXRESULT = 20
  const DEFAULT_PAGE = 1
  const DEFAULT_SORT = '-updated_at'

  const addPost = (store, params) => {
    return store.dispatch('ADD_POST', { params })
  }

  const fetchPosts = (store, id) => {
    return store.dispatch('GET_POSTS', {
      params: {
        where: {
          author: id
        }
      }
    })
  }

  const deletePost = (store, id) => {
    return store.dispatch('DELETE_POST', { id: id })
  }

  const updatePost = (store, params) => {
    return store.dispatch('UPDATE_POST', { params })
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
      TheBaseControlBar,
      PostPanel,
      AlertPanel,
      AppAsideNav
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
        isCompleted: false,
        post: {},
        showEditor: false,
        action: undefined,
        showAlert: false,
        postActive: undefined,
        wording: {
          WORDING_ADMIN_MEMBER_EDITOR_ADD_MEMBER
        }
      }
    },
    name: 'admin-page',
    methods: {
      $_admin_publishPost () {
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
          updatePost(this.$store, params)
            .then(() => {
              this.isCompleted = true
            })
        }

      },
      $_admin_showAlert (id) {
        this.post = _.find(this.posts, { 'id': id })
        this.postActive = 0
        this.isCompleted = false
        this.showAlert = true
      },
      $_admin_deletePost () {
        const id = _.get(this.post, [ 'id' ])
        deletePost(this.$store, id)
          .then(() => {
            this.$_admin_updatePostList()
            this.isCompleted = true
          })
      },
      $_admin_updatePostList (params = {}) {
        this.page = params.page
        this.sort = params.sort
        fetchPosts(this.$store, {
          id: _.get(this.profile, [ 'id' ]),
          page: this.page,
          sort: this.sort
        })
      },
      $_admin_alertHandler (showAlert, active, isCompleted) {
        this.postActive = active
        this.isCompleted = isCompleted
        this.showAlert = showAlert
      },
      $_admin_editorHandler (showEditor, action, id) {
        this.isCompleted = false
        this.post = _.find(this.posts, { 'id': id }) || {}
        this.action = action
        this.showEditor = showEditor
        if (!this.showEditor) {
          this.action = undefined
          this.isCompleted = true
          this.post = {}
          this.$_admin_updatePostList()
        }
      },
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
    mounted () {
      renderComment('#coral_talk_stream', location.href)
    },
    beforeMount () {
      this.$can('memberManage') && Promise.all([
        getMembers(this.$store, {})
      ])
    }
  }
</script>
<style lang="stylus" scoped>
  .admin
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
    .control-bar
      width 100%
      margin 0 auto
    .panel
      width 100%
      padding 22px 84px 33px
      border 5px solid #d8ca21
      margin 0 auto
      background-color white
  @media (min-width 950px)
    .admin
      .control-bar
        max-width 950px
      .panel
        max-width 950px
</style>