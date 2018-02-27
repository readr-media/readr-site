<template>
  <div class="profile">
    <About :profile="profile"></About>
  </div>
</template>
<script>
  import { get } from 'lodash'
  import About from 'src/components/About.vue'
  
  export default {
    name: 'Profile',
    components: {
      About
    },
    computed: {
      profile () {
        return get(this.$store, [ 'state', 'profile' ], {})
      },
    },
    methods: {},
    mounted () {},
  }
</script>
<style lang="stylus" scoped>
  .profile
    min-height 100vh
</style>