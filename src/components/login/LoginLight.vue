<template>
  <div class="login-light" v-if="active" @click="turnOffThis">
    <div class="login-light__panel" @click.stop="() => {}">
      <div class="login-light__close" @click.stop="turnOffThis"></div>
      <div class="login-light__logo"><img src="/public/icons/readr-logo.png"></div>
      <div class="login-light__container">
        <template v-if="!isRegistering">        
          <div class="login-by-social-media">
            <FacebookLogin type="mix" :isDoingLogin.sync="isProcessing" theme="light"></FacebookLogin>
            <GooglePlusLogin type="mix" :isDoingLogin.sync="isProcessing" theme="light"></GooglePlusLogin>
          </div>
          <div class="login-by-email">
            <div class="hint-text"><span v-text="$t('login.USE_EMAIL_INSTEAD')"></span></div>
            <Login :isDoingLogin.sync="isProcessing" theme="dark"></Login>
          </div>
        </template>
        <template v-else>
          <div class="register">
            <Register></Register>
          </div>
        </template>
        <div class="registration-switcher">
          <span class="question" 
            v-text="isRegistering ? $t('login.MEMBER_ALREAY') : $t('login.NOT_MEMBER_YET')"></span>
          <span class="switcher" @click="switchAction"
            v-text="isRegistering ? $t('login.WORDING_LOGIN') : $t('login.WORDING_REGISTER')"></span>
        </div>
      </div>
      <div class="login-light__processing-hint" v-if="isProcessing"><Spinner :show="true"></Spinner></div>
    </div>
  </div>
</template>
<script>
  import FacebookLogin from './FacebookLogin.vue'
  import GooglePlusLogin from './GooglePlusLogin.vue'
  import Login from './Login.vue'
  import Register from 'src/components/register/Register.vue'
  import Spinner from 'src/components/Spinner.vue'
  import preventScroll from 'prevent-scroll'
  import { get, } from 'lodash'
  import { loadRecaptcha, } from 'src/util/comm'
  const switchOff = store => store.dispatch('LOGIN_ASK_TOGGLE', { active: false, message: '', })
  const getDisposableToken = store => store.dispatch('DISPOSABLE_TOKEN', { type: 'register', })
  // const debug = require('debug')('CLIENT:LoginLight')
  export default {
    name: 'LoginLight',
    components: {
      FacebookLogin,
      GooglePlusLogin,
      Login,
      Register,
      Spinner,
    },
    computed: {
      active () {
        return get(this.$store, 'state.loginAskFlag.active', false)
      },      
    },
    data () {
      return {
        isProcessing: false,
        isRegistering: false,
      }
    },
    methods: {
      switchAction () {
        this.isRegistering = !this.isRegistering
      },
      turnOffThis () {
        switchOff(this.$store)
      },
    },
    mounted () {},
    watch: {
      active () {
        if (this.active) {
          preventScroll.on()
          getDisposableToken(this.$store)
          loadRecaptcha(this.$store)
        } else {
          preventScroll.off()
        }
      },
    },
  }
</script>
<style lang="stylus" scoped>
  .login-light
    position fixed
    left 0
    top 0
    background-color rgba(255,255,255,0.9)
    z-index 999999
    width 100vw
    height 100vh
    display flex
    justify-content center
    align-items center
    &__panel
      width 100%
      max-width 480px
      max-height 100%
      background-color #444746
      padding 25px 90px 30px
      position relative
    &__logo
      margin 0 auto
      width 50px
      img
        width 100%
    &__container
      margin-top 37px
      .login-by-email
        margin-top 38px
        .hint-text
          display flex
          justify-content center
          color #fff
          font-size 0.9375rem
          margin-bottom 12px
      .registration-switcher
        margin-top 30px
        display flex
        justify-content center
        font-size 0.9375rem
        font-weight 600
        font-style normal
        font-stretch normal
        line-height normal
        letter-spacing normal
        text-align center
        .question
          color #fff
        .switcher
          color #ddcf21
          cursor pointer
    &__processing-hint
      display flex
      justify-content center
      align-items center
      position absolute
      top 0
      left 0
      width 100%
      height 100%
      background-color rgba(0,0,0,0.8)
      z-index 1

    &__close
      width 20px
      height 20px
      position absolute
      right 0
      top 0
      background-size contain
      background-position center center
      background-repeat no-repeat
      background-image url(/public/icons/shutdown.jpg)
      cursor pointer
</style>