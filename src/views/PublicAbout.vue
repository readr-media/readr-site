<template>
  <div>
    <AboutContent @clickClose="clickClose"/>
    <transition name="fade" mode="out-in">
      <router-view @clickClose="clickCloseSubpath"></router-view>
    </transition>
  </div>
</template>

<script>
  import AboutContent from 'src/components/about/AboutContent.vue'
  import VueCookie from 'vue-cookie'

  export default {
    name: 'PublicAbout',
    metaInfo () {
      const ABOUT_READER = this.$i18n
        ? this.$t('ABOUT.WHAT_READR.PARAGRAPH_1')
        + this.$t('ABOUT.WHAT_READR.PARAGRAPH_2')
        + this.$t('ABOUT.WHAT_READR.PARAGRAPH_3')
        + this.$t('ABOUT.WHAT_READR.PARAGRAPH_4')
        + this.$t('ABOUT.WHAT_READR.PARAGRAPH_5')
        + this.$t('ABOUT.WHAT_READR.PARAGRAPH_6')
        + this.$t('ABOUT.WHAT_READR.PARAGRAPH_7')
        : ''
      return {
        description: ABOUT_READER || 'Readr',
        ogTitle: this.$i18n ? this.$t('OG.ABOUT') : 'Readr',
        title: this.$i18n ? this.$t('OG.ABOUT') : 'Readr',
        metaUrl: this.$route.path,
      }
    },    
    components: {
      AboutContent,
    },
    data () {
      return {
        routeFrom: undefined,
        routeUpdateFrom: undefined,
      }
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        vm.routeFrom = from.path
      })
    },
    beforeRouteUpdate (to, from, next) {
      // cache one way navigation /about -> /about/:subpath only
      if (from.path === '/about') { this.routeUpdateFrom = from.path }
      next()
    },
    mounted () {
      VueCookie.set('readr-first-login', 'N', { expires: '1Y', })
    },
    methods: {
      clickClose () {
        this.$router.push({ path: this.routeFrom, })
      },
      clickCloseSubpath () {
        this.$router.push({ path: this.routeUpdateFrom !== undefined ? this.routeUpdateFrom : this.routeFrom, })
      },
    },
  }
</script>

<style lang="stylus" scoped>
</style>
