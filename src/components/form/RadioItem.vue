<template>
  <div
    class="radio-container"
    :class="[ disabled, theme, ]"
  >
    <input
      :id="`${name}${value}`"
      ref="radio"
      type="radio"
      class="radio--hidden"
      :name="name"
      :disabled="disabled"
      :checked="value === currSelected"
      :value="value"
      @change="change"
    >
    <label
      class="radio--mock"
      :for="`${name}${value}`"
      :style="{ fontSize, }"
    >
      {{ label }}
      <span class="radio" />
    </label>
  </div>
</template>
<script>
const debug = require('debug')('CLIENT:RadioItem')
export default {
  name: 'RadioItem',
  /* eslint-disable */
  props: [
    'label',
    'value',
    'name',
    'disabled',
    'currSelected',
    'theme',
    'fontSize'
  ],
  /* eslint-enable */
  data () {
    return {
      checkedStatus: false
    }
  },
  mounted () {
    this.$el.ondragstart = function () { return false }
    this.$el.onselectstart = function () { return false }
  },
  methods: {
    change () {
      debug(this.$refs[ 'radio' ].checked)
      this.$emit('update:currSelected', this.value)
    }
  }
}
</script>
<style lang="stylus" scoped>
  .radio-container
    cursor pointer
    &.admin
      font-size 0.9375rem
      font-weight 300
    &.disabled
      .radio--mock
        cursor default
    .radio--hidden
      display none
      &:checked ~ .radio--mock
        > .radio
          background-color #000
    .radio--mock
      position relative
      padding-left 20px
      cursor pointer
      > .radio
        display block
        position absolute
        left 0
        top 50%
        border solid 1px #000
        border-radius 50%
        width 16px
        height 16px
        margin-top -8px
    &.checkbox
      .radio--hidden
        &:checked ~ .radio--mock
          > .radio
            background-color #ddcf21
            border solid 1px #ddcf21
            box-shadow 0 0 15px rgba(0, 0, 0, 0.1)
            &:after
              display block
      .radio--mock
        padding-left 25px
        > .radio
          border-radius 0
          border solid 1px #e3e3e3
          &:after
            content ""
            position absolute
            display none

            left 5px
            top 2px
            width 5px
            height 10px
            border solid white
            border-width 0 3px 3px 0
            transform: rotate(45deg)

</style>
