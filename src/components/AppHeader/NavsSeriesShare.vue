<template>
  <div
    v-click-outside="hideNavs"
    class="wrapper"
  >
    <div
      class="wrapper__share"
      @click="toggleNavs"
    >
      <IconShare :height="30" />
    </div>
    <nav
      :class="[
        'wrapper__share-navs',
        { 'wrapper__share-navs--show': showNavs },
        'share-navs'
      ]"
    >
      <NoSSR>
        <ShareFacebook
          class="share-navs__nav"
          :url="shareUrlFB"
          @click.native="sendGaEvent('click', 'header_readr', 'share-fb')"
        />
        <ShareLine
          class="share-navs__nav"
          :url="shareUrlLine"
          @click.native="sendGaEvent('click', 'header_readr', 'share-line')"
        />
        <ShareCopylink
          class="share-navs__nav"
          :url="shareUrlCopylink"
          @click.native="sendGaEvent('click', 'header_readr', 'share-copylink')"
        />
      </NoSSR>
    </nav>
  </div>
</template>

<script>
import { createShareUrl } from 'src/util/post/share'
import { getShareUrl, sendGaEvent } from 'src/util/comm'

import NoSSR from 'vue-no-ssr'
import IconShare from 'src/components/icons/IconShare.vue'
import ShareFacebook from 'src/components/Share/ShareFacebook.vue'
import ShareLine from 'src/components/Share/ShareLine.vue'
import ShareCopylink from 'src/components/Share/ShareCopylink.vue'

export default {
  components: {
    NoSSR,
    IconShare,
    ShareFacebook,
    ShareLine,
    ShareCopylink
  },
  data () {
    return {
      showNavs: false
    }
  },
  computed: {
    shareUrlFB () {
      return createShareUrl('fb', getShareUrl(this.$route.fullPath))
    },
    shareUrlLine () {
      return createShareUrl('line', getShareUrl(this.$route.fullPath))
    },
    shareUrlCopylink () {
      return createShareUrl('copylink', getShareUrl(this.$route.fullPath))
    }
  },
  methods: {
    sendGaEvent,
    toggleNavs () {
      this.showNavs = !this.showNavs
    },
    hideNavs () {
      this.showNavs = false
    }
  }
}
</script>

<style lang="stylus" scoped>
.wrapper
  height 30px
  position relative
  display flex
  flex-direction column
  justify-content center
  align-items center
  z-index 1000
  &__share-navs
    position absolute
    top 30px
    opacity 0
    user-select none
    transition opacity .15s ease-out
    &--show
      opacity 1
      user-select initial

.share-navs
  margin 10px 0 0 0
  &__nav
    & + &
      margin 10px 0 0 0
</style>
