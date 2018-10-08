<template>
  <nav class="nav">
    <a
      v-if="isClientSide"
      class="nav__icon nav__icon--fb"
      :href="createShareUrl('fb', shareUrl)"
      target="_blank"
    >
      <img src="/public/icons/fb-square.svg" alt="">
    </a>
    <a
      v-if="isClientSide"
      class="nav__icon nav__icon--line"
      :href="createShareUrl('line', shareUrl)"
      target="_blank"
    >
      <img src="/public/icons/line.png" alt="">
    </a>
  </nav>
</template>

<script>
import { createShareUrl, isClientSide, } from 'src/util/comm'

export default {
  props: {
    shareUrl: {
      type: String,
      required: true,
    },
  },
  computed: {
    isClientSide,
  },
  methods: {
    createShareUrl,
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
</style>

