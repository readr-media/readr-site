<template>
  <div
    class="switcher ios-style-switch"
    @click="toggle"
  >
    <input
      :id="`checkbox-${id}`"
      type="checkbox"
      class="ios-style-switch__checkbox"
      :checked="isChecked"
    >
    <label
      :for="`checkbox-${id}`"
      class="ios-style-switch__label"
    />
    <div
      class="switcher__text on"
      :class="{ active: status, }"
    >
      <span v-text="$t('FORM.SWITCH_ON')" />
    </div>
    <div
      class="switcher__text off"
      :class="{ active: !status, }"
    >
      <span v-text="$t('FORM.SWITCH_OFF')" />
    </div>
  </div>
</template>
<script>
const debug = require('debug')('CLIENT:BooleanSwitcher')
export default {
  name: 'BooleanSwitcher',
  props: {
    id: {
      type: Number,
      default: () => Number(Date.now().toString())
    },
    status: {
      type: Boolean
    }
  },
  data () {
    return {
      isChecked: false
    }
  },
  watch: {
    status () {
      debug('this.status', this.status)
      this.isChecked = this.status
    }
  },
  mounted () {
    this.isChecked = this.status
  },
  methods: {
    toggle () {
      debug('Going to make isChecked to be', !this.isChecked)
      this.$emit('update:status', !this.isChecked)
    }
  }
}
</script>
<style lang="stylus" scoped>
  .switcher
    position relative
    &__text
      font-size 0.975rem
      font-weight 300
      cursor pointer
      &.on, &.off
        position absolute
        top 0
        height 100%
        width 66.6%
        display none
        justify-content center
        align-items center
        &.active
          display flex
      &.off
        right 0
        color #808080
      &.on
        left 0
        color #fff
  .ios-style-switch
    width 60px
    height 25px
    &__checkbox
      position absolute
      opacity 0
      &:checked
        & + .ios-style-switch__label:after
          margin-left 35px
        & + .ios-style-switch__label:before
          background-color #808080
    &__label
      cursor pointer
      &:before
        content ""
        position absolute
        display block
        top 0
        width 60px
        height 25px
        border-radius 16px
        background transparent
        border 1px solid #c3c3c3
        -webkit-transition all 0.3s
        transition all 0.3s
      &:after
        content ""
        position absolute
        display block
        top 0px
        width 25px
        height 25px
        border-radius 16px
        background rgba(250,250,250,0.9)
        border 1px solid #c3c3c3
        -webkit-transition all 0.3s
        transition all 0.3s
      &:hover:after
        box-shadow 0 0 5px rgba(0, 0, 0, 0.3)</style>
