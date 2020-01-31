<template>
  <nav class="navs">
    <div
      v-show="shouldShowSeriesContents"
      class="navs__nav navs__nav--series-contents"
      @click="$emit('series')"
    >
      <IconSeriesContents
        :color="shouldHighlightSeriesContents ? '#ddcf21' : 'white'"
        @click.native="sendGaEvent('click', 'header_readr', 'tableofcontentsbutton')"
      />
    </div>
    <!-- <NavsSeriesFollow
      class="navs__nav"
    /> -->
    <!-- <div
      class="navs__nav"
      @click="$emit('comment')"
    >
      <IconComment :height="30" />
    </div> -->
    <div
      v-show="shouldShowDonate"
      class="navs__nav"
      @click="$emit('donate')"
    >
      <IconDonate
        :color="shouldHighlightDonate ? '#ddcf21' : 'white'"
        @click.native="sendGaEvent('click', 'header_readr', 'donate')"
      />
    </div>
    <NavsSeriesShare
      v-show="shouldShowShare"
      class="navs__nav"
    />
  </nav>
</template>

<script>
import { mapState } from 'vuex'
import { sendGaEvent } from 'src/util/comm'

// import NavsSeriesFollow from './NavsSeriesFollow.vue'
import NavsSeriesShare from './NavsSeriesShare.vue'
import IconSeriesContents from 'src/components/icons/IconSeriesContents.vue'
// import IconComment from 'src/components/icons/IconComment.vue'
import IconDonate from 'src/components/icons/IconDonate.vue'

export default {
  components: {
    // NavsSeriesFollow,
    NavsSeriesShare,
    IconSeriesContents,
    // IconComment,
    IconDonate
  },
  props: {
    showIconList: {
      type: Array,
      default: () => [ 'seriesContents', 'donate', 'share' ]
    }
  },
  computed: {
    ...mapState({
      showSidebar: state => state.UIAppHeader.showSidebar,
      currentSidebarSlot: state => state.UIAppHeader.currentSidebarSlot
    }),
    shouldHighlightDonate () {
      return this.showSidebar && this.currentSidebarSlot === 'donate'
    },
    shouldHighlightSeriesContents () {
      return this.showSidebar && this.currentSidebarSlot === 'seriesContents'
    },
    shouldShowDonate () {
      return this.showIconList.filter(item => item === 'donate').length > 0
    },
    shouldShowSeriesContents () {
      return this.showIconList.filter(item => item === 'seriesContents').length > 0
    },
    shouldShowShare () {
      return this.showIconList.filter(item => item === 'share').length > 0
    }
  },
  methods: {
    sendGaEvent
  }
}
</script>

<style lang="stylus" scoped>
.navs
  display flex
  align-items center
  &__nav
    display flex
    height 30px
    align-items center
    cursor pointer
    & + &
      margin 0 0 0 40px
    img
      height 100%
    p
      font-size 16px
      margin 0
      color white
      user-select none
      transition color .25s ease-out
</style>
