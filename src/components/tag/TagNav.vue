<template>
  <section class="tag-nav">
    <span v-for="tag in tags" :key="tag.id" v-text="tag.text"></span>
  </section>
</template>
<script>
  export default {
    name: 'TagNav',
    props: {
      tags: {
        default: () => [],
      },
    },
  }
</script>
<style lang="stylus" scoped>

.tag-nav
  span
    display inline-block
    padding 0 .5em
    margin 5px 0 0
    font-size .9375rem
    line-height 1.5rem
    font-weight 700
    border 1px solid #11b8c9
    border-radius 12px
    user-select none
    &:first-of-type
      position relative
      margin-left 20px
      &::before
        content '#'
        position absolute
        top 0
        left -20px
        color #11b8c9
        font-size 1.5rem
    & + span
      margin-left 5px

</style>