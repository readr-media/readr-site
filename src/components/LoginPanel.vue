<template>
  <div class="login-panel">
    <div class="login-panel__left">
      <div class="title">
        <span class="login" :class="{ active: isLoginTabAcitve && !isGoingRecoverPwd }" v-text="wording['WORDING_LOGIN']" @click="tabChoose('login')"></span>
        <span class="register" :class="{ active: !isLoginTabAcitve && !isGoingRecoverPwd }" v-text="wording['WORDING_REGISTER']" @click="tabChoose('register')"></span>
        <span class="forgot" :class="{ active: isGoingRecoverPwd }" v-if="isGoingRecoverPwd" v-text="wording['WORDING_FORGET_PASSWORD']" @click="tabChoose('recoverpwd')"></span>
      </div>
      <div class="container">
        <RecoverPassword v-if="isGoingRecoverPwd"></RecoverPassword>
        <Login v-else-if="isLoginTabAcitve" @goRecoverPwd="goRecoverPwd"></Login>
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
  import { WORDING_LOGIN, WORDING_LOGIN_COMMUNITY, WORDING_REGISTER, WORDING_FORGET_PASSWORD } from 'src/constants'
  import { consoleLogOnDev } from 'src/util/comm'
  import FacebookLogin from 'src/components/login/FacebookLogin.vue'
  import GooglePlusLogin from 'src/components/login/GooglePlusLogin.vue'
  import Login from 'src/components/login/Login.vue'
  import RecoverPassword from 'src/components/login/RecoverPassword.vue'
  import Register from 'src/components/register/Register.vue'

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
      RecoverPassword,
      Register
    },
    data () {
      return {
        isLoginTabAcitve: true,
        isGoingRecoverPwd: false,
        wording: {
          WORDING_LOGIN,
          WORDING_LOGIN_COMMUNITY,
          WORDING_REGISTER,
          WORDING_FORGET_PASSWORD
        }
      }
    },
    name: 'login-panel',
    methods: {
      goRecoverPwd () {
        this.isGoingRecoverPwd = true
      },
      tabChoose (targ) {
        switch (targ) {
          case 'login':
            this.isLoginTabAcitve = true
            this.isGoingRecoverPwd = false
            break
          case 'register':
            this.isLoginTabAcitve = false
            this.isGoingRecoverPwd = false
            break
          case 'recoverpwd':
            this.isLoginTabAcitve = false
            this.isGoingRecoverPwd = false
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
    width 100%
    height 430px
    padding 17.5px 30px 23px
    margin 40px auto 0
    > div
      width 50%
      height 100%
      display inline-block
      // overflow hidden
      vertical-align top
      position relative
      margin 0 auto
      &:first-child
        border-right 1px solid #000
      &:last-child
        padding-left 30px
      > .title
        color #fff
        margin 0 auto 15px
        font-size 1.125rem
        font-weight 600
        height 20px
        
        > span
          &.active
            color #000
        > span
          margin 0 24.5px 0 0
      > .container
        width 100%
        height calc(100% - 35px)
        margin 0 auto
        padding-right 24px
    &__left
      > .title
        > span
          cursor pointer
  @media (min-width 950px)
    .login-panel
      max-width 950px
    
</style>