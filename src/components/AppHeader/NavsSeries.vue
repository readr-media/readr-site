<template>
  <nav class="navs">
    <div
      class="navs__nav navs__nav--square"
      @click="$emit('series')"
    >
      <p>系列內容</p>
    </div>
    <div
      class="navs__nav"
      @click="$emit('follow')"
    >
      <img 
        src="/public/2.0/icons/follow-white.png" 
        alt=""
      >
    </div>
    <div
      class="navs__nav"
      @click="$emit('comment')"
    >
      <img 
        src="/public/2.0/icons/comment-white.png" 
        alt=""
      >
    </div>
    <div
      class="navs__nav"
      @click="$emit('donate')"
    >
      <img 
        src="/public/2.0/icons/donate-white.png" 
        alt=""
      >
    </div>
    <NavsSeriesShare
      class="navs__nav"
    />
  </nav>
</template>

<script>
import NavsSeriesShare from './NavsSeriesShare.vue'

export default {
  components: {
    NavsSeriesShare,
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
    & + &
      margin 0 0 0 40px
    img
      height 100%
    p
      font-size 16px
      margin 0
      color white
      user-select none
</style>
