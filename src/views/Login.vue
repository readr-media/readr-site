<template>
  <div class="login-page">
    <LoginPanel v-if="isClientSide && !isLoggedIn"></LoginPanel>
  </div>
</template>
<script>
  import { isLoggedIn } from '../util/services'
  import LoginPanel from '../components/LoginPanel.vue'
  
  export default {
    components: {
      LoginPanel
    },
    computed: {
      isLoggedIn () {
        if (window) {
          return isLoggedIn()
        } else {
          return false
        }
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