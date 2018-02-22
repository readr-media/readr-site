<template>
  <div class="pwd-set">
    <app-header></app-header>
    <ResetPwd v-if="type === 'reset'"></ResetPwd>
    <InitBasicProfile v-else></InitBasicProfile>
  </div>
</template>
<script>
  import AppHeader from 'src/components/AppHeader.vue'
  import InitBasicProfile from 'src/components/register/InitBasicProfile.vue'
  import ResetPwd from 'src/components/login/ResetPwd.vue'
  import { get } from 'lodash'

  const debug = require('debug')('CLIENT:SetPassword')
  export default {
    components: {
      'app-header': AppHeader,
      InitBasicProfile,
      ResetPwd
    },
    computed: {
      type () {
        return get(this.$route, [ 'params', 'type' ])
      }
    },
    name: 'SetPassword',
    methods: {},
    mounted () {},
  }
</script>
<style lang="stylus" scoped></style>