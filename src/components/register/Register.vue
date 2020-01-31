<template>
  <div class="register">
    <div
      v-if="!isRegistered"
      class="register-container"
    >
      <TextItem
        class="register-container__input-nickname"
        type="text"
        :place-holder="$t('login.WORDING_NICKNAME')"
        :alert.sync="alert.nickname"
        :background-color="'transparent'"
        :border="'solid 1px #9b9b9b'"
        :color="'#fff'"
        :value.sync="formData.nickname"
      />
      <TextItem
        class="register-container__input-email"
        type="text"
        :place-holder="$t('login.WORDING_EMAIL')"
        :alert.sync="alert.mail"
        :background-color="'transparent'"
        :border="'solid 1px #9b9b9b'"
        :color="'#fff'"
        :value.sync="formData.mail"
      />
      <TextItem
        class="register-container__input-pwd"
        type="password"
        :place-holder="$t('login.WORDING_PASSWORD')"
        :alert.sync="alert.pwd"
        :background-color="'transparent'"
        :border="'solid 1px #9b9b9b'"
        :color="'#fff'"
        :value.sync="formData.pwd"
      />
      <TextItem
        class="register-container__input-pwd-check"
        type="password"
        :place-holder="$t('login.WORDING_PASSWORD_CHECK')"
        :alert.sync="alert[ 'pwd-check' ]"
        :background-color="'transparent'"
        :border="'solid 1px #9b9b9b'"
        :color="'#fff'"
        :value.sync="formData[ 'pwd-check' ]"
      />
      <div class="register-container__notice">
        <span
          class="notice"
          v-text="$t('login.WORDING_REGISTER_NOTICE')"
        />
        <router-link
          to="/agreement"
          target="_blank"
          class="agreement"
          v-text="$t('login.WORDING_MEMBER_AGREEMENT')"
        />
      </div>
      <div
        class="g-recaptcha"
        :class="{ warn: (!isRecaptchaPassed && isRegisterClicked) }"
      >
        <div id="g-recaptcha" />
      </div>
      <div
        class="register-container__btn"
        :class="{ disabled: shouldShowSpinner }"
        @click="register"
      >
        <span
          v-if="!shouldShowSpinner"
          v-text="$t('login.WORDING_REGISTER')"
        />
        <Spinner :show="shouldShowSpinner" />
      </div>
    </div>
    <div
      v-else
      class="register-container"
    >
      <div
        class="register-container__msg"
        v-text="resMsg"
      />
    </div>
  </div>
</template>
<script>
import TextItem from 'src/components/form/TextItem.vue'
import Spinner from 'src/components/Spinner.vue'
import validator from 'validator'
import { GOOGLE_RECAPTCHA_SITE_KEY } from 'api/config'
import { get } from 'lodash'

const debug = require('debug')('CLIENT:Register')
const register = (store, profile, token) => {
  return store.dispatch('REGISTER', {
    params: profile,
    token
  })
}

const verifyRecaptchaToken = (store, token) => {
  return store.dispatch('VERIFY_RECAPTCHA_TOKEN', {
    token
  })
}

export default {
  name: 'Register',
  components: {
    TextItem,
    Spinner
  },
  data () {
    return {
      alert: {},
      formData: {},
      isRegistered: false,
      isRegisterClicked: false,
      isRecaptchaPassed: false,
      resMsg: '',
      recaptcha: {},
      recaptchaToken: '',
      shouldShowSpinner: false
    }
  },
  mounted () {
    if (window.grecaptcha) {
      this.recaptcha = window.grecaptcha.render('g-recaptcha', {
        'sitekey': this.$store.state.GOOGLE_RECAPTCHA_SITE_KEY || GOOGLE_RECAPTCHA_SITE_KEY,
        'callback': (res) => {
          this.recaptchaToken = res
        }
      })
    }
  },
  methods: {
    register () {
      if (this.shouldShowSpinner) { return }
      this.verifyRecaptchaToken().then(() => {
        if (this.isRecaptchaPassed && this.validatInput()) {
          this.shouldShowSpinner = true
          debug('Abt to send req of register.')
          register(this.$store, {
            nickname: this.formData.nickname,
            email: this.formData.mail,
            password: this.formData.pwd }, get(this.$store, [ 'state', 'register-token' ]))
            .then(({ status }) => {
              this.isRegistered = true
              this.shouldShowSpinner = false
              if (status === 200) {
                this.resMsg = this.$t('login.WORDING_REGISTER_SUCESSFUL')
              } else {
                this.resMsg = this.$t('login.WORDING_REGISTER_INFAIL')
                window.grecaptcha.reset(this.recaptcha)
              }
            }).catch(({ err: error, mode }) => {
              this.shouldShowSpinner = false
              if (error === 'User Already Existed' || error === 'User Duplicated') {
                let message = this.$t('login.WORDING_REGISTER_INFAIL_DUPLICATED')
                switch (mode) {
                  case 'oauth-fb': {
                    message = this.$t('login.WORDING_REGISTER_INFAIL_DUPLICATED_WITH_FACEBOOK')
                    break
                  }
                  case 'oauth-goo': {
                    message = this.$t('login.WORDING_REGISTER_INFAIL_DUPLICATED_WITH_G_PLUS')
                    break
                  }
                }
                this.alert.mail = {
                  flag: true,
                  msg: message
                }
                this.$forceUpdate()
              } else {
                this.resMsg = this.$t('login.WORDING_REGISTER_INFAIL')
              }
              window.grecaptcha.reset(this.recaptcha)
            })
        }
      })
    },
    validatInput () {
      let pass = true
      if (!this.formData.nickname || validator.isEmpty(this.formData.nickname)) {
        pass = false
        this.alert.nickname = {
          flag: true,
          msg: this.$t('login.WORDING_REGISTER_NICKNAME_EMPTY')
        }
        debug('Empty nickname', this.formData.nickname)
      }
      if (!this.formData.mail || !validator.isEmail(this.formData.mail)) {
        pass = false
        this.alert.mail = {
          flag: true,
          msg: this.$t('login.WORDING_REGISTER_EMAIL_VALIDATE_IN_FAIL')
        }
        debug('Wrong email', this.formData.mail)
      }
      if (!this.formData.pwd || validator.isEmpty(this.formData.pwd)) {
        pass = false
        this.alert.pwd = {
          flag: true,
          msg: this.$t('login.WORDING_REGISTER_PWD_EMPTY')
        }
        debug('Empty password', this.formData.pwd)
      }
      if (!this.formData[ 'pwd-check' ] || validator.isEmpty(this.formData[ 'pwd-check' ])) {
        pass = false
        this.alert[ 'pwd-check' ] = {
          flag: true,
          msg: this.$t('login.WORDING_REGISTER_PWD_CHECK_EMPTY')
        }
        debug('Empty password check', this.formData[ 'pwd-check' ])
      }
      if (!this.formData.pwd || !this.formData[ 'pwd-check' ] || this.formData.pwd !== this.formData[ 'pwd-check' ]) {
        this.alert.pwd = {
          flag: true,
          msg: this.$t('login.WORDING_REGISTER_PWD_CHECK_INFAIL')
        }
        this.alert[ 'pwd-check' ] = {
          flag: true,
          msg: this.$t('login.WORDING_REGISTER_PWD_CHECK_INFAIL')
        }
        debug('Password is not the same as password-check', this.formData.pwd, this.formData[ 'pwd-check' ])
        pass = false
      }
      this.$forceUpdate()
      if (!pass) {
        window.grecaptcha.reset(this.recaptcha)
      }
      return pass
    },
    verifyRecaptchaToken () {
      return verifyRecaptchaToken(this.$store, { token: this.recaptchaToken }).then((response) => {
        this.isRecaptchaPassed = get(response, [ 'success' ], false)
      })
    }
  }
}
</script>
<style lang="stylus" scoped>
  .register
    height 100%
    width 100%
    position relative
    .register-container
      &__input-nickname, &__input-email, &__input-pwd, &__input-pwd-check
        margin 15px 0
      width 100%
      padding-bottom 40px
      color #fff
      &__notice
        font-size 0.875rem
        text-align right
        > .agreement
          margin-left 1em
          color #11b8c9
          cursor pointer
      &__btn
        position absolute
        left 0
        width 100%
        height 35px
        background-color #ddcf21
        color #444746
        display flex
        justify-content center
        align-items center
        cursor pointer
        &.disabled
          background-color #c5c5c5
          color #a5a5a5
        &:hover
          background-color #737373

      .g-recaptcha
        margin 15px 0
        display flex
        justify-content center
        align-items center
        position relative
        &::before, &::after
          display none
        // &.warn
        //   animation wran linear 2s
        //   &::before
        //     content ''
        //     border-width 7.5px 17.5px 7.5px 0
        //     border-color transparent rgba(0, 0, 0, 0.4) transparent transparent
        //     border-style solid
        //     position absolute
        //     left -17.5px
        //     top 8.5px
        //     display block
        //   &::after
        //     content ''
        //     border-width 7.5px 17.5px 7.5px 0
        //     border-color transparent #ddcf21 transparent transparent
        //     border-style solid
        //     position absolute
        //     left -17.5px
        //     top 7.5px
        //     display block
  @keyframes wran
    0%
      border 5px solid #ddcf21
    100%
      border 5px solid #ddcf21
</style>
