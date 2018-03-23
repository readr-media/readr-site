<template>
  <div>
    <slot v-for="(t, i) in slotItems" :name="i"></slot>
  </div>
</template>
<script>
  
  export default {
    name: 'ControlBarButtonBox',
    props: {
      amount: {
        type: Number,
        default: 0,
      },
    },
    computed: {
      slotItems () {
        const items = []
        items.length = this.amount
        return items
      },
    },
    mounted () {
      this.$emit('changeBtnAmount', true)
    },
    destroyed () {
      this.$emit('changeBtnAmount', false)
    },
  }
</script>
<style lang="stylus" scoped></style>
