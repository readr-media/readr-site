<template>
  <div id="app" :class="`page_${pageType.toLowerCase()}`">
    <app-header v-if="showHeaderAndAsideNav"></app-header>
    <div :class="[ 'app__container', { 'app__container--wide': isLoginPage }, { 'app__container--reset': isCommentPage } ]">
      <div class="app__wrapper" :class="[ `page_${pageType.toLowerCase()}` ]">
        <aside class="app__aside" :class="{ fixed: isFixedAside, }" v-if="showHeaderAndAsideNav">
          <AppNavAside/>
        </aside>
        <main :class="[ 'app__main', { 'app__main--reset': isCommentPage } ]">
          <transition name="fade" mode="out-in">
            <router-view class="view"></router-view>
          </transition>
        </main>
      </div>
      <Consume></Consume>
      <DepositTappay v-if="isTappayNeeded" :active.sync="isDepositActive" @fetchCurrentPoint="fetchCurrentPoint"></DepositTappay>
    </div>
    <LoginAsk></LoginAsk>
    <AlertGDPR v-if="showAlertGDPR" @closeAlertGDPR="showAlertGDPR = false" />
  </div>
</template>

<script>
  import { get, } from 'lodash'
  import { currentYPosition, elmYPosition, } from 'kc-scroll'
  import { isAlinkDescendant, logTrace, } from 'src/util/services'
  import AlertGDPR from 'src/components/AlertGDPR.vue'
  import AppHeader from 'src/components/header/AppHeader.vue'
  import AppNavAside from 'src/components/AppNavAside.vue'
  import Consume from 'src/components/point/Consume.vue'
  import LoginAsk from 'src/components/LoginAsk.vue'
  import Tap from 'tap.js'
  import DepositTappay from 'src/components/point/DepositTappay.vue'
  import VueCookie from 'vue-cookie'
  
  const debug = require('debug')('CLIENT:App')
  const PAGE_TYPE = {
    HOME: 'HOME',
    LOGIN: 'LOGIN',
    COMMENT: 'COMMENT',
    HOT: 'HOT',
    OTHER: 'OTHER',
  }

  const fetchCurrPoints = store => store.dispatch('GET_POINT_CURRENT', { params: {}, })

  export default {
    components: {
      AlertGDPR,
      'app-header': AppHeader,
      AppNavAside,
      Consume,
      DepositTappay,
      LoginAsk,
    },
    computed: {
      currUser () {
        return get(this.$store, 'state.profile.id')
      },
      isAboutPage () {
        return /\/about/.test(this.$route.fullPath)
      },
      isLoginPage () {
        return /\/login/.test(this.$route.fullPath)
      },
      isCommentPage () {
        return /\/comment/.test(this.$route.fullPath)
      },
      isHome () {
        return this.$route.path === '/' || this.$route.path.indexOf('/post/') === 0
      },
      isTappayNeeded () {
        return get(this.$store, 'state.isTappayRequired', false)
      },
      showHeaderAndAsideNav () {
        return !this.isLoginPage && !this.isCommentPage
      },
      shouldShowAbout () {
        return !this.isLoginPage && !this.isAboutPage && !this.isCommentPage
      },
      isHOT () {
        return this.$route.path === '/hot'
      },
      useragent () {
        return get(this.$store, 'state.useragent')
      },
      pageType () {
        if (this.isLoginPage) {
          return PAGE_TYPE.LOGIN
        } else if (this.isHome) {
          return PAGE_TYPE.HOME
        } else if (this.isCommentPage) {
          return PAGE_TYPE.COMMENT
        } else if (this.isHOT) {
          return PAGE_TYPE.HOT
        } else {
          return PAGE_TYPE.OTHER
        }
      },
    },
    data () {
      return {
        doc: {},
        globalTapevent: {},      
        showAlertGDPR: false,  
        isDepositActive: false,
        isFixedAside: false,
      }
    },
    methods: {
      fetchCurrentPoint () {
        debug('fetch current point again!')
        fetchCurrPoints(this.$store).then()
      },      
      getFirstLoginCookie () {
        return VueCookie.get('readr-first-login')
      },
      getGDPRCookie () {
        return VueCookie.get('gdpr-accept-cookie')
      },
      launchLogger () {
        this.globalTapevent = new Tap(this.doc)
        this.doc.addEventListener('tap', (event) => {
          const { isAlink, } = isAlinkDescendant(event.target)
          isAlink && logTrace({
            category: 'whole-site',
            description: 'ele clicked',
            eventType: 'click',
            sub: this.currUser,
            target: event.target,
            useragent: this.useragent,
          })
        })
      },
      sendPageview () {
        logTrace(Object.assign({
          category: this.$route.fullPath,
          description: 'pageview',
          eventType: 'pageview',
          sub: this.currUser,
          target: {},
          useragent: this.useragent,
        }, this.$route.query))
      },
      setupAsideBehavior () {
        window.addEventListener('scroll', () => {
          const aside_top_Y = elmYPosition('#app .app__aside')
          const current_top_y = currentYPosition()

          const _isFixedAside = current_top_y > (aside_top_Y - 60)
          _isFixedAside !== this.isFixedAside ? this.isFixedAside = _isFixedAside : null
        })
      },   
    },
    beforeMount () {
      const showAbout = !this.getFirstLoginCookie()
      if (this.shouldShowAbout && showAbout) {
        this.$router.push('/about')
      }
    },
    mounted () {
      this.doc = document
      this.$store.dispatch('UPDATE_CLIENT_SIDE')
      this.launchLogger()
      this.sendPageview()
      this.showAlertGDPR = !this.getGDPRCookie() && !this.isCommentPage
      this.setupAsideBehavior()
    },
    watch: {
      '$route.fullPath': function () {
        if (!process.browser) { return }
        this.sendPageview()
        const showAbout = !this.getFirstLoginCookie()
        if (this.shouldShowAbout && showAbout) {
          this.$router.push('/about')
        }
      },
    },
  }
</script>

<style lang="stylus">
#app
  background-color #e6e6e6
  min-height 100vh

$container
  width 100%
  display flex
  justify-content center

.app
  &__wrapper
    width 100%
    max-width 1200px
    padding 40px 0
    display flex
    position relative

  &__container
    @extends $container
    &--wide
      @extends $container
      max-width 100vw
      padding 0
      > .app__wrapper
        max-width none
        padding 0
        > .app__main
          margin 0
          padding 0
    &--reset
      max-width initial
      margin 0
      padding 0
  &__aside
    width 75px
    position absolute
    top 60px
    z-index 999
    &.fixed
      position fixed
  &__main
    position relative
    flex 1
    padding-left 80px
    padding-top 25px
    display flex
    justify-content flex-start
    align-items flex-start
    &--reset
      margin 0
      padding 0

a
  text-decoration none

button
  cursor pointer
  &:disabled
    cursor not-allowed
.view
  position relative
  background-color #fff
  width 100%
  &.locked
    width 100%
    height 100vh
    overflow hidden
.locked
  width 100%
  height 100vh
  overflow hidden

.main-container
  width 90%
  max-width 90%
  margin 0 auto
  overflow hidden

.main-panel
  width 100%
  padding 20px 5%
  border 2px solid #d8ca21
  background #fff

.datepicker__input
  padding-left 10px
  width 100%
  height 25px
  color #808080

.fade-enter-active, .fade-leave-active
  transition all .2s ease

.fade-enter, .fade-leave-active
  opacity 0

.backstage
  width 100%
  min-height 100vh
  overflow hidden
  &-container
    width 950px
    height 100%
    margin 0 auto
    // overflow hidden
  &__aside
    position fixed
    top 3px
    left 15px
    z-index 1000
    width 50px
    height auto
    .app-aside-nav__logo
      width 50px !important
      height auto !important
  &__controlBar
    margin-top 40px
  &__tab
    margin-top 30px
    background-color #fff
  &__panel
    margin-top 10px
    padding 20px 5%
    border 5px solid #d8ca21
    background #fff

@media (min-width 768px)
  .view
    background-color #e6e6e6

@media (min-width 950px)
  .main-container
    width 950px
    max-width 950px
    margin 22px auto 0
  .main-panel
    padding 35px calc((100% - 800px) / 2) 40px
@media (min-width 1440px)
  .page_home, .page_hot
    .app
      &__container
        padding-right 240px
</style>
