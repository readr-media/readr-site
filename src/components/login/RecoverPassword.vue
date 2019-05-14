<template>
  <div
    class="recover-password"
    :class="{ 'dark': theme === 'dark' }"
  >
    <TextItem
      v-if="!isSentEmail"
      class="login__input-pwd"
      type="text"
      :place-holder="$t('login.WORDING_EMAIL')"
      :alert.sync="alert.email"
      :background-color="theme === 'dark' && '#444746'"
      :border="theme === 'dark' && 'solid 1px #ffffff'"
      :height="theme === 'dark' && '25px'"
      :color="theme === 'dark' && '#fff'"
      :font-size="theme === 'dark' && '0.9375rem'"
      :value.sync="formData.email"
    />
    <div class="recover-password__desc">
      <span v-text="desc" />
    </div>
    <div
      v-if="!isSentEmail"
      class="recover-password__btn"
      @click="resetPwd"
    >
      <span
        v-if="!shouldShowSpinner"
        v-text="$t('login.WORDING_LOGIN_RESET_PWD')"
      />
      <span
        v-else
        :class="{ disabled: shouldShowSpinner }"
      >
        <Spinner :show="shouldShowSpinner" />
      </span>
    </div>
  </div>
</template>
<script>
import { get } from 'lodash'
import TextItem from 'src/components/form/TextItem.vue'
import Spinner from 'src/components/Spinner.vue'
import validator from 'validator'

const debug = require('debug')('CLIENT:RecoverPassword')
const sendResetEmail = (store, params, token) => {
  return store.dispatch('RESET_PWD_EMAIL', {
    params,
    token
  })
}

export default {
  name: 'RecoverPassword',
  components: {
    TextItem,
    Spinner
  },
  /* eslint-disable */
  props: {
    theme: {
      default: () => 'normal'
    }
  },
  /* eslint-enable */
  data () {
    return {
      alert: {},
      formData: {},
      isSentEmail: false,
      shouldShowSpinner: false
    }
  },
  computed: {
    desc () {
      return !this.isSentEmail
        ? this.$t('login.WORDING_LOGIN_PLEASE_ENTER_YOUR_REGISTERED_EMAIL')
        : this.$t('login.WORDING_LOGIN_RESET_PWD_SUCCESSFULLY')
    }
  },
  mounted () {},
  methods: {
    resetPwd () {
      if (this.shouldShowSpinner) { return }
      if (this.validate()) {
        debug('abt to send reset email')
        this.shouldShowSpinner = true
        sendResetEmail(this.$store, {
          email: this.formData.email
        }, get(this.$store, [ 'state', 'register-token' ])).then((res) => {
          this.shouldShowSpinner = false
          debug('res:')
          debug(res)
          if (res.status === 200) {
            this.isSentEmail = true
          } else {
            this.alert.email = {
              flag: true,
              msg: this.$t('login.WORDING_LOGIN_UNAUTHORIZED')
            }
          }
        }).catch(err => {
          debug('err:')
          debug(err)
          this.shouldShowSpinner = false
          this.alert.email = {
            flag: true,
            msg: this.$t('login.WORDING_LOGIN_UNAUTHORIZED')
          }
        })
      }
    },
    setInputValue (key, value) {
      switch (key) {
        case 'email':
          this.formData.email = value
          break
      }
    },
    validate () {
      let pass = true
      this.alertFlags = {}
      this.alertMsgs = {}
      if (!this.formData.email || !validator.isEmail(this.formData.email)) {
        pass = false
        this.alert.email = {
          flag: true,
          msg: this.$t('login.WORDING_LOGIN_INVALID_EMAIL_FORMAT')
        }
        debug('MAIL WRONG')
        debug('>>>', this.formData.email)
      }
      this.$forceUpdate()
      return pass
    }
  }
}
</script>
<style lang="stylus" scoped>
  .recover-password.dark
    color #fff
    font-size 0.9375rem
    .recover-password__btn
      > span
        color #000
        background-color #ddcf21
        &:hover
          background-color #737373

  .recover-password
    div
      margin 15px 0
    &__desc
      font-size 0.9rem
    &__btn
      display flex
      justify-content flex-end
      > span
        background-color #444746
        color #ddcf21
        cursor pointer
        height 35px
        width 100px
        display flex
        justify-content center
        align-items center
        &:hover
          background-color #737373
        &.disabled
          background-color #c5c5c5
          color #a5a5a5
</style>
