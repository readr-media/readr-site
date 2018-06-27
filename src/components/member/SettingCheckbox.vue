<template>
  <div class="checkbox__container" @click="toggle">
    <div class="checkbox" :class="{ checked: isChecked, }"></div>
    <slot></slot>
  </div>
</template>
<script>
  export default {
    name: 'SettingCheckbox',
    data () {
      return {
        isChecked: false,
      }
    },
    methods: {
      toggle () {
        this.isChecked = !this.isChecked
      },
    },
    mounted () {
      this.isChecked = this.value || false
    },
    props: {
      value: {
        type: Boolean,
      },
    },
    watch: {
      isChecked () {
        this.$emit('update:value', this.isChecked)
      },
    },
  }
</script>
<style lang="stylus" scoped>
  .checkbox
    display inline-block
    height 10px
    width 10px
    border 1px solid #000
    margin-right 5px
    &.checked
      background-color #000
    &__container
      cursor pointer
      
</style>