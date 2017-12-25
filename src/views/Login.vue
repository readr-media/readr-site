<template>
  <div class="login-page">
    <app-header :sections="sections"></app-header>
    <LoginPanel v-if="isClientSide && !isLoggedIn"></LoginPanel>
  </div>
</template>
<script>
  import { isLoggedIn } from '../util/services'
  import LoginPanel from '../components/LoginPanel.vue'
  import Header from '../components/Header.vue'

  const SECTIONS_DEFAULT = {
    'chief-editor-talk': '總編評論',
    'celebrity-talk': '名人聊新聞',
    'hot-talk': '熱門評論',
    'chief-editor-list': '總編列表',
    'projects': '新聞專題'
  }
  
  export default {
    components: {
      'app-header': Header,
      LoginPanel
    },
    computed: {
      isLoggedIn () {
        if (window) {
          return isLoggedIn()
        } else {
          return false
        }
      },
      sections () {
        return SECTIONS_DEFAULT
      }
    },
    data () {
      return {
        isClientSide: false
      }
    },
    name: 'login-page',
    methods: {},
    mounted () {
      this.isClientSide = true
      this.isLoggedIn && location.replace('/')
    }
  }
</script>
<style lang="stylus" scoped>
.login-page
  min-height 100vh
  width 100%
  background-color #fff
</style>