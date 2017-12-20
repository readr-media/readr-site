<template>
  <div class="facebook-login" @click="login">Facebook Login</div>
</template>
<script>
  import { consoleLogOnDev } from '../../util/comm'
  export default {
    name: 'facebook-login',
    methods: {
      login () {
        FB.login(function (response) {
          if (response.status === 'connected') {
            FB.api('/me', function (response) {
              consoleLogOnDev({ msg: 'Successful login for: ' + response.name })
            })
          }
        }, { scope: 'public_profile,email' })
      }
    },
    mounted () {}
  }
</script>
<style lang="stylus" scoped>
  .facebook-login
    width 100%
    height 2rem
    background-color #3b5998
    cursor pointer
    color #fff
    display flex
    justify-content center
    align-items center
    
</style>