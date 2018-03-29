<template>
  <div class="login-panel">
    <div class="login-panel__container">
      <RecoverPassword v-if="isGoingRecoverPwd"></RecoverPassword>
      <Login v-else-if="isLoginTabAcitve" @goRecoverPwd="goRecoverPwd"></Login>
      <Register v-else></Register>
    </div>
  </div>
</template>
<script>
  import FacebookLogin from 'src/components/login/FacebookLogin.vue'
  import GooglePlusLogin from 'src/components/login/GooglePlusLogin.vue'
  import Login from 'src/components/login/Login.vue'
  import RecoverPassword from 'src/components/login/RecoverPassword.vue'
  import Register from 'src/components/register/Register.vue'

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
    },
    data () {
      return {
        isLoginTabAcitve: true,
        isGoingRecoverPwd: false,
      }
    },
    name: 'LoginPanelPackingTest',
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
    background-color #d8d8d8
    width 500px
    height 430px
    padding 17.5px 50px 50px
    margin 40px auto 0
    &__container
      margin 0 auto
      height 100%

  @media (min-width 950px)
    .login-panel
      max-width 950px
    
</style>