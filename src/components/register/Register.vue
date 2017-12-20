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
  import { consoleLogOnDev } from '../../util/comm'
  import InputItem from '../form/InputItem.vue'
  import validator from 'validator'

  const register = (store, profile, token) => {
    return store.dispatch('REGISTER', {
      params: profile,
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
        resMsg: '',
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
        if (this.validatInput()) {
          register(this.$store, {
            nickname: this.formData.nickname,
            email: this.formData.mail,
            password:this.formData.pwd,
          }, _.get(this.$store, [ 'state', 'register-token' ])).then(({ status, err }) => {
            this.isRegistered = true
            if (status === 200) {
              this.resMsg = this.wording.WORDING_REGISTER_SUCESSFUL
            }
          }).catch(({ status, err }) => {
            if (err === 'User Already Existed') {
              this.alertFlags.mail = true
              this.alertMsgs.mail = this.wording.WORDING_REGISTER_INFAIL_DUPLICATED
              this.$forceUpdate()
            } else {
            //   this.resMsg = this.wording.WORDING_REGISTER_INFAIL
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
        // this.alertMsgs [] = 
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
        return pass
      }
    },
    mounted () {}
  }
</script>
<style lang="stylus" scoped>
  .register
    height 100%
    // position relative
    .register-container
      width 100%
      height calc(100% - 2rem)
      margin 20px 0
      // position relative
      padding-bottom 2rem
      // > div
      //   width 100%

      &__input-email, &__input-nickname, &__input-pwd-check, &__input-pwd
        margin 10px 0
        width 100%
        > input
          border none
          width calc(100% - 1rem)
          height 2rem
          font-size 1rem
          padding 0 0.5rem
          &::-webkit-input-placeholder
            color #bdbdbd
      &__notice
        font-size 0.625rem
        color #000
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
</style>