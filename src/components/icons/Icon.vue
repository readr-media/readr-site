<template>
  <div
    class="icon"
    :style="{
      '-webkit-mask-image': `url(${imagePath})`,
      maskImage: `url(${imagePath})`,
      width: `${_width}px`,
      height: `${_height}px`,
      backgroundColor: color
    }"
  />
</template>

<script>
export default {
  props: {
    imagePath: {
      type: String,
      required: true
    },
    color: {
      type: String,
      default: 'white'
    },
    defaultWidth: {
      type: Number,
      default: 0
    },
    width: {
      type: Number,
      default: null
    },
    defaultHeight: {
      type: Number,
      default: 0
    },
    height: {
      type: Number,
      default: null
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
    }
  }
}
</script>

<style lang="stylus" scoped>
.icon
  mask-size cover
  transition background-color .25s ease-out
</style>
