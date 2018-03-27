<template>
  <div class="search">
    <input class="search__input" type="text" ref="searchInput"
      :placeholder="$t('header.WORIDNG_HEADER_MEMBER_SEARCH')"
      @keyup="setCurrVal"
      @change="checkIsChanged">
    <span class="search__icon" @click="goSearch"></span>
  </div>
</template>
<script>
  import { get, } from 'lodash'

  const debug = require('debug')('CLIENT:SearchTool')
  export default {
    name: 'SearchTool',
    data () {
      return {
        currentSearchVal: get(this.$refs, 'searchInput.value'),
        isChanged: true,
        // searchVal: get(this.$route, [ 'params', 'keyword' ]),
      }
    },
    computed: {
      searchVal () {
        return get(this.$route, [ 'params', 'keyword', ])
      },
    },
    methods: {
      checkIsChanged () {
        debug('Change Detected.', this.searchVal, this.currentSearchVal)
        if (this.searchVal !== this.currentSearchVal) {
          this.isChanged = true
        } else {
          this.isChanged = false
        }
      },
      goSearch () {
        debug('this.isChanged', this.isChanged)
        debug('this.currentSearch', this.currentSearchVal)
        debug('this.searchVal', this.searchVal)
        if (this.searchVal !== this.currentSearchVal && this.currentSearchVal) {
          this.$router.push('/search/' + this.currentSearchVal)
        }
      },
      setCurrVal () {
        debug('Abt to change current search words to:', get(this.$refs, 'searchInput.value'))
        this.currentSearchVal = get(this.$refs, 'searchInput.value')
      },
    },
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