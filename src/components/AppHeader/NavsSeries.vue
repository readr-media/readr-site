<template>
  <nav class="navs">
    <div
      class="navs__nav navs__nav--square navs__nav--series-contents"
      @click="$emit('series')"
    >
      <p>系列內容</p>
    </div>
    <NavsSeriesFollow
      class="navs__nav"
    />
    <div
      class="navs__nav"
      @click="$emit('comment')"
    >
      <IconComment :height="30" />
    </div>
    <div
      class="navs__nav"
      @click="$emit('donate')"
    >
      <IconDonate :height="30" />
    </div>
    <NavsSeriesShare
      class="navs__nav"
    />
  </nav>
</template>

<script>
import NavsSeriesFollow from './NavsSeriesFollow.vue'
import NavsSeriesShare from './NavsSeriesShare.vue'
import IconComment from 'src/components/Icons/Comment.vue'
import IconDonate from 'src/components/Icons/Donate.vue'

export default {
  components: {
    NavsSeriesFollow,
    NavsSeriesShare,
    IconComment,
    IconDonate,
  },
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
    &--square
      width 38px
      height 38px
    &--series-contents
      &:hover
        p
          color #ddcf21
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
