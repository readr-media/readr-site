<template>
  <div
    v-if="active"
    class="login-light"
    :class="{ window: TYPE.WINDOW === type, }"
    @click="turnOffThis"
  >
    <div
      class="login-light__panel"
      @click.stop="() => {}"
    >
      <div
        class="login-light__close"
        @click.stop="turnOffThis"
      />
      <div class="login-light__logo">
        <img src="/public/icons/readr-logo.png">
      </div>
      <div class="login-light__container">
        <template v-if="!isRegistering">
          <div class="login-by-social-media">
            <FacebookLogin
              type="mix"
              :is-doing-login.sync="isProcessing"
              theme="light"
              :panel-type="type"
            />
            <GooglePlusLogin
              type="mix"
              :is-doing-login.sync="isProcessing"
              theme="light"
              :panel-type="type"
            />
          </div>
          <div class="login-msg">
            <span v-text="message" />
          </div>
          <div class="login-by-email">
            <div class="hint-text">
              <span v-text="$t('login.USE_EMAIL_INSTEAD')" />
            </div>
            <Login
              :is-doing-login.sync="isProcessing"
              theme="dark"
              :panel-type="type"
            />
          </div>
        </template>
        <template v-else>
          <div class="login-msg">
            <span v-text="message" />
          </div>
          <div class="register">
            <Register />
          </div>
        </template>
        <div class="registration-switcher">
          <span
            class="question"
            v-text="isRegistering ? $t('login.MEMBER_ALREAY') : $t('login.NOT_MEMBER_YET')"
          />
          <span
            class="switcher"
            @click="switchAction"
            v-text="isRegistering ? $t('login.WORDING_LOGIN') : $t('login.WORDING_REGISTER')"
          />
        </div>
      </div>
      <div
        v-if="isProcessing"
        class="login-light__processing-hint"
      >
        <Spinner :show="true" />
      </div>
    </div>
  </div>
</template>
<script>
import Cookie from 'vue-cookie'
import FacebookLogin from './FacebookLogin.vue'
import GooglePlusLogin from './GooglePlusLogin.vue'
import Login from './Login.vue'
import Register from 'src/components/register/Register.vue'
import Spinner from 'src/components/Spinner.vue'
import preventScroll from 'prevent-scroll'
import { get } from 'lodash'
import { loadRecaptcha, loadGapiSDK, loadFbSDK } from 'src/util/comm'
const switchOff = store => store.dispatch('UILoginLightbox/LOGIN_ASK_TOGGLE', { active: false, message: '' })
const getDisposableToken = store => store.dispatch('DISPOSABLE_TOKEN', { type: 'register' })
// const debug = require('debug')('CLIENT:LoginLight')
const TYPE = {
  WINDOW: 'WINDOW'
}
export default {
  name: 'LoginLight',
  components: {
    FacebookLogin,
    GooglePlusLogin,
    Login,
    Register,
    Spinner
  },
  data () {
    return {
      TYPE,
      isProcessing: false,
      isRegistering: false
    }
  },
  computed: {
    active () {
      return get(this.$store, 'state.UILoginLightbox.loginAskFlag.active', false)
    },
    message () {
      return get(this.$store, 'state.UILoginLightbox.loginAskFlag.message', this.$t('login.REGISTER_BONUS'))
    },
    type () {
      return get(this.$store, 'state.UILoginLightbox.loginAskFlag.type', 'confirm')
    }
  },
  watch: {
    active () {
      if (this.active) {
        preventScroll.on()
        Cookie.set('location-replace-from', this.$route.fullPath, { expires: '60s' })
        Promise.all([
          getDisposableToken(this.$store),
          loadRecaptcha(this.$store),
          loadGapiSDK(this.$store),
          loadFbSDK(this.$store)
        ])
      } else {
        preventScroll.off()
        Cookie.delete('location-replace-from')
        this.$forceUpdate()
      }
    }
  },
  mounted () {},
  methods: {
    switchAction () {
      this.isRegistering = !this.isRegistering
    },
    turnOffThis () {
      /** if isProcessing is true, user is not allowed to close the this comp */
      if (this.isProcessing) { return }
      switchOff(this.$store)
    }
  }
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
    &.window
      background-color #444746
      .login-light__close
        display none
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
      .login-msg
        display flex
        justify-content center
        font-size 0.9375rem
        font-weight normal
        font-style normal
        font-stretch normal
        line-height normal
        letter-spacing normal
        color #ddcf21
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
