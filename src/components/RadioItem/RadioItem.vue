<template>
  <label class="wrapper">
    <input
      v-model="radioButtonValue"
      class="wrapper__input input"
      type="radio"
      :value="value"
    >
    <span class="wrapper__checkmark checkmark" />
    <span class="wrapper__label label">
      <slot />
    </span>
  </label>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      required: true
    },
    valueSelected: {
      type: String,
      required: true
    }
  },
  computed: {
    radioButtonValue: {
      get () {
        return this.valueSelected
      },
      set () {
        this.$emit('change', this.value)
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.wrapper
  display flex
  align-items center
  position relative
  cursor pointer
  &__input
    position absolute
    opacity 0
  &__label
    margin 0 0 0 10px
    font-size 1.5rem

.input
  &:checked + .checkmark
    &:after
      background-color #ddcf21

.checkmark
  d = 20px
  width d
  height d
  border-radius 50%
  box-shadow inset 0 1px 3px 0 rgba(0,0,0,0.5)
  border none
  background-color white
  display flex
  justify-content center
  align-items center
  &:after
    content ''
    d = 10px
    width d
    height d
    border-radius d
    background-color white
</style>
