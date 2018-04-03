<template>
  <div class="login-panel">
    <div class="login-panel__container">
      <RecoverPassword v-if="isGoingRecoverPwd" :theme="'dark'"></RecoverPassword>
      <Login v-else @goRecoverPwd="goRecoverPwd" :theme="'dark'"></Login>
      <div class="login-panel__desc" v-if="!isGoingRecoverPwd">
        <span v-text="$t('PACKING_TEST.MESSAGE')"></span>
      </div>
    </div>
  </div>
</template>
<script>
  import Login from 'src/components/login/Login.vue'
  import RecoverPassword from 'src/components/login/RecoverPassword.vue'

  const debug = require('debug')('CLIENT:LoginPanel')
  const getDisposableToken = (store) => {
    return store.dispatch('DISPOSABLE_TOKEN', {
      type: 'register',
    })
  }

  export default {
    components: {
      Login,
      RecoverPassword,
    },
    data () {
      return {
        isGoingRecoverPwd: false,
      }
    },
    name: 'LoginPanelPackingTest',
    methods: {
      goRecoverPwd () {
        this.isGoingRecoverPwd = true
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
    background-color #444746
    width 500px
    height 240px
    padding 17.5px 50px 50px
    margin 40px auto 0
    &__container
      margin 0 auto
      height 100%
    &__desc
      font-family PingFangTC
      font-size 15px
      font-weight 600
      font-style normal
      font-stretch normal
      line-height normal
      letter-spacing normal
      text-align center
      color #ddcf21
      margin-top 30px

  @media (min-width 950px)
    .login-panel
      max-width 950px
    
</style>