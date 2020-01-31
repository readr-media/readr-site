<template>
  <a
    class="wrapper"
    :href="url"
    target="_blank"
    rel="noopener"
  >
    <img
      src="/public/2.0/icons/line.png"
      alt=""
    >
  </a>
</template>

<script>
import { URL_SHARE_LINE, SITE_FULL } from 'src/constants'

export default {
  props: {
    url: {
      type: String,
      default: `${URL_SHARE_LINE}/?url=${SITE_FULL}`
    }
  }
}
</script>

<style lang="stylus" scoped>
.wrapper
  margin 0
  padding 0
  background-color #00b900
  width 30px
  height 30px
  border-radius 30px
  border none
  display flex
  justify-content center
  align-items center
  cursor pointer
  img
    width 70%
  &:focus
    outline none
</style>
