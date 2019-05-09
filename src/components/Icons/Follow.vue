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
export default {
  props: {
    colorDefault: {
      type: String,
      default: 'white',
    },
    colorHover: {
      type: String,
      default: '#ddcf21',
    },
    width: {
      type: Number,
      default: null,
    },
    height: {
      type: Number,
      default: null,
    },
  },
  data () {
    return {
      isMouseover: false,
      defaultWidth: 16,
      defaultHeight: 24,
    }
  },
  computed: {
    _width () {
      if (this.width === null && this.height === null) {
        return this.defaultWidth
      } else if (this.width === null) {
        const ratio = this.height / this.defaultHeight
        return this.defaultWidth * ratio
      } else {
        return this.width
      }
    },
    _height () {
      if (this.width === null && this.height === null) {
        return this.defaultHeight
      } else if (this.height === null) {
        const ratio = this.height / this.defaultWidth
        return this.defaultHeight * ratio
      } else {
        return this.height
      }
    },
  },
  methods: {
    onMouseover () {
      this.isMouseover = true
    },
    onMouseout () {
      this.isMouseover = false
    },
  },
}
</script>

<style lang="stylus" scoped>
.icon
  -webkit-mask-image url(/public/2.0/icons/follow-white.png)
  mask-image url(/public/2.0/icons/follow-white.png)
  mask-size cover
  transition background-color .25s ease-out
</style>
