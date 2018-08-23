<template>
  <AboutContent @clickClose="clickClose"/>
</template>

<script>
  import AboutContent from '../components/about/AboutContent.vue'
  import VueCookie from 'vue-cookie'

  export default {
    name: 'PublicAbout',
    components: {
      AboutContent,
    },
    data () {
      return {
        routeFrom: undefined,
      }
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        vm.routeFrom = from.path
      })
    },
    mounted () {
      VueCookie.set('readr-first-login', 'N', { expires: '1Y', })
    },
    methods: {
      clickClose () {
        this.$router.push({ path: this.routeFrom, })
      },
    },
  }
</script>

<style lang="stylus" scoped>
</style>
