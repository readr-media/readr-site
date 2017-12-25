<template>
  <div class="index-page">
    <app-header :sections="sections"></app-header>
    <div class="logout" @click="logout">logoiut</div>
  </div> 
  
</template>
<script>
  import { currentUser, isLoggedIn, removeToken } from '../util/services'
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
      'app-header': Header
    },
    computed: {
      sections () {
        return SECTIONS_DEFAULT
      }
    },
    name: 'index-page',
    methods: {
      logout () {
        removeToken()
      }
    },
    mounted () {
      console.log('currentUser', currentUser())
      console.log('isLoggedIn', isLoggedIn())
    }
  }
</script>
<style lang="stylus" scoped>

</style>