<template>
  <div
    id="app"
    class="app"
  >
    <LoginLight />
    <AppHeader class="app__header" />
    <transition
      name="fade"
      mode="out-in"
    >
      <router-view class="view" />
    </transition>
    <AppFooter class="app__footer" />
  </div>
</template>

<script>
import AppHeader from 'src/components/AppHeader/AppHeader.vue'
import AppFooter from 'src/components/AppFooter.vue'
import LoginLight from 'src/components/login/LoginLight.vue'

import { SITE_FULL, SITE_NAME } from './constants'
import { isAlink, logTrace } from 'src/util/services'
import { mapState } from 'vuex'

export default {
  components: {
    AppHeader,
    AppFooter,
    LoginLight
  },
  metaInfo () {
    return {
      titleTemplate: `%s - ${SITE_NAME}`,
      meta: [
        { vmid: 'og:image', name: 'og:image', content: `${SITE_FULL}/public/og-image.jpg` }
      ]
    }
  },
  computed: {
    ...mapState({
      currentUser: state => state.DataUser.profile.id,
      useragent: state => state.useragent
    })
  },
  watch: {
    '$route.fullPath' () {
      process.browser && this.sendPageview()
    }
  },
  mounted () {
    this.sendPageview()
    window.addEventListener('click', this.handleClickLogger)
  },
  beforeDestroy () {
    window.removeEventListener('click', this.handleClickLogger)
  },
  methods: {
    handleClickLogger (event) {
      const checkAlink = isAlink(event.target)
      checkAlink && logTrace({
        category: 'whole-site',
        description: 'ele clicked',
        eventType: 'click',
        sub: this.currentUser,
        target: event.target,
        useragent: this.useragent,
        isAlink: checkAlink
      })
    },
    sendPageview () {
      logTrace({
        category: this.$route.fullPath,
        description: 'pageview',
        eventType: 'pageview',
        sub: this.currentUser,
        target: {},
        useragent: this.useragent
      })
    }
  }
}
</script>

<style lang="stylus">

h1, h2, h3, p, a, figure, pre
  margin 0
h1, h2, h3, p, a
  color #000
h1
  font-size 2.8125rem
  font-weight normal
h2
  font-size 1.5rem
  font-weight 500
p
  font-size 1rem
  &.small
    color #4a4a4a
    font-size .875rem
a
  text-decoration none
  cursor pointer
  &:link, &:visited, &:hover, &:active
    color #000
button
  background-color transparent
  border none
  cursor pointer
figure
  background-color #979797
img
  font-size .75rem // for alt text
pre
  padding .5em
  color #f8f8f2
  white-space pre-line
  background-color #23241f
  border-radius 3px

.app
  background-color #f1f1f1
  &__header
    position fixed
    top 0
    left 0
  &-list
    h1, p
      line-height 1.3
    h1, h2, p, figure
      & + h1, & + h2, & + p, & + div
        margin-top .5em
    h1
      font-size 1.5rem
      font-weight normal
  &-content-area
    width 60%
    max-width 800px
    margin-left auto
    margin-right auto

.view
  padding 50px 0 0

.fade-enter-active, .fade-leave-active
  transition opacity .5s
.fade-enter, .fade-leave-to
  opacity 0
</style>
