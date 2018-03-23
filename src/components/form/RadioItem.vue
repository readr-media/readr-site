<template>
  <div class="radio-container" :class="{ disabled: disabled }">
    <input type="radio" class="radio--hidden" ref="radio"
      :name="name"
      :id="`${name}${value}`"
      :disabled="disabled"
      :checked="value === currSelected"
      :value="value"
      @change="change">
    <label class="radio--mock" :for="`${name}${value}`">
      {{ label }}
      <span class="radio"></span>
    </label>
  </div>
</template>
<script>
  const debug = require('debug')('CLIENT:RadioItem')
  export default {
    data () {
      return {
        checkedStatus: false,
      }
    },
    name: 'RadioItem',
    methods: {
      change () {
        debug(this.$refs[ 'radio' ].checked)
        this.$emit('update:currSelected', this.value)
      },
    },
    mounted () {},
    props: [ 'label', 'value', 'name', 'disabled', 'currSelected', ],
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
</style>
