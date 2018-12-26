<template>
  <nav class="nav">
    <a
      v-if="isClientSide"
      class="nav__icon nav__icon--fb"
      :href="createShareUrl('fb', shareUrl)"
      target="_blank"
      @click="sendShareLog('fb')"
    >
      <img src="/public/icons/fb-square.svg" alt="">
    </a>
    <a
      v-if="isClientSide"
      class="nav__icon nav__icon--line"
      :href="createShareUrl('line', shareUrl)"
      target="_blank"
      @click="sendShareLog('line')"
    >
      <img src="/public/icons/line.png" alt="">
    </a>
    <Tooltip
      v-if="isClientSide"
      class="nav__icon nav__icon--copy-link"
      :tooltipTexts="{ active: $t('COPY_LINK') }"
      @toggle="copyToClipboard(createShareUrl('copylink', shareUrl))"
    >
      <img src="/public/icons/copylink.png" alt="">
    </Tooltip>
  </nav>
</template>

<script>
import { get, } from 'lodash'
import { isClientSide, } from 'src/util/comm'
import { logTrace, } from 'src/util/services'

import { getPostType, getPostFullUrl, } from 'src/util/post/index'
import { createShareUrl, } from 'src/util/post/share'
import { copyToClipboard, } from 'src/util/comm'

import Tooltip from 'src/components/Tooltip.vue'

export default {
  props: {
    post: {
      type: Object,
      default () {
        return {}
      },
    },
  },
  components: {
    Tooltip,
  },
  computed: {
    isClientSide,
    shareUrl () {
      return getPostFullUrl(this.post)
    },
    useragent () {
      return get(this.$store, 'state.useragent')
    },
    currUser () {
      return get(this.$store, 'state.profile.id')
    },
    postType () {
      return getPostType(this.post)
    },
  },
  methods: {
    createShareUrl,
    copyToClipboard,
    sendShareLog (socialMedia) {
      const createShareLog = () => {
        return {
          'sharelog-type': this.postType,
          'sharelog-slug/id': get(this.post, 'slug') || get(this.post, 'id'),
          'sharelog-fb/line': socialMedia,
        }
      }

      logTrace({
        category: this.$route.fullPath,
        description: 'sharebutton',
        eventType: 'click',
        sub: this.currUser,
        target: {},
        useragent: this.useragent,
        ...createShareLog(),
      })
    },
  },
}
</script>

<style lang="stylus" scoped>
.nav
  display flex
  &__icon
    d = 40px
    width d
    height d
    border-radius d
    display flex
    justify-content center
    align-items center
    & + &
      margin 0 0 0 10px
    &--fb
      background-color #3b5998
      img
        width 50%
    &--line
      background-color #00b900
      img
        width 70%
    &--copy-link
      cursor pointer
      img
        width 100%
</style>

