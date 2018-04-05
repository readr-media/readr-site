<template>
  <div class="login-page" :class="{ 'packing-test': isPackingTest }">
    <main class="login-page__main">
      <!--LoginPanel v-if="isClientSide && !isLoggedIn"></LoginPanel-->
      <div v-if="isPackingTest" class="logo"><img src="/public/icons/logowithoutreadr.png"></div>
      <div v-if="isPackingTest" class="message" v-html="$t('PACKING_TEST.WELCOME')"></div>
      <LoginPanelPackingTest v-if="isClientSide && !isLoggedIn" :isPackingTest="isPackingTest"></LoginPanelPackingTest>
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
      isPackingTest () {
        return true
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
      this.isLoggedIn && this.$router.push('/')
    },
    watch: {
      isLoggedIn: function () {
        // this.isLoggedIn && location.replace('/')
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
  &.packing-test
    background-color #444746
    max-width 100%
    .login-page__main
      margin auto
    .logo
      text-align center
      img
        width 80px

    .message
      font-family PingFangTC
      font-size 15px
      font-weight normal
      font-style normal
      font-stretch normal
      line-height normal
      letter-spacing normal
      text-align center
      color #ffffff
      & >>> .title
        margin-top 0
        margin-bottom 40px
      & >>> .big
        font-size 1.5625rem
      & >>> .yellow
       color #ddcf21
      & >>> div
        margin 16px
  &__main
    margin-left 93.5px
    width 950px
</style>