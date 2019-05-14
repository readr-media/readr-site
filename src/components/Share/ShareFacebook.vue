<template>
  <a
    class="wrapper"
    :href="url"
    target="_blank"
    rel="noopener"
  >
    <img
      src="/public/2.0/icons/fb-white-square.png"
      alt=""
    >
  </a>
</template>

<script>
import { URL_SHARE_FB, SITE_FULL } from 'src/constants'

export default {
  props: {
    url: {
      type: String,
      default: `${URL_SHARE_FB}/?u=${SITE_FULL}`
    }
  }
}
</script>

<style lang="stylus" scoped>
.wrapper
  margin 0
  padding 0
  background-color #3b5998
  width 30px
  height 30px
  border-radius 30px
  border none
  display flex
  justify-content center
  align-items center
  cursor pointer
  img
    width 50%
  &:focus
    outline none
</style>
