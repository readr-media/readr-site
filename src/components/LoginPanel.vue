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
        <span class="login-community active" v-text="wording['WORDING_LOGIN_COMMUNITY']"></span>
      </div>
      <div class="container">
        <FacebookLogin></FacebookLogin>
        <GooglePlusLogin></GooglePlusLogin>
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
  }
</script>
<style lang="stylus" scoped>
  .login-panel
    background-color #bdbdbd
    width 100%
    max-width calc(800px - 100px)
    padding 30px 50px
    > div
      width calc(50% - 51px)
      display inline-block
      overflow hidden
      vertical-align top
      &:first-child
        padding-right 50px
        border-right 2px solid #afafaf
      &:last-child
        padding-left 50px
      > .title
        color #909090
        margin-bottom 15px
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