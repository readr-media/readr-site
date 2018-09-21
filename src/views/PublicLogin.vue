<template>
  <div class="login-page" :class="{ 'packing-test': !registrationActive, }">
    <main class="login-page__main">
      <template v-if="registrationActive">
        <LoginPanel v-if="isClientSide && !isLoggedIn"></LoginPanel>
      </template>
      <template v-else>
        <div class="logo"><img src="/public/icons/logowithoutreadr.png"></div>
        <div class="message" v-html="$t('PACKING_TEST.WELCOME')"></div>
        <LoginPanelPackingTest v-if="isClientSide && !isLoggedIn" :isPackingTest="registrationActive"></LoginPanelPackingTest>
      </template>
    </main>
  </div>
</template>
<script>
  import { get, } from 'lodash'
  import LoginPanel from '../components/LoginPanel.vue'
  import LoginPanelPackingTest from 'src/components/LoginPanelPackingTest.vue'

  export default {
    components: {
      LoginPanel,
      LoginPanelPackingTest,
    },
    computed: {
      isLoggedIn () {
        return get(this.$store, [ 'state', 'isLoggedIn', ], false)
      },
      registrationActive () {
        return get(this.$store, 'state.setting.REGISTRATION_ACTIVE', false)
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
    display flex
    flex-direction column
    justify-content center
    align-items center
</style>