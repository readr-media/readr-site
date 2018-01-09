<template>
  <div class="guestEditor">
    <app-header :sections="sections"></app-header>
    <main class="guestEditor__main">
      <app-about :profile="profile"></app-about>
      <base-control-bar v-on:addPost="$_guestEditor_lightBoxHandler(true, 'add')"></base-control-bar>
      <section class="guestEditor__manager">
        <template>
          <post-list :posts="posts" v-on:deletePost="$_guestEditor_deletePost" v-on:editPost="$_guestEditor_editPost"></post-list>
        </template>
      </section>
      <base-light-box :showLightBox.sync="showLightBox">
        <post-panel-edit slot="postPanelEdit" :post="post" :showLightBox="showLightBox" :status="status" v-on:closeLightBox="$_guestEditor_lightBoxHandler(false)" v-on:updatePostList="$_guestEditor_updatePostList"></post-panel-edit>
      </base-light-box>
    </main>
  </div>
</template>
<script>
  import _ from 'lodash'
  import About from '../components/About.vue'
  import BaseLightBox from '../components/BaseLightBox.vue'
  import Header from '../components/Header.vue'
  import PostList from '../components/PostList.vue'
  import PostPanelEdit from '../components/PostPanelEdit.vue'
  import TheBaseControlBar from '../components/TheBaseControlBar.vue'

  const SECTIONS_DEFAULT = {
    'chief-editor-talk': '總編評論',
    'celebrity-talk': '名人聊新聞',
    'hot-talk': '熱門評論',
    'chief-editor-list': '總編列表',
    'projects': '新聞專題'
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

  export default {
    name: 'GuestEditor',
    components: {
      'app-about': About,
      'app-header': Header,
      'base-control-bar': TheBaseControlBar,
      'base-light-box': BaseLightBox,
      'post-list': PostList,
      'post-panel-edit': PostPanelEdit
    },
    data () {
      return {
        post: {},
        showLightBox: false,
        status: ''
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
    mounted () {
    },
    methods: {
      $_guestEditor_deletePost (id) {
        deletePost(this.$store, id)
          .then(() => {
            this.$_guestEditor_updatePostList()
          })
      },
      $_guestEditor_editPost (id) {
        this.status = 'edit'
        this.showLightBox = true
        this.post = _.find(this.posts, { 'id': id })
      },
      $_guestEditor_lightBoxHandler (value, status) {
        this.post = {}
        this.showLightBox = value
        this.status = status
      },
      $_guestEditor_updatePostList () {
        fetchPosts(this.$store, _.get(this.profile, [ 'id' ]))
      }
    },
    watch: {
      profile: function () {
        fetchPosts(this.$store, _.get(this.profile, [ 'id' ]))
      }
    }
  }
</script>
<style lang="stylus" scoped>
.guestEditor
  &__main
    width 950px
    max-width 950px
    margin 22px auto 0
  &__manager
    width 100%
    padding 22px 84px 33px
    border 2px solid #d8ca21
  
</style>