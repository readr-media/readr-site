<template>
  <div
    class="icon"
    :style="{
      width: `${_width}px`,
      height: `${_height}px`,
      backgroundColor: isMouseover ? colorHover : colorDefault
    }"
  />
</template>

<script>
import mixin from './_mixin'

export default {
  mixins: [
    mixin
  ],
  data () {
    return {
      defaultWidth: 16,
      defaultHeight: 24
    }
  }
}
</script>

<style lang="stylus" scoped>
.icon
  -webkit-mask-image url(/public/2.0/icons/follow-white.png)
  mask-image url(/public/2.0/icons/follow-white.png)
  mask-size cover
  transition background-color .25s ease-out
</style>
