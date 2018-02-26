<template>
  <div class="search">
    <input class="search__input" type="text" :placeholder="wording[ 'WORIDNG_HEADER_MEMBER_SEARCH' ]">
    <span class="search__icon" @click="goSearch"></span>
  </div>
</template>
<script>
  import { WORIDNG_HEADER_MEMBER_SEARCH } from 'src/constants'

  export default {
    name: 'SearchTool',
    data () {
      return {
        wording: {
          WORIDNG_HEADER_MEMBER_SEARCH
        }
      }
    },
    methods: {
      goSearch () {
        location.href = '/search'
      }
    },
    mounted () {},
  }
</script>
<style lang="stylus" scoped>
  .search
    background-color #fff
    padding 0 5px 0 8px

    &__input
      outline none
      border none
      height 20px
    &__icon
      display inline-block
      width 15px
      height 20px
      background-image url('/public/icons/search-grey.png')
      background-position center center
      background-repeat no-repeat
      background-size contain
      vertical-align top
      cursor pointer
</style>