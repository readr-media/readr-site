<template>
  <div class="public-page"><slot></slot></div>
</template>
<script>
  export default {
    name: 'PublicPageWithAside',
  }
</script>
<style lang="stylus" scoped>
.public-page
  width 100%
  position static
  padding-left 20px
  &__container
    display flex
  &__main
    width 650px
    display flex
    flex-direction column
    justify-content flex-start
    align-items flex-start
  &__aside
    margin-left 40px
    display flex
    flex-direction column
    justify-content flex-start
    align-items flex-start
    flex 1
    &-container
      width 100%
      background-color #fff
      padding 10px 15px
      margin-bottom 20px
    &.tags
      // width 250px
      height calc(100% - 40px)
      position absolute
      right 0
      top 0
      padding-top 25px

  &__main
    &-container
      width 650px
  &__tag-nav
    margin-bottom 20px
    >>> .tag
      background-color #fff

.aside-container
  position sticky
  top 65px
  background-color transparent
  &__tag-nav-aside
    height calc(100vh - 65px)
    padding 5.5px 0 28px 20px
    overflow-y scroll
    &::-webkit-scrollbar
      display none
      background-color transparent
    &::-webkit-scrollbar-track
      background-color transparent
    &::-webkit-scrollbar-thumb
      background-color transparent
</style>