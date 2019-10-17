<template>
  <header
    :class="[
      'header',
      { 'header--hide': shouldHideHeader }
    ]"
  >
    <div class="header__wrapper">
      <router-link
        class="header__logo"
        to="/"
        @click.native="sendGaEvent('click', 'header_readr', 'logo')"
      >
        <img
          src="/public/2.0/logos/readr-logo-light.svg"
          alt=""
        >
      </router-link>
      <NavsSeries
        :show-icon-list="showIconList"
        class="header__navs"
        @series="toggleNavSeries('seriesContents')"
        @comment="toggleNavSeries('comment')"
        @donate="toggleNavSeries('donate')"
      />
      <NavsDefault
        v-show="layout === 'default'"
        class="header__navs"
      />
    </div>
    <Sidebar
      class="header__sidebar"
    >
      <SidebarSeriesContents
        v-show="currentSidebarSlot === 'seriesContents'"
      />
      <SidebarComment
        v-show="currentSidebarSlot === 'comment'"
      />
      <SidebarDonate
        v-show="currentSidebarSlot === 'donate'"
        @closeSidebar="showSidebar = false"
      />
    </Sidebar>
  </header>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex'
import { sendGaEvent } from 'src/util/comm'

import NavsDefault from './NavsDefault.vue'
import NavsSeries from './NavsSeries.vue'
import Sidebar from './Sidebar.vue'
import SidebarSeriesContents from './SidebarSeriesContents.vue'
import SidebarComment from './SidebarComment.vue'
import SidebarDonate from './SidebarDonate.vue'

export default {
  components: {
    NavsDefault,
    NavsSeries,
    Sidebar,
    SidebarSeriesContents,
    SidebarComment,
    SidebarDonate
  },
  computed: {
    ...mapState({
      showSidebar: state => state.UIAppHeader.showSidebar,
      shouldHideHeader: state => state.UIAppHeader.shouldHide,
      currentSidebarSlot: state => state.UIAppHeader.currentSidebarSlot
    }),
    ...mapGetters({
      layout: 'UIAppHeader/layout'
    }),
    showIconList () {
      if (this.layout === 'series') {
        return [ 'seriesContents', 'donate', 'share' ]
      }
      return [ 'donate' ]
    }
  },
  watch: {
    layout () {
      if (this.layout === 'default' && this.showSidebar) {
        this.SET_SHOW_SIDEBAR(false)
        this.SET_CURRENT_SIDEBAR_SLOT('seriesContents')
      }
    }
  },
  mounted () {
    window.addEventListener('message', e => {
      // if (e.origin !== window.origin) { return }
      const { data = '' } = e
      switch (data) {
        case 'scrolldown':
          this.SET_HIDE_HEADER(true)
          break
        case 'scrollup':
          this.SET_HIDE_HEADER(false)
          break
        default:
          break
      }
    })
  },
  methods: {
    ...mapMutations({
      SET_HIDE_HEADER: 'UIAppHeader/SET_HIDE',
      SET_SHOW_SIDEBAR: 'UIAppHeader/SET_SHOW_SIDEBAR',
      SET_CURRENT_SIDEBAR_SLOT: 'UIAppHeader/SET_CURRENT_SIDEBAR_SLOT'
    }),
    sendGaEvent,
    toggleNavSeries (navClicked) {
      if (this.currentSidebarSlot === navClicked && this.showSidebar) {
        this.SET_SHOW_SIDEBAR(false)
        return
      }

      this.SET_CURRENT_SIDEBAR_SLOT(navClicked)
      if (!this.showSidebar) {
        this.SET_SHOW_SIDEBAR(true)
      }
    },
    toggleSidebar () {
      this.showSidebar = this.SET_SHOW_SIDEBAR(!this.showSidebar)
    }
  }
}
</script>

<style lang="stylus" scoped>
.header
  width 100%
  height 50px
  background-color #444746
  z-index 1000
  transition transform .25s ease-out
  &--hide
    transform translateY(-70px)
  &__wrapper
    max-width 1400px
    margin 0 auto
    display flex
    justify-content space-between
    align-items center
  &__logo
    display block
    width 60px
    position relative
    top 10px
    z-index 1000
    img
      width 100%
  &__navs
    position relative
    top -5px
    margin 0 0 0 auto
    & + .header__navs
      margin-left 40px
  &__sidebar
    z-index 999

@media (max-width 1450px)
  .header
    &__wrapper
      max-width none
      padding 0 50px
</style>
