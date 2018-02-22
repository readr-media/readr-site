<template>
  <div class="reset-pwd">
    <div class="reset-pwd__title">
      <div class="title" v-text="wording.WORDING_LOGIN_RESET_PWD"></div>
      <div class="email"></div>
    </div>
    <InputItem class="reset-pwd__pwd"
      v-if="!isDone"
      type="text" 
      :placeHolder="wording.WORDING_PASSWORD"
      inputKey="pwd"
      @filled="setInputValue"
      @inputFocus="resetAllAlertShow"
      @inputFocusOut="resetAlertShow"
      @removeAlert="removeAlert"
      :alertFlag="alertFlags[ 'pwd' ]"
      :alertMsg="alertMsgs[ 'pwd' ]"
      :alertMsgShow="alertMsgShow[ 'pwd' ]"></InputItem>
    <InputItem class="reset-pwd__pwd-check" 
      v-if="!isDone"
      type="password" 
      :placeHolder="wording.WORDING_PASSWORD_CHECK"
      inputKey="pwd-check"
      @filled="setInputValue"
      @inputFocus="resetAllAlertShow"
      @inputFocusOut="resetAlertShow"
      @removeAlert="removeAlert"
      :alertFlag="alertFlags[ 'pwd-check' ]"
      :alertMsg="alertMsgs[ 'pwd-check' ]"
      :alertMsgShow="alertMsgShow[ 'pwd-check' ]"></InputItem>
    <div class="reset-pwd__btn" @click="save" :class="{ disabled: shouldShowSpinner }" v-if="!isDone">
        <span v-text="wording.WORDING_BTN_SAVE" v-if="!shouldShowSpinner"></span>
        <Spinner :show="shouldShowSpinner"></Spinner>
    </div>
    <div class="reset-pwd__result" v-else>
      <span v-text="result"></span>
    </div>
  </div>
</template>
<script>
  import {
    WORDING_LOGIN_RESET_PWD,
    WORDING_PASSWORD,
    WORDING_PASSWORD_CHECK,
    WORDING_BTN_SAVE,
    WORDING_REGISTER_PWD_EMPTY,
    WORDING_REGISTER_PWD_CHECK_EMPTY,
    WORDING_REGISTER_PWD_CHECK_INFAIL,
    WORDING_LOGIN_RESET_PWD_COMPLETE,
    WORDING_LOGIN_RESET_PWD_INFAIL } from 'src/constants'
  import InputItem from 'src/components/form/InputItem.vue'
  import Spinner from 'src/components/Spinner.vue'
  import validator from 'validator'

  const debug = require('debug')('CLIENT:SetPassword')
  const resetpwd = (store, params) => (store.dispatch('RESET_PWD', {
    params
  }))
  export default {
    name: 'ResetPwd',
    components: {
      InputItem,
      Spinner
    },
    data () {
      return {
        alertMsgs: {},
        alertMsgShow: {},
        alertFlags: {},
        formData: {},
        isDone: false,
        result: '',
        shouldShowSpinner: false,
        wording: {
          WORDING_LOGIN_RESET_PWD,
          WORDING_PASSWORD,
          WORDING_PASSWORD_CHECK,
          WORDING_BTN_SAVE,
          WORDING_REGISTER_PWD_EMPTY,
          WORDING_REGISTER_PWD_CHECK_EMPTY,
          WORDING_REGISTER_PWD_CHECK_INFAIL,
          WORDING_LOGIN_RESET_PWD_COMPLETE,
          WORDING_LOGIN_RESET_PWD_INFAIL
        }
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
      save () {
        if (this.validate()) {
          this.shouldShowSpinner = true
          debug('About to save password')
          resetpwd(this.$store, {
            password: this.formData.pwd
          }).then(res => {
            debug(res)
            this.isDone = true
            this.shouldShowSpinner = false
            if (res.status === 200) {
              this.result = this.wording.WORDING_LOGIN_RESET_PWD_COMPLETE
            } else {
              this.result = this.wording.WORDING_LOGIN_RESET_PWD_INFAIL
            }
          }).catch(err => {
            debug(err)
            this.isDone = true
            this.shouldShowSpinner = false
            this.result = this.wording.WORDING_LOGIN_RESET_PWD_INFAIL
          })
        }
      },
      setInputValue (key, value) {
        switch (key) {
          case 'pwd':
            this.formData.pwd = value
            break
          case 'pwd-check':
            this.formData[ 'pwd-check' ] = value
            break
        }
      },
      validate () {
        let pass = true
        this.alertFlags = {}
        this.alertMsgs = {}
        if (!this.formData.pwd || validator.isEmpty(this.formData.pwd)) {
          pass = false
          this.alertFlags.pwd = true
          this.alertMsgs.pwd = this.wording.WORDING_REGISTER_PWD_EMPTY
          debug('pwd empty', this.formData.pwd)
        }
        if (!this.formData[ 'pwd-check' ] || validator.isEmpty(this.formData[ 'pwd-check' ])) {
          pass = false
          this.alertFlags[ 'pwd-check' ] = true
          this.alertMsgs[ 'pwd-check' ] = this.wording.WORDING_REGISTER_PWD_CHECK_EMPTY
          debug('pwd-check empty,', this.formData[ 'pwd-check' ])
        }
        if (!this.formData.pwd || !this.formData[ 'pwd-check' ] || this.formData.pwd !== this.formData[ 'pwd-check' ]) {
          debug('pwd != pwd check,', this.formData.pwd, ',', this.formData[ 'pwd-check' ])
          this.alertFlags.pwd = true
          this.alertMsgs.pwd = this.wording.WORDING_REGISTER_PWD_CHECK_INFAIL
          this.alertFlags[ 'pwd-check' ] = true
          this.alertMsgs[ 'pwd-check' ] = this.wording.WORDING_REGISTER_PWD_CHECK_INFAIL
          pass = false
        }
        return pass
      }
    },
    mounted () {

    },
  }
</script>
<style lang="stylus" scoped>
  .reset-pwd
    width 100%
    background-color #d8d8d8
    margin 30px auto 0
    padding 18px 75px
    > div
      margin 15px auto
      &.profile__nickname
        margin-top 40px
      &.profile__save
        margin-top 60px
    &__title
      .title
        font-size 1.125rem
        font-weight 600
        color #000
    &__btn
      display flex
      justify-content center
      align-items center
      background-color #444746
      color #ddcf21
      font-size 1.125rem
      // padding 5px
      height 35px
      cursor pointer
      &.disabled
        background-color #c5c5c5
        color #a5a5a5
      &:hover
        background-color #737373

  @media (min-width 750px)
    .reset-pwd
      width 750px
</style>
