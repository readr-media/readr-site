<template>
  <section class="app-titled-list">
    <div class="app-titled-list__title">
      <h1 v-text="listTitle"></h1>
      <div class="triangle"></div>
    </div>
    <div class="app-titled-list__content">
      <slot></slot>
    </div>
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
  & + &
    margin-top 23px !important
  &__title
    display flex
    padding 0 0 5px 20px
    border-bottom solid 3px #ddcf21
    // .plus
    //   length = 18px
    //   display inline-block
    //   width length
    //   height length
    //   position relative
    //   margin-right 7.5px
    //   // CSS based plus sign
    //   &::before
    //     content ''
    //     width length
    //     height 4px
    //     background-color #ddcf21
    //     position absolute
    //     top 0
    //     bottom 0
    //     left 0
    //     right 0
    //     margin auto
    //   &::after
    //     content ''
    //     width 4px
    //     height length
    //     background-color #ddcf21
    //     position absolute
    //     top 0
    //     bottom 0
    //     left 0
    //     right 0
    //     margin auto
    h1
      font-size 18px
      font-weight 600
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
  &__content
    background-color white
    padding-bottom 12px
</style>
