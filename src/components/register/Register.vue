<template>
  <div class="register">
    <div class="register-container" v-if="!isRegistered">
      <div class="register-container__input-nickname">
        <input type="text" :placeholder="wording.WORDING_NICKNAME" ref="nickname">
      </div>
      <div class="register-container__input-email">
        <input type="text" :placeholder="wording.WORDING_EMAIL" ref="mail">
      </div>
      <div class="register-container__input-pwd">
        <input type="text" :placeholder="wording.WORDING_PASSWORD" ref="pwd">
      </div>
      <div class="register-container__input-pwd-check">
        <input type="text" :placeholder="wording.WORDING_PASSWORD_CHECK" ref="pwd-check">
      </div>
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
  import { WORDING_EMAIL, WORDING_MEMBER_AGREEMENT, WORDING_NICKNAME, WORDING_PASSWORD, WORDING_PASSWORD_CHECK, WORDING_REGISTER, WORDING_REGISTER_NOTICE, WORDING_REGISTER_SUCESSFUL, WORDING_REGISTER_INFAIL } from '../../constants'
  import { consoleLogOnDev } from '../../util/comm'
  import validator from 'validator'

  const register = (store, profile) => {
    return store.dispatch('REGISTER', {
      params: profile
    })
  }

  export default {
    data () {
      return {
        isRegistered: false,
        resMsg: '',
        wording: {
          WORDING_EMAIL,
          WORDING_MEMBER_AGREEMENT,
          WORDING_NICKNAME,
          WORDING_REGISTER,
          WORDING_REGISTER_NOTICE,
          WORDING_PASSWORD,
          WORDING_PASSWORD_CHECK,
          WORDING_REGISTER_SUCESSFUL,
          WORDING_REGISTER_INFAIL
        }
      }
    },
    name: 'register',
    methods: {
      register () {
        if (this.validatInput()) {
          register(this.$store, {
            nickname: this.$refs[ 'nickname' ].value,
            email: this.$refs[ 'mail' ].value,
            password: this.$refs[ 'pwd' ].value
          }).then(({ status }) => {
            this.isRegistered = true
            if (status === 200) {
              this.resMsg = this.wording.WORDING_REGISTER_SUCESSFUL
            } else {
              this.resMsg = this.wording.WORDING_REGISTER_INFAIL
            }
          })
        }
      },
      validatInput () {
        let pass = true
        if (!this.$refs[ 'nickname' ].value || validator.isEmpty(this.$refs[ 'nickname' ].value)) {
          pass = false
          consoleLogOnDev({ msg: 'nickname empty, ' + this.$refs[ 'nickname' ].value })
        }
        if (!this.$refs[ 'mail' ].value || !validator.isEmail(this.$refs[ 'mail' ].value)) {
          pass = false
          consoleLogOnDev({ msg: 'mail wrong, ' + this.$refs[ 'mail' ].value })
        }
        if (!this.$refs[ 'pwd' ].value || validator.isEmpty(this.$refs[ 'pwd' ].value)) {
          pass = false
          consoleLogOnDev({ msg: 'pwd empty, ' + this.$refs[ 'pwd' ].value })
        }
        if (!this.$refs[ 'pwd-check' ].value || validator.isEmpty(this.$refs[ 'pwd-check' ].value)) {
          pass = false
          consoleLogOnDev({ msg: 'pwd-check empty, ' + this.$refs[ 'pwd-check' ].value })
        }
        if (!this.$refs[ 'pwd' ].value || !this.$refs[ 'pwd-check' ].value || this.$refs[ 'pwd' ].value !== this.$refs[ 'pwd-check' ].value) {
          consoleLogOnDev({ msg: 'pwd != pwd check, ' + this.$refs[ 'pwd' ].value + ',' + this.$refs[ 'pwd-check' ].value })
          pass = false
        }
        return pass
      }
    },
    mounted () {}
  }
</script>
<style lang="stylus" scoped>
  .register
    .register-container
      width 100%
      height calc(300px - 2rem)
      margin 20px 0
      position relative
      padding-bottom 2rem
      > div
        width 100%
        color #666
      &__input-email, &__input-nickname, &__input-pwd-check, &__input-pwd
        margin 10px 0
        > input
          border none
          width calc(100% - 1rem)
          height 2rem
          font-size 1rem
          padding 0 0.5rem
          &::-webkit-input-placeholder
            color #bdbdbd
      &__notice
        font-size 0.9rem
        text-align right
        > .agreement
          margin-left 20px
          cursor pointer
      &__btn
        position absolute
        bottom 0
        left 0
        width 100%
        height 2rem
        background-color #000
        color yellow
        display flex
        justify-content center
        align-items center
        cursor pointer
</style>