<template>
  <Icon
    :image-path="imagePath"
    :color="color"
    :default-width="defaultWidth"
    :width="width"
    :default-height="defaultHeight"
    :height="height"
  />
</template>

<script>
import Icon from './Icon.vue'

export default {
  components: {
    Icon
  },
  props: {
    color: {
      type: String,
      default: 'white'
    },
    width: {
      type: Number,
      default: null
    },
    height: {
      type: Number,
      default: null
    }
  },
  data () {
    return {
      imagePath: '/public/2.0/icons/comment-white.png',
      defaultWidth: 20,
      defaultHeight: 24
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>
