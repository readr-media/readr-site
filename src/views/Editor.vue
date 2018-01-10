<template>
  <div class="editor">
    <app-header :sections="sections"></app-header>
    <main class="main-container">
      <app-about :profile="profile"></app-about>
      <base-control-bar v-on:addPost="$_editor_lightBoxHandler('postPanelEdit', 'add')"></base-control-bar>
      <section class="main-panel">
        
      </section>
      <base-light-box :showLightBox.sync="showLightBox">
        <post-panel-edit slot="postPanelEdit" :post="post" :showLightBox="showLightBox" :status="status" v-on:closeLightBox="$_editor_lightBoxHandler(false)"></post-panel-edit>
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

  export default {
    name: 'AppEditor',
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
      $_editor_lightBoxHandler (value, status) {
        this.post = {}
        this.showLightBox = value
        this.status = status
      }
    },
    watch: {
    }
  }
</script>
<style lang="stylus" scoped>
</style>