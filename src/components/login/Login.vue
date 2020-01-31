<template>
  <div
    class="login"
    :class="{ 'dark': theme === 'dark' }"
    @keyup="keyupHandler"
  >
    <TextItem
      class="login__input-email"
      type="text"
      :place-holder="$t('login.WORDING_EMAIL_PLACEHOLDER')"
      :alert.sync="alert.mail"
      :alert-position="panelType === 'WINDOW' && 'bottom'"
      :background-color="theme === 'dark' && 'transparent'"
      :border="theme === 'dark' && 'solid 1px #9b9b9b'"
      :color="theme === 'dark' && '#fff'"
      :value.sync="formData.mail"
    />
    <TextItem
      class="login__input-pwd"
      type="password"
      :place-holder="$t('login.WORDING_PASSWORD')"
      :alert.sync="alert.pwd"
      :alert-position="panelType === 'WINDOW' && 'bottom'"
      :background-color="theme === 'dark' && 'transparent'"
      :border="theme === 'dark' && 'solid 1px #9b9b9b'"
      :color="theme === 'dark' && '#fff'"
      :value.sync="formData.pwd"
    />
    <div class="login__wrapper">
      <div class="keep-login-alive">
        <input
          id="keep-alive"
          ref="keep-alive"
          type="checkbox"
        >
        <label
          for="keep-alive"
          v-text="' ' + $t('login.WORDING_KEEP_ALIVE')"
        />
      </div>
      <div class="forget-pwd">
        <span
          @click="goRecoverPwd"
          v-text="$t('login.WORDING_FORGET_PASSWORD')"
        />
      </div>
    </div>
    <div
      v-if="resMsg"
      class="login__msg"
    >
      <div
        class="content"
        v-text="resMsg"
      />
    </div>
    <div
      class="login__btn"
      @click="login"
    >
      <span v-text="$t('login.WORDING_LOGIN')" />
    </div>
  </div>
</template>
<script>
import { get } from 'lodash'
import TextItem from 'src/components/form/TextItem.vue'
import validator from 'validator'
// import VueCookie from 'vue-cookie'

const debug = require('debug')('CLIENT:Login')
const switchOffLoginAsk = store => store.dispatch('UILoginLightbox/LOGIN_ASK_TOGGLE', { active: false, message: '' })
const login = (store, profile, token) => {
  return store.dispatch('DataUser/LOGIN', {
    params: {
      email: profile.email,
      password: profile.password,
      keepAlive: profile.keepAlive
    },
    token
  })
}

export default {
  name: 'Login',
  components: {
    TextItem
  },
  /* eslint-disable */
  props: {
    theme: {
      default: () => 'normal'
    },
    isDoingLogin: {
      type: Boolean,
      default: false
    },
    panelType: {}
  },
  /* eslint-enable */
  data () {
    return {
      alert: {},
      formData: {},
      resMsg: null
    }
  },
  computed: {
    loginTo () {
      return this.$store.state.UILoginLightbox.loginAskFlag.to
    }
  },
  methods: {
    goRecoverPwd () {
      this.$emit('goRecoverPwd')
    },
    keyupHandler (e) {
      if (e.keyCode === 13) {
        this.login()
      }
    },
    login () {
      if (this.validatInput()) {
        this.$emit('update:isDoingLogin', true)
        login(this.$store, {
          email: this.formData.mail,
          password: this.formData.pwd,
          keepAlive: this.$refs[ 'keep-alive' ].checked
        }, get(this.$store, [ 'state', 'register-token' ])).then((res) => {
          this.$emit('update:isDoingLogin', false)
          if (res.status === 200) {
            const isPublicComment = this.$route.path === '/comment'

            if (this.panelType === 'WINDOW') {
              window.opener.location.reload()
              window.close()
            } else if (isPublicComment) {
              this.$router.push(this.$route.fullPath)
            } else if (this.loginTo) {
              this.$router.push(this.loginTo)
            }

            // revolke switchOffLoginAsk for LoginLight
            switchOffLoginAsk(this.$store)
          } else {
            this.resMsg = this.$t('login.WORDING_LOGIN_INFAIL_VALIDATION_ISSUE')
          }
        }).catch((err) => {
          this.$emit('update:isDoingLogin', false)
          if (err.status === 401) {
            this.resMsg = this.$t('login.WORDING_LOGIN_UNAUTHORIZED')
          }
        })
      }
    },
    validatInput () {
      let pass = true
      if (!this.formData.mail || !validator.isEmail(this.formData.mail)) {
        pass = false
        this.alert.mail = {
          flag: true,
          msg: this.$t('login.WORDING_REGISTER_EMAIL_VALIDATE_IN_FAIL')
        }
        debug('Mail wrong', this.formData.mail)
      }
      if (!this.formData.pwd || validator.isEmpty(this.formData.pwd)) {
        pass = false
        this.alert.pwd = {
          flag: true,
          msg: this.$t('login.WORDING_REGISTER_PWD_EMPTY')
        }
        debug('Empty pwd', this.formData.pwd)
      }
      this.$forceUpdate()
      return pass
    }
  }
}
</script>
<style lang="stylus" scoped>
  .login.dark
    .login__btn
      background-color #ddcf21
      color #000
      // width 400px
      height 35px
      font-size 0.9375rem
      &:hover
        background-color #8c8c8c

    .login__wrapper
      font-weight normal
      font-style normal
      font-stretch normal
      line-height normal
      letter-spacing normal
      text-align right
      color #ffffff
      .keep-login-alive
        > input
          vertical-align middle
          width 13px
          height 13px
  .login
    width 100%
    height 100%
    position relative
    padding-bottom 5px
    color #fff
    &__input-email, &__input-pwd
      margin  0 0 15px
    &__wrapper
      display flex
      justify-content space-between
      font-size .875rem
      .keep-login-alive
        > input
          vertical-align top
          width 15px
          height 15px
    &__msg
      margin 15px 0
      width 100%
      text-align right
      color red
    &__btn
      // position absolute
      // bottom 0
      // left 0
      width 100%
      height 35px
      margin-top 30px
      background-color #444746
      color #ddcf21
      display flex
      justify-content center
      align-items center
      cursor pointer
      &:hover
        background-color #737373
  .forget-pwd
    cursor pointer
</style>
