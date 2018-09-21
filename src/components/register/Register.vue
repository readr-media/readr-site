<template>
  <div class="register">
    <div class="register-container" v-if="!isRegistered">
      <TextItem class="register-container__input-nickname" type="text"
        :placeHolder="$t('login.WORDING_NICKNAME')"
        :alert.sync="alert.nickname"
        :value.sync="formData.nickname"></TextItem>
      <TextItem class="register-container__input-email" type="text"
        :placeHolder="$t('login.WORDING_EMAIL')"
        :alert.sync="alert.mail"
        :value.sync="formData.mail"></TextItem>
      <TextItem class="register-container__input-pwd" type="password"
        :placeHolder="$t('login.WORDING_PASSWORD')"
        :alert.sync="alert.pwd"
        :value.sync="formData.pwd"></TextItem>
      <TextItem class="register-container__input-pwd-check" type="password"
        :placeHolder="$t('login.WORDING_PASSWORD_CHECK')"
        :alert.sync="alert[ 'pwd-check' ]"
        :value.sync="formData[ 'pwd-check' ]"></TextItem>
      <div class="register-container__notice">
        <span class="notice" v-text="$t('login.WORDING_REGISTER_NOTICE')"></span>
        <router-link to="/agreement" target="_blank" class="agreement" v-text="$t('login.WORDING_MEMBER_AGREEMENT')"></router-link>
      </div>
      <div class="g-recaptcha" :class="{ warn: (!isRecaptchaPassed && isRegisterClicked) }">
        <div id="g-recaptcha"></div>
      </div>
      <div class="register-container__btn" :class="{ disabled: shouldShowSpinner }" @click="register">
        <span v-text="$t('login.WORDING_REGISTER')" v-if="!shouldShowSpinner"></span>
        <Spinner :show="shouldShowSpinner"></Spinner>
      </div>    
    </div>
    <div class="register-container" v-else>
      <div class="register-container__msg" v-text="resMsg">
      </div>
    </div>
  </div>
</template>
<script>
  import TextItem from 'src/components/form/TextItem.vue'
  import Spinner from 'src/components/Spinner.vue'
  import validator from 'validator'
  import { GOOGLE_RECAPTCHA_SITE_KEY, } from 'api/config'
  import { get, } from 'lodash'

  const debug = require('debug')('CLIENT:Register')
  const register = (store, profile, token) => {
    return store.dispatch('REGISTER', {
      params: profile,
      token,
    })
  }

  const verifyRecaptchaToken = (store, token) => {
    return store.dispatch('VERIFY_RECAPTCHA_TOKEN', {
      token,
    })
  }

  export default {
    components: {
      TextItem,
      Spinner,
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
        shouldShowSpinner: false,
      }
    },
    name: 'Register',
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
              password: this.formData.pwd,
            }, get(this.$store, [ 'state', 'register-token', ])).then(({ status, }) => {
              this.isRegistered = true
              this.shouldShowSpinner = false
              if (status === 200) {
                this.resMsg = this.$t('login.WORDING_REGISTER_SUCESSFUL')
              } else {
                this.resMsg = this.$t('login.WORDING_REGISTER_INFAIL')
                window.grecaptcha.reset(this.recaptcha)
              }
            }).catch(({ err, }) => {
              this.shouldShowSpinner = false
              if (err === 'User Already Existed' || err === 'User Duplicated') {
                this.alert.mail = {
                  flag: true,
                  msg: this.$t('login.DUPLICATED_USER'),
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
            msg: this.$t('login.WORDING_REGISTER_NICKNAME_EMPTY'),
          }
          debug('Empty nickname', this.formData.nickname)
        }
        if (!this.formData.mail || !validator.isEmail(this.formData.mail)) {
          pass = false
          this.alert.mail = {
            flag: true,
            msg: this.$t('login.WORDING_REGISTER_EMAIL_VALIDATE_IN_FAIL'),
          }          
          debug('Wrong email', this.formData.mail)
        }
        if (!this.formData.pwd || validator.isEmpty(this.formData.pwd)) {
          pass = false
          this.alert.pwd = {
            flag: true,
            msg: this.$t('login.WORDING_REGISTER_PWD_EMPTY'),
          }          
          debug('Empty password', this.formData.pwd)
        }
        if (!this.formData[ 'pwd-check' ] || validator.isEmpty(this.formData[ 'pwd-check' ])) {
          pass = false
          this.alert[ 'pwd-check' ] = {
            flag: true,
            msg: this.$t('login.WORDING_REGISTER_PWD_CHECK_EMPTY'),
          }          
          debug('Empty password check', this.formData[ 'pwd-check' ])
        }
        if (!this.formData.pwd || !this.formData[ 'pwd-check' ] || this.formData.pwd !== this.formData[ 'pwd-check' ]) {
          this.alert.pwd = {
            flag: true,
            msg: this.$t('login.WORDING_REGISTER_PWD_CHECK_INFAIL'),
          }          
          this.alert[ 'pwd-check' ] = {
            flag: true,
            msg: this.$t('login.WORDING_REGISTER_PWD_CHECK_INFAIL'),
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
        return verifyRecaptchaToken(this.$store, { token: this.recaptchaToken, }).then((response) => {
          this.isRecaptchaPassed = get(response, [ 'success', ], false)
        })
      },
    },
    mounted () {
      if (window.grecaptcha) {
        this.recaptcha = window.grecaptcha.render('g-recaptcha', {
          'sitekey': this.$store.state.GOOGLE_RECAPTCHA_SITE_KEY || GOOGLE_RECAPTCHA_SITE_KEY,
          'callback': (res) => {
            this.recaptchaToken = res
          },
        })
      }
    },
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
      height calc(100% - 2rem)
      padding-bottom 2rem
      color #000
      &__notice
        font-size 0.875rem
        text-align right
        > .agreement
          margin-left 20px
          cursor pointer
      &__btn
        position absolute
        left 0
        width 100%
        height 35px
        background-color #444746
        color #ddcf21
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