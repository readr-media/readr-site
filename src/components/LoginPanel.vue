<template>
  <div class="login-panel">
    <div class="login-panel__left">
      <div class="title">
        <span class="login" :class="{ active: isLoginTabAcitve }" v-text="wording['WORDING_LOGIN']" @click="tabChoose('login')"></span>
        <span class="register" :class="{ active: !isLoginTabAcitve }" v-text="wording['WORDING_REGISTER']" @click="tabChoose('register')"></span>
      </div>
      <div class="container">
        <Login v-if="isLoginTabAcitve"></Login>
        <Register v-else></Register>
      </div>
    </div>
    <div class="login-panel__right">
      <div class="title">
        <span class="login-community active" v-text="''"></span>
      </div>
      <div class="container">
        <FacebookLogin :type="isLoginTabAcitve ? 'login' : 'register'"></FacebookLogin>
        <GooglePlusLogin :type="isLoginTabAcitve ? 'login' : 'register'"></GooglePlusLogin>
      </div>
    </div>
  </div>
</template>
<script>
  import { WORDING_LOGIN, WORDING_LOGIN_COMMUNITY, WORDING_REGISTER } from '../constants'
  import { consoleLogOnDev } from '../util/comm'
  import FacebookLogin from './login/FacebookLogin.vue'
  import GooglePlusLogin from './login/GooglePlusLogin.vue'
  import Login from './login/Login.vue'
  import Register from './register/Register.vue'

  const getDisposableToken = (store) => {
    return store.dispatch('DISPOSABLE_TOKEN', {
      type: 'register'
    })
  }

  export default {
    components: {
      FacebookLogin,
      GooglePlusLogin,
      Login,
      Register
    },
    data () {
      return {
        isLoginTabAcitve: true,
        wording: {
          WORDING_LOGIN,
          WORDING_LOGIN_COMMUNITY,
          WORDING_REGISTER
        }
      }
    },
    name: 'login-panel',
    methods: {
      tabChoose (targ) {
        switch (targ) {
          case 'login':
            this.isLoginTabAcitve = true
            break
          case 'register':
            this.isLoginTabAcitve = false
            break
        }
      }
    },
    mounted () {
      consoleLogOnDev({ msg: 'login panel' })
    },
    beforeMount () {
      Promise.all([
        getDisposableToken(this.$store)
      ])
    }
  }
</script>
<style lang="stylus" scoped>
  .login-panel
    background-color #d8d8d8
    width 660px
    height 320px
    padding 17.5px 30px
    margin 0 auto
    > div
      width calc(330px - 31px)
      height 100%
      display inline-block
      // overflow hidden
      vertical-align top
      position relative
      &:first-child
        padding-right 30px
        border-right 2px solid #afafaf
      &:last-child
        padding-left 30px
      > .title
        color #fff
        margin-bottom 15px
        font-size 1.125rem
        font-weight 600
        > span
          &.active
            color #000
        > span:first-child
          margin-right 40px
        > span:not(:first-dhild)
          margin 0 40px
      > .container
        > div
          margin 10px 0
    &__left
      > .title
        > span
          cursor pointer
    
</style>