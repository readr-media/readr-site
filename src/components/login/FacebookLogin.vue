<template>
  <div class="facebook-login" @click="login">Facebook Login</div>
</template>
<script>
  import { consoleLogOnDev } from '../../util/comm'
  export default {
    name: 'facebook-login',
    methods: {
      login () {
        FB.login(function(response) {
          if (response.status === 'connected') {
            FB.api('/me', function(response) {
              consoleLogOnDev({ msg: 'Successful login for: ' + response.name })
            })
          }
        }, { scope: 'public_profile,email' })
      }
    },
    mounted () {},
  }
</script>
<style lang="stylus" scoped>
  .facebook-login
    width 200px
    height 80px
    background-color blue
    cursor pointer
    color #fff
</style>