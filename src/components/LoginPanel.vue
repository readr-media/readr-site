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
    width 720px
    height 355px
    padding 17.5px 30px
    margin 0 auto
    > div
      width 330px
      height 100%
      display inline-block
      // overflow hidden
      vertical-align top
      position relative
      &:first-child
        border-right 1px solid #000
      &:last-child
        padding-left 30px
      > .title
        color #fff
        margin-bottom 15px
        font-size 1.125rem
        font-weight 600
        height 20px
        > span
          &.active
            color #000
        > span
          margin 0 24.5px 0 0
      > .container
        width 300px
        height calc(100% - 35px)
    &__left
      > .title
        > span
          cursor pointer
    
</style>