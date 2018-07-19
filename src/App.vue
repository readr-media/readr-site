<template>
  <div id="app">
    <app-header v-if="!isCommentPage"></app-header>
    <div :class="[ 'app__container', { 'app__container--wide': isLoginPage }, { 'app__container--normalize': isCommentPage } ]">
      <aside class="app__aside" v-if="!isLoginPage && !isCommentPage">
        <AppNavAside/>
      </aside>
      <main :class="[ 'app__main', { 'app__main--normalize': isCommentPage } ]">
        <transition name="fade" mode="out-in">
          <router-view class="view"></router-view>
        </transition>
      </main>
      <Consume></Consume>
    </div>
  </div>
</template>

<script>
  import { get, } from 'lodash'
  import { logTrace, } from 'src/util/services'
  import AppHeader from 'src/components/header/AppHeader.vue'
  import AppNavAside from 'src/components/AppNavAside.vue'
  import Consume from 'src/components/point/Consume.vue'
  import Tap from 'tap.js'
  
  // const debug = require('debug')('CLIENT:App')

  export default {
    components: {
      'app-header': AppHeader,
      AppNavAside,
      Consume,
    },
    computed: {
      currUser () {
        return get(this.$store, 'state.profile.id')
      },
      isLoginPage () {
        return this.$route.path === '/login'
      },
      isCommentPage () {
        return this.$route.path === '/comment'
      },
      useragent () {
        return get(this.$store, 'state.useragent')
      },
    },
    data () {
      return {
        doc: {},
        globalTapevent: {},        
      }
    },
    methods: {
      launchLogger () {
        this.globalTapevent = new Tap(this.doc)
        this.doc.addEventListener('tap', (event) => {
          logTrace({
            category: 'whole-site',
            description: 'ele clicked',
            eventType: 'click',
            sub: this.currUser,
            target: event.target,
            useragent: this.useragent,
          })
        })
      },            
    },
    mounted () {
      this.doc = document
      this.$store.dispatch('UPDATE_CLIENT_SIDE')
      this.launchLogger()
    },
  }
</script>

<style lang="stylus">
#app
  background-color #e6e6e6
  min-height 100vh

$container
  max-width 1200px
  margin auto
  padding calc(35px + 22.5px) 0
  display flex
.app
  &__container
    @extends $container
    &--wide
      @extends $container
      max-width 100vw
      padding 0
      > .app__main
        margin-left 0
    &--normalize
      max-width initial
      margin 0
      padding 0
  &__aside
    width 75px
    height 100%
    position fixed
    // position fixed
    top 3px
    z-index 999
  &__main
    flex 1
    margin-left calc(30px + 75px)
    // margin-right 30px
    display flex
    justify-content flex-start
    align-items flex-start
    &--normalize
      margin 0

a
  text-decoration none

button
  cursor pointer
  &:disabled
    cursor not-allowed
.view
  // max-width 800px
  // margin 0 auto
  position relative
  background-color #fff
  width 100%
  // padding-top 35px
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
  // padding 35px 0 0 65px
  overflow hidden
  &-container
    width 950px
    height 100%
    margin 0 auto
    // padding 25px 0
    overflow hidden
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
</style>
