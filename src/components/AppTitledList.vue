<template>
  <section class="app-titled-list">
    <div class="app-titled-list__title">
      <div v-if="isTitleMultple" class="app-titled-list__multiple-indicator">
        <h2 v-text="multipleTitleFirst"></h2>
        <div class="indicator-icon">
          <div class="indicator-icon__vertical-line"></div>
          <div class="indicator-icon__horizontal-line"></div>
          <div class="indicator-icon__dot"></div>
        </div>
      </div>
      <h1 v-text="titleMain"></h1>
      <div class="triangle"></div>
    </div>
    <div class="app-titled-list__content">
      <slot></slot>
    </div>
  </section>
</template>

<script>
import { isArray, } from 'lodash'

export default {
  props: {
    listTitle: {
      type: [ String, Array, ],
      required: true,
    },
  },
  computed: {
    isTitleMultple () {
      return isArray(this.listTitle) && this.listTitle.length > 1
    },
    multipleTitleFirst () {
      if (this.isTitleMultple) return this.listTitle[0]
      return ''
    },
    multipleTitleSecond () {
      if (this.isTitleMultple) return this.listTitle[1]
      return ''
    },
    titleMain () {
      return this.isTitleMultple ? this.multipleTitleSecond : this.listTitle
    },
  },
}
</script>

<style lang="stylus" scoped>
.app-titled-list
  & + &
    margin-top 23px !important
  &__title
    display flex
    padding 0 0 5px 20px
    border-bottom solid 3px #ddcf21
    h1
      font-size 18px
      font-weight 600
      margin 0
    h2
      font-size 15px
      font-weight 300
      color #808080
      margin 0
    .triangle
      position relative
      bottom -6px
      width 0
      height 0
      border-style solid
      border-width 0 12px 19.8px 12px
      border-color transparent transparent #ddcf21 transparent
      &:before
        content ''
        position absolute
        top 4px
        left -11px
        width 0
        height 0
        border-style solid
        border-width 0 11px 19.8px 11px
        border-color transparent transparent white transparent
  &__multiple-indicator
    display flex
    justify-content center
    align-items center
  &__content
    background-color white
    padding-bottom 12px

.indicator-icon
  display flex
  justify-content center
  align-items center
  margin 0 5px
  &__vertical-line
    height 10px
    border-left 1px solid #808080
  &__horizontal-line
    width 10px
    border-bottom 1px solid #808080
  &__dot
    r = 5px
    width r
    height r
    border-radius r
    background-color #808080
</style>
