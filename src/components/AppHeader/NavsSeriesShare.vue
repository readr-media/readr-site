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
        />
        <ShareLine
          class="share-navs__nav"
          :url="shareUrlLine"
        />
        <ShareCopylink
          class="share-navs__nav"
          :url="shareUrlCopylink"
        />
      </NoSSR>
    </nav>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapState } from 'vuex'
import { createPost } from 'src/util/post'

import NoSSR from 'vue-no-ssr'
import IconShare from 'src/components/Icons/Share.vue'
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
    ...mapState({
      dataPost: state => state.DataPost.post
    }),
    post () {
      return createPost(this.dataPost)
    },
    shareUrlFB () {
      return _.get(this.post, [ 'processed', 'shareUrlFB' ], '')
    },
    shareUrlLine () {
      return _.get(this.post, [ 'processed', 'shareUrlLine' ], '')
    },
    shareUrlCopylink () {
      return _.get(this.post, [ 'processed', 'shareUrlCopylink' ], '')
    }
  },
  methods: {
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
