<template>
  <div class="init-basic-profile">
    <div class="profile">
      <div class="profile__title">
        <div class="title" v-text="$t('login.WORDING_CREATE_PWD')"></div>
        <div class="email"></div>
      </div>
      <InputItem class="profile__nickname" type="text"
        inputKey="nickname"
        v-on:filled="setInputValue"
        v-on:inputFocus="resetAllAlertShow"
        v-on:inputFocusOut="resetAlertShow"
        v-on:removeAlert="removeAlert"
        :placeHolder="$t('login.WORDING_NICKNAME')"
        :alertFlag="alertFlags[ 'nickname' ]"
        :alertMsg="alertMsgs[ 'nickname' ]"
        :alertMsgShow="alertMsgShow[ 'nickname' ]"></InputItem>
      <InputItem class="profile__pwd" type="password"
        inputKey="pwd"
        v-on:filled="setInputValue"
        v-on:inputFocus="resetAllAlertShow"
        v-on:inputFocusOut="resetAlertShow"
        v-on:removeAlert="removeAlert"
        :placeHolder="$t('login.WORDING_PASSWORD')"
        :alertFlag="alertFlags[ 'pwd' ]"
        :alertMsg="alertMsgs[ 'pwd' ]"
        :alertMsgShow="alertMsgShow[ 'pwd' ]"></InputItem>
      <InputItem class="profile__pwd-check" type="password"
        inputKey="pwd-check"
        v-on:filled="setInputValue"
        v-on:inputFocus="resetAllAlertShow"
        v-on:inputFocusOut="resetAlertShow"
        v-on:removeAlert="removeAlert"
        :placeHolder="$t('login.WORDING_PASSWORD_CHECK')"
        :alertFlag="alertFlags[ 'pwd-check' ]"
        :alertMsg="alertMsgs[ 'pwd-check' ]"
        :alertMsgShow="alertMsgShow[ 'pwd-check' ]"></InputItem>
      <div class="profile__save" @click="setPwd">
        <span v-text="$t('login.WORDING_BTN_SAVE')"></span>
      </div>
    </div>
  </div>
</template>
<script>
  import InputItem from '../form/InputItem.vue'
  import validator from 'validator'
  import { consoleLogOnDev, } from '../../util/comm'

  const setupBasicProfile = (store, params) => {
    return store.dispatch('SETUP_BASIC_PROFILE', { params, })
  }

  export default {
    components: {
      InputItem,
    },
    data () {
      return {
        alertFlags: {},
        alertMsgs: {},
        alertMsgShow: {},
        formData: {},
      }
    },
    name: 'InitBasicProfile',
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
      setInputValue (key, value) {
        switch (key) {
          case 'nickname':
            this.formData.nickname = value
            break
          case 'pwd':
            this.formData.pwd = value
            break
          case 'pwd-check':
            this.formData[ 'pwd-check' ] = value
            break
        }
      },
      setPwd () {
        if (this.validate()) {
          setupBasicProfile(this.$store, {
            nickname: this.formData.nickname,
            password: this.formData.pwd,
          }).then((res) => {
            if (res.status === 200) {
              location.replace('/login')
            } else {
              console.log(res)
            }
          })
        }
      },
      validate () {
        let pass = true
        this.alertFlags = {}
        this.alertMsgs = {}
        if (!this.formData.nickname || validator.isEmpty(this.formData.nickname)) {
          pass = false
          this.alertFlags.nickname = true
          this.alertMsgs.nickname = this.$t('login.WORDING_REGISTER_NICKNAME_EMPTY')
          consoleLogOnDev({ msg: 'nickname empty, ' + this.formData.nickname, })
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
        return pass
      },
    },
    mounted () {},
  }
</script>
<style lang="stylus" scoped>
  .init-basic-profile
    width 100%
    background-color #d8d8d8
    margin 30px auto 0
    padding 18px 75px
    .profile
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
      &__save
        display flex
        justify-content center
        align-items center
        background-color #444746
        color #ddcf21
        font-size 1.125rem
        padding 5px
        cursor pointer

  @media (min-width 750px)
    .init-basic-profile
      width 750px
</style>