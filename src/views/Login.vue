<template>
  <div class="login-page">
    <main class="login-page__main">
      <!--LoginPanel v-if="isClientSide && !isLoggedIn"></LoginPanel-->
      <LoginPanelPackingTest v-if="isClientSide && !isLoggedIn"></LoginPanelPackingTest>
    </main>
  </div>
</template>
<script>
  import { SECTIONS_DEFAULT, } from '../constants'
  import { get, } from 'lodash'
  // import LoginPanel from '../components/LoginPanel.vue'
  import LoginPanelPackingTest from '../components/LoginPanelPackingTest.vue'
  import AppHeader from '../components/AppHeader.vue'
  import AppAsideNav from '../components/AppAsideNav.vue'
  
  export default {
    components: {
      'app-header': AppHeader,
      LoginPanelPackingTest,
      AppAsideNav,
    },
    computed: {
      isLoggedIn () {
        return get(this.$store, [ 'state', 'isLoggedIn', ], false)
      },
      sections () {
        return SECTIONS_DEFAULT
      },
    },
    data () {
      return {
        isClientSide: false,
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
      },
    },
  }
</script>
<style lang="stylus" scoped>
.login-page
  min-height 100vh
  width 100%
  background-color #fff
  // &__container
  max-width 1200px
  margin auto
  padding 25px 0
  display flex
  &__main
    margin-left 93.5px
    width 950px
</style>