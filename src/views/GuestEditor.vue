<template>
  <div class="guestEditor">
    <app-header :sections="sections"></app-header>
    <main class="main-container">
      <app-about :profile="profile"></app-about>
      <base-control-bar @addPost="$_guestEditor_editorHandler(true, 'add')"></base-control-bar>
      <section class="main-panel">
        <template>
          <post-list
            :posts="posts"
            @deletePost="$_guestEditor_showAlert"
            @editPost="$_guestEditor_editorHandler">
          </post-list>
        </template>
      </section>
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
  </div>
</template>
<script>
  import { SECTIONS_DEFAULT } from '../constants'
  import _ from 'lodash'
  import About from '../components/About.vue'
  import AlertPanel from '../components/AlertPanel.vue'
  import BaseLightBox from '../components/BaseLightBox.vue'
  import AppHeader from '../components/AppHeader.vue'
  import PostList from '../components/PostList.vue'
  import PostPanel from '../components/PostPanel.vue'
  import TheBaseControlBar from '../components/TheBaseControlBar.vue'

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

  export default {
    name: 'GuestEditor',
    components: {
      'alert-panel': AlertPanel,
      'app-about': About,
      'app-header': AppHeader,
      'base-control-bar': TheBaseControlBar,
      'base-light-box': BaseLightBox,
      'post-list': PostList,
      'post-panel': PostPanel
    },
    data () {
      return {
        action: undefined,
        isCompleted: false,
        post: {},
        postActive: undefined,
        showAlert: false,
        showEditor: false,
      }
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
    watch: {
      profile () {
        fetchPosts(this.$store, _.get(this.profile, [ 'id' ]))
      }
    },
    mounted () {
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
            this.$_guestEditor_updatePostList()
            this.isCompleted = true
          })
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
      $_guestEditor_showAlert (id) {
        this.post = _.find(this.posts, { 'id': id })
        this.postActive = 0
        this.isCompleted = false
        this.showAlert = true
      },
      $_guestEditor_updatePostList () {
        fetchPosts(this.$store, _.get(this.profile, [ 'id' ]))
      }
    }
  }
</script>
<style lang="stylus" scoped>
</style>