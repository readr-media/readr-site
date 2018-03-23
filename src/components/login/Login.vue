<template>
  <div class="login">
    <InputTextItem class="login__input-email" type="text"
      :placeHolder="$t('login.WORDING_EMAIL')"
      :alert.sync="alert.mail"
      :value.sync="formData.mail"></InputTextItem>
    <InputTextItem class="login__input-pwd" type="password"
      :placeHolder="$t('login.WORDING_PASSWORD')"
      :alert.sync="alert.pwd"
      :value.sync="formData.pwd"></InputTextItem>
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
  import { ROLE_MAP, } from 'src/constants'
  import { filter, get, } from 'lodash'
  import InputTextItem from 'src/components/form/InputTextItem.vue'
  import validator from 'validator'

  const debug = require('debug')('CLIENT:Login')
  const login = (store, profile, token) => {
    return store.dispatch('LOGIN', {
      params: {
        email: profile.email,
        password: profile.password,
        keepAlive: profile.keepAlive,
      },
      token,
    })
  }

  export default {
    components: {
      InputTextItem,
    },
    data () {
      return {
        alert: {},
        formData: {},
        resMsg: null,
      }
    },
    name: 'Login',
    methods: {
      goRecoverPwd () {
        this.$emit('goRecoverPwd')
      },
      login () {
        if (this.validatInput()) {
          login(this.$store, {
            email: this.formData.mail,
            password: this.formData.pwd,
            keepAlive: this.$refs[ 'keep-alive' ].checked,
          }, get(this.$store, [ 'state', 'register-token', ])).then((res) => {
            if (res.status === 200) {
              const memberCenter = get(filter(ROLE_MAP, { key: get(this.$store, [ 'state', 'profile', 'role', ]), }), [ 0, 'route', ], 'member')
              if (memberCenter.match(/member/)) {
                location.replace('/')
              } else {
                location.replace(`/${memberCenter}`)
              }
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
      validatInput () {
        let pass = true
        if (!this.formData.mail || !validator.isEmail(this.formData.mail)) {
          pass = false
          this.alert.mail = {
            flag: true,
            msg: this.$t('login.WORDING_REGISTER_EMAIL_VALIDATE_IN_FAIL'),
          }
          debug('Mail wrong', this.formData.mail)
        }
        if (!this.formData.pwd || validator.isEmpty(this.formData.pwd)) {
          pass = false
          this.alert.pwd = {
            flag: true,
            msg: this.$t('login.WORDING_REGISTER_PWD_EMPTY'),
          }
          debug('Empty pwd', this.formData.pwd)
        }
        this.$forceUpdate()
        return pass
      },
    },
    mounted () {},
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
