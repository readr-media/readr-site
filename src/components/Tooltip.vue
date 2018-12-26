<template>
  <div class="tooltip-wrapper">
    <div @click="toggleFollowTooltip">
      <slot></slot>
    </div>
    <span
      :class="[ 'tooltip-wrapper__tooltip', { 'tooltip-wrapper__tooltip--toggled': showActionTooltip } ]"
      v-text="tooltipText"
    >
    </span>
  </div>
</template>

<script>
import { get, } from 'lodash'

export default {
  props: {
    tooltipTexts: {
      type: Object,
      required: true,
      validator (obj) {
        return 'active' in obj
      },
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      showActionTooltip: false,
    }
  },
  computed: {
    isActiveStatusSingle () {
      return 'active' in this.tooltipTexts && !('deactive' in this.tooltipTexts)
    },
    tooltipText () {
      if (this.isActiveStatusSingle) {
        return get(this.tooltipTexts, 'active', '')
      }

      return this.isActive ? get(this.tooltipTexts, 'active', '') : get(this.tooltipTexts, 'deactive', '')
    },
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
    toggleFollowTooltip (e) {
      this.setTooltipTimer()
      this.$emit('toggle', e)
    },
  },
}
</script>

<style lang="stylus" scoped>
.tooltip-wrapper
  position relative
  &__tooltip
    pointer-events none
    padding 1px 2px
    position absolute
    top calc((100% - 22px) / 2)
    left calc(100% + 15px)
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
      left -10px
      content ''
      width 0
      height 0
      border-style solid
      border-width 7px 10px 7px 0
      border-color transparent #d3d3d3 transparent transparent
    &:after
      position absolute
      top 3.5px
      left -9px
      content ''
      width 0
      height 0
      border-style solid
      border-width 6px 9px 6px 0
      border-color transparent white transparent transparent
    &--toggled
      opacity 1
</style>