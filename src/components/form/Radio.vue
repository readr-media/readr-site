<template>
  <div class="radio-container" :class="{ disabled: disabled }">
    <input type="radio" class="radio--hidden" :name="name" :id="`${name}${value}`" :disabled="disabled" :checked="value === initValue">
    <label class="radio--mock" @click="clickHandler" :for="`${name}${value}`">
      {{ label }}
      <span class="radio"></span>
    </label>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        selected: false
      }
    },
    name: 'radio',
    methods: {
      clickHandler () {
        !this.disabled && this.$emit('selected', this.name, this.value)
      }
    },
    mounted () {},
    props: [ 'label', 'value', 'name', 'disabled', 'initValue' ]
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