<template>
  <div class="tooltip-wrapper">
    <div @click="toggleFollowTooltip">
      <img
        class="tooltip-wrapper__icon"
        src="/public/2.0/icons/copylink.png"
        alt=""
      >
    </div>
    <span
      :class="[
        'tooltip-wrapper__tooltip',
        { 'tooltip-wrapper__tooltip--toggled': showActionTooltip }
      ]"
      v-text="tooltipText"
    />
  </div>
</template>

<script>
import { copyToClipboard } from 'src/util/comm'
import { SITE_FULL } from 'src/constants'

export default {
  props: {
    url: {
      type: String,
      default: SITE_FULL
    }
  },
  data () {
    return {
      showActionTooltip: false,
      tooltipText: '複製連結成功'
    }
  },
  methods: {
    setTooltipTimer () {
      this.showActionTooltip = true
      if (this._timer) {
        clearTimeout(this._timer)
      }
      this._timer = setTimeout(() => {
        this.showActionTooltip = false
      }, 1000)
    },
    toggleFollowTooltip () {
      this.setTooltipTimer()
      copyToClipboard(this.url)
    }
  }
}
</script>

<style lang="stylus" scoped>
.tooltip-wrapper
  position relative
  &__icon
    width 30px
    height 30px
  &__tooltip
    pointer-events none
    padding 1px 2px
    position absolute
    top calc((100% - 22px) / 2)
    right calc(100% + 15px)
    width max-content
    height 22px
    font-size 10px
    color #444746
    background-color white
    border 1px solid #d3d3d3
    z-index 100
    display flex
    align-items center
    opacity 0
    transition opacity .25s
    &:before
      position absolute
      top 2.5px
      right -10px
      content ''
      width 0
      height 0
      border-style solid
      border-width 7px 0 7px 10px
      border-color transparent transparent transparent #d3d3d3
    &:after
      position absolute
      top 3.5px
      right -9px
      content ''
      width 0
      height 0
      border-style solid
      border-width 6px 0 6px 9px
      border-color transparent transparent transparent white
    &--toggled
      opacity 1
</style>
