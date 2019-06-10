<template>
  <section class="tab">
    <button
      v-for="(item, index) in items"
      :key="`tab-${item}`"
      :class="{ active: current === index }"
      @click="$emit('change', { index, item })"
      v-text="item"
    />
  </section>
</template>
<script>
export default {
  name: 'AppTab',
  props: {
    current: {
      type: Number,
      default: 0
    },
    items: {
      type: Array,
      default: () => []
    }
  }
}
</script>
<style lang="stylus" scoped>
defaultColor = #11b8c9

.tab
  display flex
  border 1px solid defaultColor
  button
    flex 1
    height 30px
    padding .2em 0
    color defaultColor
    & + button
      border-left 1px solid defaultColor
    &:hover, &.active
      color #fff
      background-color defaultColor

</style>
