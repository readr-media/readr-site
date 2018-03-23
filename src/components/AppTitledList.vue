<template>
  <section class="app-titled-list">
    <div class="app-titled-list__title">
      <div class="plus"></div>
      <h1 v-text="listTitle"></h1>
    </div>
    <slot></slot>
  </section>
</template>

<script>
export default {
  props: {
    listTitle: {
      type: String,
      required: true,
    },
  },
}
</script>

<style lang="stylus" scoped>
.app-titled-list
  background-color white
  padding 6px 0px 12px 0px
  &__title
    display flex
    align-items center
    padding 0 15px
    .plus
      length = 18px
      display inline-block
      width length
      height length
      position relative
      margin-right 7.5px
      // CSS based plus sign
      &::before
        content ''
        width length
        height 4px
        background-color #ddcf21
        position absolute
        top 0
        bottom 0
        left 0
        right 0
        margin auto
      &::after
        content ''
        width 4px
        height length
        background-color #ddcf21
        position absolute
        top 0
        bottom 0
        left 0
        right 0
        margin auto
    h1
      display inline
      font-size 18px
      font-weight 600
      margin 0
</style>
