<template>
  <div class="login-page">
    <!-- <app-header :sections="sections"></app-header> -->
    <LoginPanel v-if="isClientSide && !isLoggedIn"></LoginPanel>
  </div>
</template>
<script>
  import _ from 'lodash'
  import { SECTIONS_DEFAULT } from '../constants'
  import LoginPanel from '../components/LoginPanel.vue'
  import AppHeader from '../components/AppHeader.vue'
  
  export default {
    components: {
      'app-header': AppHeader,
      LoginPanel
    },
    computed: {
      isLoggedIn () {
        return _.get(this.$store, [ 'state', 'isLoggedIn' ], false)
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
    },
    watch: {
      isLoggedIn: function () {
        this.isLoggedIn && location.replace('/')
      }
    }
  }
</script>
<style lang="stylus" scoped>
.login-page
  min-height 100vh
  width 100%
  background-color #fff
</style>