<template>
  <div class="login-panel">
    log in
    <FacebookLogin></FacebookLogin>
    <GooglePlusLogin></GooglePlusLogin>
  </div>
</template>
<script>
  import { consoleLogOnDev } from '../util/comm'
  import FacebookLogin from './login/FacebookLogin.vue'
  import GooglePlusLogin from './login/GooglePlusLogin.vue'

  export default {
    components: {
      FacebookLogin,
      GooglePlusLogin
    },
    data () {
      return {}
    },
    name: 'login-panel',
    methods: {
    },
    mounted () {
      consoleLogOnDev({ msg: 'login panel' })
    },
  }
</script>
<style lang="stylus" scoped>

</style>