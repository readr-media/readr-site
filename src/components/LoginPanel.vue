<template>
  <div class="login-panel">
    <div class="login-panel__left">
      <div class="title">
        <span class="login" v-text="$t('login.WORDING_LOGIN')"
          :class="{ active: isLoginTabAcitve && !isGoingRecoverPwd }"
          @click="tabChoose('login')"></span>
        <span class="register" v-text="$t('login.WORDING_REGISTER')"
          :class="{ active: !isLoginTabAcitve && !isGoingRecoverPwd }"
          @click="tabChoose('register')"></span>
        <span class="forgot"
          v-if="isGoingRecoverPwd"
          v-text="$t('login.WORDING_FORGET_PASSWORD')"
          :class="{ active: isGoingRecoverPwd }"
          @click="tabChoose('recoverpwd')"></span>
      </div>
      <div class="container">
        <RecoverPassword v-if="isGoingRecoverPwd"></RecoverPassword>
        <Login v-else-if="isLoginTabAcitve" @goRecoverPwd="goRecoverPwd" :isDoingLogin.sync="isDoingLogin" :theme="'dark'"></Login>
        <Register v-else></Register>
      </div>
    </div>
    <div class="login-panel__right">
      <div class="title">
        <span class="login-community active" v-text="''"></span>
      </div>
      <div class="container">
        <FacebookLogin :type="isLoginTabAcitve ? 'login' : 'register'" :isDoingLogin.sync="isDoingLogin"></FacebookLogin>
        <GooglePlusLogin :type="isLoginTabAcitve ? 'login' : 'register'" :isDoingLogin.sync="isDoingLogin"></GooglePlusLogin>
      </div>
    </div>
    <div class="login-panel__modal" v-show="isDoingLogin"><Spinner :show="true"></Spinner></div>
  </div>
</template>
<script>
  import FacebookLogin from 'src/components/login/FacebookLogin.vue'
  import GooglePlusLogin from 'src/components/login/GooglePlusLogin.vue'
  import Login from 'src/components/login/Login.vue'
  import RecoverPassword from 'src/components/login/RecoverPassword.vue'
  import Register from 'src/components/register/Register.vue'
  import Spinner from 'src/components/Spinner.vue'

  const debug = require('debug')('CLIENT:LoginPanel')
  const getDisposableToken = (store) => {
    return store.dispatch('DISPOSABLE_TOKEN', {
      type: 'register',
    })
  }

  export default {
    components: {
      FacebookLogin,
      GooglePlusLogin,
      Login,
      RecoverPassword,
      Register,
      Spinner,
    },
    data () {
      return {
        isLoginTabAcitve: true,
        isGoingRecoverPwd: false,
        isDoingLogin: false,
      }
    },
    name: 'LoginPanel',
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
      },
    },
    mounted () {
      debug('Login panel mounted.')
    },
    beforeMount () {
      Promise.all([
        getDisposableToken(this.$store),
      ])
    },
  }
</script>
<style lang="stylus" scoped>
  .login-panel
    margin 40px auto 0
    > div
      width 360px
      vertical-align top
      position relative
      margin 0 auto
      &:first-child
        border-right 1px solid #fff
      > .title
        color #fff
        margin 0 auto 10px
        font-size 1.125rem
        font-weight 600
        height 20px
        
        > span
          &.active
            color #ddcf21
        > span
          margin 0 1em 0 0
      > .container
        width 320px
        margin 0 auto 0 0
        // padding-right 24px
    &__left, &__right
      display inline-block
    &__right
      padding-left 40px
    &__left
      > .title
        > span
          cursor pointer
    &__modal
      position fixed !important
      top 0 !important
      left 0 !important
      width 100vw !important
      height 100vh !important
      background-color rgba(0, 0, 0, 0.7) !important
      z-index 99999
      display flex
      justify-content center
      align-items center
  @media (min-width 950px)
    .login-panel
      max-width 950px
    
</style>