<template>
  <div class="recover-password">
    <InputItem type="text" class="recover-password__input-email" v-if="!isSentEmail"
      @inputFocus="resetAllAlertShow"
      @inputFocusOut="resetAlertShow"
      @removeAlert="removeAlert"
      @filled="setInputValue"
      :placeHolder="$t('login.WORDING_EMAIL')" inputKey="email"
      :alertFlag="alertFlags.email"
      :alertMsg="alertMsgs.email"
      :alertMsgShow="alertMsgShow.email"></InputItem>
    <div class="recover-password__desc">
      <span v-text="desc"></span>
    </div>
    <div class="recover-password__btn" @click="resetPwd" v-if="!isSentEmail">
      <span v-text="$t('login.WORDING_LOGIN_RESET_PWD')" v-if="!shouldShowSpinner"></span>
      <span v-else :class="{ disabled: shouldShowSpinner }">
        <Spinner :show="shouldShowSpinner"></Spinner>
      </span>
    </div>
  </div>
</template>
<script>
  import _ from 'lodash'
  import InputItem from 'src/components/form/InputItem.vue'
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
      InputItem,
      Spinner
    },
    computed: {
      desc () {
        return !this.isSentEmail
          ? this.$t('login.WORDING_LOGIN_PLEASE_ENTER_YOUR_REGISTERED_EMAIL')
          : this.$t('login.WORDING_LOGIN_RESET_PWD_SUCCESSFULLY')
      }
    },
    data () {
      return {
        alertFlags: {},
        alertMsgs: {},
        alertMsgShow: {},
        formData: {},
        isSentEmail: false,
        shouldShowSpinner: false
      }
    },
    methods: {
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
      resetPwd () {
        if (this.shouldShowSpinner) { return }
        if (this.validate()) {
          debug('abt to send reset email')
          this.shouldShowSpinner = true
          sendResetEmail(this.$store, {
            email: this.formData.email
          }, _.get(this.$store, [ 'state', 'register-token' ])).then((res) => {
            this.shouldShowSpinner = false
            debug('res:')
            debug(res)
            if (res.status === 200) {
              this.isSentEmail = true
            } else {
              this.alertFlags.email = true
              this.alertMsgs.email = this.$t('login.WORDING_LOGIN_UNAUTHORIZED')
            }
          }).catch(err => {
            debug('err:')
            debug(err)
            this.shouldShowSpinner = false
            this.alertFlags.email = true
            this.alertMsgs.email = this.$t('login.WORDING_LOGIN_UNAUTHORIZED')
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
          this.alertFlags.email = true
          this.alertMsgs.email = this.$t('login.WORDING_LOGIN_INVALID_EMAIL_FORMAT')
          debug('MAIL WRONG')
          debug('>>>', this.formData.email)
        }
        return pass
      }
    },
    mounted () {},
  }
</script>
<style lang="stylus" scoped>
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
