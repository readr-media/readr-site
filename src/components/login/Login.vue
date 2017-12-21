<template>
  <div class="login">
    <InputItem class="login__input-email" type="text" :placeHolder="wording.WORDING_EMAIL" inputKey="mail" v-on:filled="setInputValue" v-on:inputFocus="resetAllAlertShow" v-on:inputFocusOut="resetAlertShow" v-on:removeAlert="removeAlert" :alertFlag="alertFlags.mail" :alertMsg="alertMsgs.mail" :alertMsgShow="alertMsgShow.mail"></InputItem>
    <InputItem class="login__input-pwd" type="password" :placeHolder="wording.WORDING_PASSWORD" inputKey="pwd" v-on:filled="setInputValue" v-on:inputFocus="resetAllAlertShow" v-on:inputFocusOut="resetAlertShow" v-on:removeAlert="removeAlert" :alertFlag="alertFlags.pwd" :alertMsg="alertMsgs.pwd" :alertMsgShow="alertMsgShow.pwd"></InputItem>
    <div class="login__wrapper">
      <div class="keep-login-alive">
        <input type="checkbox" id="keep-alive" ref="keep-alive">
        <label for="keep-alive" v-text="' ' + wording.WORDING_KEEP_ALIVE"></label>
      </div>
      <div class="forget-pwd">
        <span v-text="wording.WORDING_FORGET_PASSWORD"></span>
      </div>
    </div>
    <div class="login__btn" @click="login">
      <span v-text="wording.WORDING_LOGIN"></span>
    </div>
  </div>
</template>
<script>
  import { WORDING_EMAIL, WORDING_FORGET_PASSWORD, WORDING_KEEP_ALIVE, WORDING_LOGIN, WORDING_LOGIN_INFAIL_VALIDATION_ISSUE, WORDING_PASSWORD, WORDING_REGISTER_EMAIL_VALIDATE_IN_FAIL, WORDING_REGISTER_PWD_EMPTY } from '../../constants'
  import { consoleLogOnDev } from '../../util/comm'
  import InputItem from '../form/InputItem.vue'
  import validator from 'validator'

  const login = (store, profile, token) => {
    return store.dispatch('LOGIN', {
      params: {
        email: profile.email,
        password: profile.password,
        keepAlive: profile.keepAlive
      },
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
        wording: {
          WORDING_LOGIN,
          WORDING_LOGIN_INFAIL_VALIDATION_ISSUE,
          WORDING_PASSWORD,
          WORDING_EMAIL,
          WORDING_KEEP_ALIVE,
          WORDING_FORGET_PASSWORD,
          WORDING_REGISTER_EMAIL_VALIDATE_IN_FAIL,
          WORDING_REGISTER_PWD_EMPTY
        }
      }
    },
    name: 'login',
    methods: {
      login () {
        if (this.validatInput()) {
          login(this.$store, {
            email: this.formData.mail,
            password:this.formData.pwd,
            keepAlive: this.$refs[ 'keep-alive' ].checked
          }, _.get(this.$store, [ 'state', 'register-token' ])).then((res) => {
            if (res.status === 200) {
              location.replace('/')
            } else {
            }
          })
        }
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
      setInputValue (key, value) {
        switch (key) {
          case 'mail':
            this.formData.mail = value
            break
          case 'pwd':
            this.formData.pwd = value
            break
        }
      },
      validatInput () {
        let pass = true
        this.alertFlags = {}
        this.alertMsgs = {}
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
        this.$forceUpdate()
        return pass
      }
    },
    mounted () {}
  }
</script>
<style lang="stylus" scoped>
  .login
    width 100%
    height 100%
    position relative
    padding-bottom 2rem
    color #000
    &__wrapper
      display flex
      justify-content space-between
      font-size 0.625rem
    &__btn
      position absolute
      bottom 0
      left 0
      width 300px
      height 35px
      background-color #444746
      color #ddcf21
      display flex
      justify-content center
      align-items center
      cursor pointer
</style>
