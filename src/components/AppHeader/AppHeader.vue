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
      >
        <img 
          src="/public/2.0/logos/readr-logo-light.svg" 
          alt=""
        >
      </router-link>
      <AppHeaderNavsDefault
        v-show="layout === 'default'"
        class="header__navs"
      />
      <AppHeaderNavsSeries
        v-show="layout === 'series'"
        class="header__navs"
        @series="toggleNavSeries('series')"
        @comment="toggleNavSeries('comment')"
      />
    </div>
    <AppHeaderSidebar
      :show-sidebar.sync="showSidebar"
      class="header__sidebar"
    >
      <div>
        {{ sidebarSlot }}
      </div>
    </AppHeaderSidebar>
  </header>
</template>

<script>
import _ from 'lodash'
import { mapState, mapMutations, mapGetters, } from 'vuex'

import AppHeaderNavsDefault from './AppHeaderNavsDefault.vue'
import AppHeaderNavsSeries from './AppHeaderNavsSeries.vue'
import AppHeaderSidebar from './AppHeaderSidebar.vue'

export default {
  components: {
    AppHeaderNavsDefault,
    AppHeaderNavsSeries,
    AppHeaderSidebar,
  },
  data () {
    return {
      showSidebar: false,
      sidebarSlot: 'series',
    }
  },
  computed: {
    ...mapState({
      shouldHideHeader: state => state.UIAppHeader.shouldHide,
      seriesData: state => _.get(state.DataSeries.publicProjects.normal, 0, []),
    }),
    seriesId () {
      return _.get(this.seriesData, 'id', '')
    },
    ...mapGetters({
      layout: 'UIAppHeader/layout',
    }),
  },
  watch: {
    layout () {
      if (this.layout === 'default' && this.showSidebar) {
        this.showSidebar = false
      }
    },
  },
  mounted () {
    window.addEventListener('message', e => {
      // if (e.origin !== window.origin) { return }
      const { data = '', } = e
      switch (data) {
        case 'scrolldown':
          this.SET_HIDE_HEADER(true)
          break;
        case 'scrollup':
          this.SET_HIDE_HEADER(false)
          break;
        default:
          break;
      }
    })
  },
  methods: {
    toggleNavSeries (nav) {
      if (this.sidebarSlot === nav && this.showSidebar) {
        this.showSidebar = false
        return
      }

      this.sidebarSlot = nav
      if (this.sidebarSlot === 'series') {
        this.$store.dispatch('DataSeriesContents/FETCH', { project_id: this.seriesId, })
      }
      if (!this.showSidebar) {
        this.showSidebar = true
      }
    },
    toggleSidebar () {
      this.showSidebar = !this.showSidebar
    },

    ...mapMutations({
      SET_HIDE_HEADER: 'UIAppHeader/SET_HIDE',
    }),
  },
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
  &__sidebar
    z-index 999
</style>
