<template>
  <div class="login">
    <div class="login__input-email">
      <input type="text" :placeholder="wording.WORDING_EMAIL">
    </div>
    <div class="login__input-pwd">
      <input type="text" :placeholder="wording.WORDING_PASSWORD">
    </div>
    <div class="login__wrapper">
      <div class="keep-login-alive">
        <input type="checkbox"> {{ wording.WORDING_KEEP_ALIVE }}
      </div>
      <div class="forget-pwd">
        <span v-text="wording.WORDING_FORGET_PASSWORD"></span>
      </div>
    </div>
    <div class="login__notice">
      <span class="notice" v-text="wording.WORDING_REGISTER_NOTICE"></span>
      <span class="agreement" v-text="wording.WORDING_MEMBER_AGREEMENT"></span>
    </div>
    <div class="login__btn">
      <span v-text="wording.WORDING_LOGIN"></span>
    </div>
  </div>
</template>
<script>
  import { WORDING_EMAIL, WORDING_FORGET_PASSWORD, WORDING_KEEP_ALIVE, WORDING_LOGIN, WORDING_MEMBER_AGREEMENT, WORDING_PASSWORD, WORDING_REGISTER_NOTICE } from '../../constants'
  export default {
    data () {
      return {
        wording: {
          WORDING_LOGIN,
          WORDING_MEMBER_AGREEMENT,
          WORDING_REGISTER_NOTICE,
          WORDING_PASSWORD,
          WORDING_EMAIL,
          WORDING_KEEP_ALIVE,
          WORDING_FORGET_PASSWORD
        }
      }
    },
    name: 'login',
    methods: {
    },
    mounted () {},
  }
</script>
<style lang="stylus" scoped>
  .login
    width 100%
    height calc(300px - 2rem)
    margin 20px 0
    position relative
    padding-bottom 2rem
    > div
      width 100%
      color #666
    &__input-email, &__input-pwd
      margin 10px 0
      > input
        border none
        width calc(100% - 1rem)
        height 2rem
        font-size 1rem
        padding 0 0.5rem
        &::-webkit-input-placeholder
          color #bdbdbd
    &__wrapper
      margin-top 40px
      display flex
      justify-content space-between
      font-size 0.9rem
    &__notice
      margin-top 40px
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