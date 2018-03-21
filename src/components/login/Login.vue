<template>
  <div class="login">
    <InputItem class="login__input-email" type="text"
      inputKey="mail"
      v-on:filled="setInputValue"
      v-on:inputFocus="resetAllAlertShow"
      v-on:inputFocusOut="resetAlertShow"
      v-on:removeAlert="removeAlert"
      :placeHolder="$t('login.WORDING_EMAIL')"
      :alertFlag="alertFlags.mail"
      :alertMsg="alertMsgs.mail"
      :alertMsgShow="alertMsgShow.mail"></InputItem>
    <InputItem class="login__input-pwd" type="password"
      inputKey="pwd"
      v-on:filled="setInputValue"
      v-on:inputFocus="resetAllAlertShow"
      v-on:inputFocusOut="resetAlertShow"
      v-on:removeAlert="removeAlert"
      :placeHolder="$t('login.WORDING_PASSWORD')"
      :alertFlag="alertFlags.pwd"
      :alertMsg="alertMsgs.pwd"
      :alertMsgShow="alertMsgShow.pwd"></InputItem>
    <div class="login__wrapper">
      <div class="keep-login-alive">
        <input type="checkbox" id="keep-alive" ref="keep-alive">
        <label for="keep-alive" v-text="' ' + $t('login.WORDING_KEEP_ALIVE')"></label>
      </div>
      <div class="forget-pwd">
        <span v-text="$t('login.WORDING_FORGET_PASSWORD')" @click="goRecoverPwd"></span>
      </div>
    </div>
    <div class="login__msg">
      <div class='content' v-text="resMsg"></div>
    </div>
    <div class="login__btn" @click="login">
      <span v-text="$t('login.WORDING_LOGIN')"></span>
    </div>
  </div>
</template>
<script>
  import _ from 'lodash'
  import { ROLE_MAP } from 'src/constants'
  import { consoleLogOnDev } from 'src/util/comm'
  import InputItem from 'src/components/form/InputItem.vue'
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
        resMsg: null
      }
    },
    name: 'login',
    methods: {
      goRecoverPwd () {
        this.$emit('goRecoverPwd')
      },
      login () {
        if (this.validatInput()) {
          login(this.$store, {
            email: this.formData.mail,
            password: this.formData.pwd,
            keepAlive: this.$refs[ 'keep-alive' ].checked
          }, _.get(this.$store, [ 'state', 'register-token' ])).then((res) => {
            if (res.status === 200) {
              const memberCenter = _.get(_.filter(ROLE_MAP, { key: _.get(this.$store, [ 'state', 'profile', 'role' ]) }), [ 0, 'route' ], 'member')
              if (memberCenter.match(/member/)) {
                location.replace('/')
              } else {
                location.replace(`/${memberCenter}`)
              }
              // this.$router.replace(`/${memberCenter}`)
            } else {
              this.resMsg = this.$t('login.WORDING_LOGIN_INFAIL_VALIDATION_ISSUE')
            }
          }).catch((err) => {
            if (err.status === 401) {
              this.resMsg = this.$t('login.WORDING_LOGIN_UNAUTHORIZED')
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
          this.alertMsgs.mail = this.$t('login.WORDING_REGISTER_EMAIL_VALIDATE_IN_FAIL')
          consoleLogOnDev({ msg: 'mail wrong, ' + this.formData.mail })
        }
        if (!this.formData.pwd || validator.isEmpty(this.formData.pwd)) {
          pass = false
          this.alertFlags.pwd = true
          this.alertMsgs.pwd = this.$t('login.WORDING_REGISTER_PWD_EMPTY')
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
    &__input-email, &__input-pwd
      margin 15px 0
    &__wrapper
      display flex
      justify-content space-between
      font-size 0.875rem
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
      position absolute
      bottom 0
      left 0
      width 100%
      height 35px
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
