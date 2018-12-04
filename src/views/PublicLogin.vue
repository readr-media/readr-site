<template>
  <div class="login-page" :class="{ 'packing-test': !registrationActive, }">
    <main class="login-page__main">
      <template v-if="registrationActive">
        <router-link to="/"><img src="/public/icons/logowithoutreadr.png"></router-link>
        <div class="message" v-html="$t('login.WELCOME')"></div>
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
  import { loadRecaptcha, } from 'src/util/comm'
  import LoginPanel from '../components/LoginPanel.vue'
  import LoginPanelPackingTest from 'src/components/LoginPanelPackingTest.vue'

  export default {
    components: {
      LoginPanel,
      LoginPanelPackingTest,
    },
    computed: {
      isLoggedIn () {
        return get(this.$store, 'state.isLoggedIn', false)
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
    name: 'Login',
    methods: {},
    mounted () {
      this.isClientSide = true
      if (this.isLoggedIn) {
        this.$router.push('/')
      } else {
        loadRecaptcha(this.$store)
      }
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
  display flex
  justify-content center
  width 100%
  min-height 100vh
  padding 40px 0
  background-color #444746
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
    display flex
    flex-direction column
    justify-content center
    align-items center
    width 950px
    margin 0 auto
    > a
      font-size 0
    img
      width 80px
    .message
      margin-top .5em
      color #ffffff
      font-size .9375rem
      font-weight 300
      font-style normal
      font-stretch normal
      line-height normal
      letter-spacing 1px
      text-align center
      & >>> .title
        margin-top 0
        margin-bottom 1em
      & >>> .big
        font-size 1.5625rem
      & >>> .yellow
        color #ddcf21
        font-weight normal
      & >>> div + div
        margin-top .5em

</style>
