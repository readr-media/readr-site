<template>
  <div class="login-page">
    <!-- <app-header :sections="sections"></app-header> -->
    <aside class="login-page__aside">
      <AppAsideNav/>
    </aside>
    <main class="login-page__main">
      <LoginPanel v-if="isClientSide && !isLoggedIn"></LoginPanel>
    </main>
  </div>
</template>
<script>
  import _ from 'lodash'
  import { SECTIONS_DEFAULT } from '../constants'
  import LoginPanel from '../components/LoginPanel.vue'
  import AppHeader from '../components/AppHeader.vue'
  import AppAsideNav from '../components/AppAsideNav.vue'
  
  export default {
    components: {
      'app-header': AppHeader,
      LoginPanel,
      AppAsideNav
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
  // &__container
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
    width 950px
</style>