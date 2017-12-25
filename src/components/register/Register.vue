<template>
  <div class="register">
    <div class="register-container" v-if="!isRegistered">
      <InputItem class="register-container__input-nickname" type="text" :placeHolder="wording.WORDING_NICKNAME" inputKey="nickname" v-on:filled="setInputValue" v-on:inputFocus="resetAllAlertShow" v-on:inputFocusOut="resetAlertShow" v-on:removeAlert="removeAlert" :alertFlag="alertFlags.nickname" :alertMsg="alertMsgs.nickname" :alertMsgShow="alertMsgShow.nickname"></InputItem>
      <InputItem class="register-container__input-email" type="text" :placeHolder="wording.WORDING_EMAIL" inputKey="mail" v-on:filled="setInputValue" v-on:inputFocus="resetAllAlertShow" v-on:inputFocusOut="resetAlertShow" v-on:removeAlert="removeAlert" :alertFlag="alertFlags.mail" :alertMsg="alertMsgs.mail" :alertMsgShow="alertMsgShow.mail"></InputItem>
      <InputItem class="register-container__input-pwd" type="password" :placeHolder="wording.WORDING_PASSWORD" inputKey="pwd" v-on:filled="setInputValue" v-on:inputFocus="resetAllAlertShow" v-on:inputFocusOut="resetAlertShow" v-on:removeAlert="removeAlert" :alertFlag="alertFlags.pwd" :alertMsg="alertMsgs.pwd" :alertMsgShow="alertMsgShow.pwd"></InputItem>
      <InputItem class="register-container__input-pwd-check" type="password" :placeHolder="wording.WORDING_PASSWORD_CHECK" inputKey="pwd-check" v-on:filled="setInputValue" v-on:inputFocus="resetAllAlertShow" v-on:inputFocusOut="resetAlertShow" v-on:removeAlert="removeAlert" :alertFlag="alertFlags[ 'pwd-check' ]" :alertMsg="alertMsgs[ 'pwd-check' ]" :alertMsgShow="alertMsgShow[ 'pwd-check' ]"></InputItem>
      <div class="register-container__notice">
        <span class="notice" v-text="wording.WORDING_REGISTER_NOTICE"></span>
        <span class="agreement" v-text="wording.WORDING_MEMBER_AGREEMENT"></span>
      </div>
      <div class="g-recaptcha" :class="{ warn: (!isRecaptchaPassed && isRegisterClicked) }">
        <div id="g-recaptcha"></div>
      </div>
      <div class="register-container__btn" @click="register">
        <span v-text="wording.WORDING_REGISTER"></span>
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
  import { WORDING_EMAIL, WORDING_MEMBER_AGREEMENT, WORDING_NICKNAME, WORDING_PASSWORD, WORDING_PASSWORD_CHECK, WORDING_REGISTER, WORDING_REGISTER_NOTICE, WORDING_REGISTER_SUCESSFUL, WORDING_REGISTER_INFAIL, WORDING_REGISTER_INFAIL_DUPLICATED } from '../../constants'
  import { WORDING_REGISTER_NICKNAME_EMPTY, WORDING_REGISTER_EMAIL_VALIDATE_IN_FAIL, WORDING_REGISTER_PWD_EMPTY, WORDING_REGISTER_PWD_CHECK_EMPTY, WORDING_REGISTER_PWD_CHECK_INFAIL } from '../../constants'
  import { GOOGLE_RECAPTCHA_SITE_KEY } from '../../../api/config'
  import { consoleLogOnDev } from '../../util/comm'
  import InputItem from '../form/InputItem.vue'
  import validator from 'validator'

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
    components: {
      InputItem
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
        wording: {
          WORDING_EMAIL,
          WORDING_MEMBER_AGREEMENT,
          WORDING_NICKNAME,
          WORDING_REGISTER,
          WORDING_REGISTER_NICKNAME_EMPTY,
          WORDING_REGISTER_NOTICE,
          WORDING_PASSWORD,
          WORDING_PASSWORD_CHECK,
          WORDING_REGISTER_SUCESSFUL,
          WORDING_REGISTER_INFAIL,
          WORDING_REGISTER_INFAIL_DUPLICATED,
          WORDING_REGISTER_EMAIL_VALIDATE_IN_FAIL,
          WORDING_REGISTER_PWD_EMPTY,
          WORDING_REGISTER_PWD_CHECK_EMPTY,
          WORDING_REGISTER_PWD_CHECK_INFAIL
        }
      }
    },
    name: 'register',
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
        this.verifyRecaptchaToken().then((response) => {
          // console.log(this.isRecaptchaPassed)
          if (this.isRecaptchaPassed && this.validatInput()) {
            register(this.$store, {
              nickname: this.formData.nickname,
              email: this.formData.mail,
              password: this.formData.pwd
            }, _.get(this.$store, [ 'state', 'register-token' ])).then(({ status, err }) => {
              this.isRegistered = true
              if (status === 200) {
                this.resMsg = this.wording.WORDING_REGISTER_SUCESSFUL
              } else {
                this.resMsg = this.wording.WORDING_REGISTER_INFAIL
                window.grecaptcha.reset(this.recaptcha)
              }
            }).catch(({ status, err }) => {
              if (err === 'User Already Existed') {
                this.alertFlags.mail = true
                this.alertMsgs.mail = this.wording.WORDING_REGISTER_INFAIL_DUPLICATED
                this.$forceUpdate()
              } else {
                this.resMsg = this.wording.WORDING_REGISTER_INFAIL
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
          this.alertMsgs.nickname = this.wording.WORDING_REGISTER_NICKNAME_EMPTY
          consoleLogOnDev({ msg: 'nickname empty, ' + this.formData.nickname })
        }
        if (!this.formData.mail || !validator.isEmail(this.formData.mail)) {
          pass = false
          this.alertFlags.mail = true
          this.alertMsgs.mail = this.wording.WORDING_REGISTER_EMAIL_VALIDATE_IN_FAIL
          consoleLogOnDev({ msg: 'mail wrong, ' + this.formData.mail })
        }
        if (!this.formData.pwd || validator.isEmpty(this.formData.pwd)) {
          pass = false
          this.alertFlags.pwd = true
          this.alertMsgs.pwd = this.wording.WORDING_REGISTER_PWD_EMPTY
          consoleLogOnDev({ msg: 'pwd empty, ' + this.formData.pwd })
        }
        if (!this.formData[ 'pwd-check' ] || validator.isEmpty(this.formData[ 'pwd-check' ])) {
          pass = false
          this.alertFlags[ 'pwd-check' ] = true
          this.alertMsgs[ 'pwd-check' ] = this.wording.WORDING_REGISTER_PWD_CHECK_EMPTY
          consoleLogOnDev({ msg: 'pwd-check empty, ' + this.formData[ 'pwd-check' ] })
        }
        if (!this.formData.pwd || !this.formData[ 'pwd-check' ] || this.formData.pwd !== this.formData[ 'pwd-check' ]) {
          consoleLogOnDev({ msg: 'pwd != pwd check, ' + this.formData.pwd + ',' + this.formData[ 'pwd-check' ] })
          this.alertFlags.pwd = true
          this.alertMsgs.pwd = this.wording.WORDING_REGISTER_PWD_CHECK_INFAIL
          this.alertFlags[ 'pwd-check' ] = true
          this.alertMsgs[ 'pwd-check' ] = this.wording.WORDING_REGISTER_PWD_CHECK_INFAIL
          pass = false
        }
        this.$forceUpdate()
        if (!pass) {
          window.grecaptcha.reset(this.recaptcha)
        }
        return pass
      },
      verifyRecaptchaToken () {
        // console.log('this.recaptchaToken', this.recaptchaToken)
        return verifyRecaptchaToken(this.$store, { token: this.recaptchaToken }).then((response) => {
          // console.log('response', response)
          this.isRecaptchaPassed = _.get(response, [ 'success' ], false)
        })
      }
    },
    mounted () {
      if (window.grecaptcha) {
        this.recaptcha = window.grecaptcha.render('g-recaptcha', {
          'sitekey': GOOGLE_RECAPTCHA_SITE_KEY,
          'callback': (res) => {
            this.recaptchaToken = res
            // console.log('this.recaptchaToken', this.recaptchaToken)
            // this.verifyRecaptchaToken()
          }
        })
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .register
    height 100%
    
    .register-container
      width 100%
      height calc(100% - 2rem)
      padding-bottom 2rem
      color #000
      &__notice
        font-size 0.625rem
        text-align right
        > .agreement
          margin-left 20px
          cursor pointer
      &__btn
        position absolute
        bottom 6px
        left 0
        width 300px
        height 35px
        background-color #444746
        color #ddcf21
        display flex
        justify-content center
        align-items center
        cursor pointer

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