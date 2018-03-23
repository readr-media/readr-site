<template>
  <div class="register">
    <div class="register-container" v-if="!isRegistered">
      <InputItem class="register-container__input-nickname" type="text"
        inputKey="nickname"
        v-on:filled="setInputValue"
        v-on:inputFocus="resetAllAlertShow"
        v-on:inputFocusOut="resetAlertShow"
        v-on:removeAlert="removeAlert"
        :placeHolder="$t('login.WORDING_NICKNAME')"
        :alertFlag="alertFlags.nickname"
        :alertMsg="alertMsgs.nickname"
        :alertMsgShow="alertMsgShow.nickname"></InputItem>
      <InputItem class="register-container__input-email" type="text"
        inputKey="mail"
        v-on:filled="setInputValue"
        v-on:inputFocus="resetAllAlertShow"
        v-on:inputFocusOut="resetAlertShow"
        v-on:removeAlert="removeAlert"
        :placeHolder="$t('login.WORDING_EMAIL')"
        :alertFlag="alertFlags.mail"
        :alertMsg="alertMsgs.mail"
        :alertMsgShow="alertMsgShow.mail"></InputItem>
      <InputItem class="register-container__input-pwd" type="password"
        inputKey="pwd"
        v-on:filled="setInputValue"
        v-on:inputFocus="resetAllAlertShow"
        v-on:inputFocusOut="resetAlertShow"
        v-on:removeAlert="removeAlert"
        :placeHolder="$t('login.WORDING_PASSWORD')"
        :alertFlag="alertFlags.pwd"
        :alertMsg="alertMsgs.pwd"
        :alertMsgShow="alertMsgShow.pwd"></InputItem>
      <InputItem class="register-container__input-pwd-check" type="password"
        inputKey="pwd-check"
        v-on:filled="setInputValue"
        v-on:inputFocus="resetAllAlertShow"
        v-on:inputFocusOut="resetAlertShow"
        v-on:removeAlert="removeAlert"
        :placeHolder="$t('login.WORDING_PASSWORD_CHECK')"
        :alertFlag="alertFlags[ 'pwd-check' ]"
        :alertMsg="alertMsgs[ 'pwd-check' ]"
        :alertMsgShow="alertMsgShow[ 'pwd-check' ]"></InputItem>
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
  import _ from 'lodash'
  import InputItem from 'src/components/form/InputItem.vue'
  import Spinner from 'src/components/Spinner.vue'
  import validator from 'validator'
  import config from 'api/config'
  import { consoleLogOnDev, } from 'src/util/comm'

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
      InputItem,
      Spinner,
    },
    data () {
      return {
        alertFlags: {},
        alertMsgs: {},
        alertMsgShow: {},
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
      setInputValue (key, value) {
        switch (key) {
          case 'nickname':
            this.formData.nickname = value
            break
          case 'mail':
            this.formData.mail = value
            break
          case 'pwd':
            this.formData.pwd = value
            break
          case 'pwd-check':
            this.formData[ 'pwd-check' ] = value
            break
        }
      },
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
            }, _.get(this.$store, [ 'state', 'register-token', ])).then(({ status, }) => {
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
              if (err === 'User Already Existed') {
                this.alertFlags.mail = true
                this.alertMsgs.mail = this.$t('login.WORDING_REGISTER_INFAIL_DUPLICATED')
                this.$forceUpdate()
              } else {
                this.resMsg = this.$t('login.WORDING_REGISTER_INFAIL')
                window.grecaptcha.reset(this.recaptcha)
              }
            })
          }
        })
      },
      resetAllAlertShow (excluding) {
        this.alertMsgShow = {}
        this.alertMsgShow[ excluding ] = true
        this.$forceUpdate()
      },
      resetAlertShow (target) {
        this.alertMsgShow[ target ] = false
        this.$forceUpdate()
      },
      removeAlert (target) {
        this.alertFlags[ target ] = false
        this.$forceUpdate()
      },
      validatInput () {
        let pass = true
        this.alertFlags = {}
        this.alertMsgs = {}
        if (!this.formData.nickname || validator.isEmpty(this.formData.nickname)) {
          pass = false
          this.alertFlags.nickname = true
          this.alertMsgs.nickname = this.$t('login.WORDING_REGISTER_NICKNAME_EMPTY')
          consoleLogOnDev({ msg: 'nickname empty, ' + this.formData.nickname, })
        }
        if (!this.formData.mail || !validator.isEmail(this.formData.mail)) {
          pass = false
          this.alertFlags.mail = true
          this.alertMsgs.mail = this.$t('login.WORDING_REGISTER_EMAIL_VALIDATE_IN_FAIL')
          consoleLogOnDev({ msg: 'mail wrong, ' + this.formData.mail, })
        }
        if (!this.formData.pwd || validator.isEmpty(this.formData.pwd)) {
          pass = false
          this.alertFlags.pwd = true
          this.alertMsgs.pwd = this.$t('login.WORDING_REGISTER_PWD_EMPTY')
          consoleLogOnDev({ msg: 'pwd empty, ' + this.formData.pwd, })
        }
        if (!this.formData[ 'pwd-check' ] || validator.isEmpty(this.formData[ 'pwd-check' ])) {
          pass = false
          this.alertFlags[ 'pwd-check' ] = true
          this.alertMsgs[ 'pwd-check' ] = this.$t('login.WORDING_REGISTER_PWD_CHECK_EMPTY')
          consoleLogOnDev({ msg: 'pwd-check empty, ' + this.formData[ 'pwd-check' ], })
        }
        if (!this.formData.pwd || !this.formData[ 'pwd-check' ] || this.formData.pwd !== this.formData[ 'pwd-check' ]) {
          consoleLogOnDev({ msg: 'pwd != pwd check, ' + this.formData.pwd + ',' + this.formData[ 'pwd-check' ], })
          this.alertFlags.pwd = true
          this.alertMsgs.pwd = this.$t('login.WORDING_REGISTER_PWD_CHECK_INFAIL')
          this.alertFlags[ 'pwd-check' ] = true
          this.alertMsgs[ 'pwd-check' ] = this.$t('login.WORDING_REGISTER_PWD_CHECK_INFAIL')
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
          this.isRecaptchaPassed = _.get(response, [ 'success', ], false)
        })
      },
    },
    mounted () {
      if (window.grecaptcha) {
        this.recaptcha = window.grecaptcha.render('g-recaptcha', {
          'sitekey': config.GOOGLE_RECAPTCHA_SITE_KEY,
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