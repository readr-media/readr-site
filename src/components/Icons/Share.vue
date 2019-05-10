<template>
  <div
    class="icon"
    :style="{
      width: `${_width}px`,
      height: `${_height}px`,
      backgroundColor: isMouseover ? colorHover : colorDefault
    }"
    @mouseover="onMouseover"
    @mouseout="onMouseout"
  />
</template>

<script>
import mixin from './_mixin'

export default {
  mixins: [
    mixin,
  ],
  data () {
    return {
      defaultWidth: 22,
      defaultHeight: 26,
    }
  },
}
</script>

<style lang="stylus" scoped>
.icon
  -webkit-mask-image url(/public/2.0/icons/share-white.png)
  mask-image url(/public/2.0/icons/share-white.png)
  mask-size cover
  transition background-color .25s ease-out
</style>
