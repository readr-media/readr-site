<template>
  <div class="search">
    <input class="search__input" type="text" ref="searchInput"
      :placeholder="$t('header.WORIDNG_HEADER_MEMBER_SEARCH')"
      v-model="currentSearchVal"
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
        isChanged: false,
        // searchVal: get(this.$route, [ 'params', 'keyword' ]),
      }
    },
    computed: {
      searchVal () {
        return get(this.$route, [ 'params', 'keyword', ])
      },
    },
    methods: {
      checkIsChanged (e) {
        debug('Change Detected.', this.searchVal, this.currentSearchVal)
        debug('enter?', e.keyCode)
        this.isChanged = true
      },
      goSearch () {
        debug('this.currentSearch', this.currentSearchVal)
        debug('this.searchVal', this.searchVal)
        if (this.searchVal !== this.currentSearchVal && this.currentSearchVal) {
          this.$router.push('/search/' + this.currentSearchVal)
          debug('Go search!')
        }
      },
      setCurrVal (e) {
        debug('Abt to change current search words to:', get(this.$refs, 'searchInput.value'))
        debug('isChanged', this.isChanged)
        if (e.keyCode === 13 && this.isChanged) {
          this.goSearch()
        }
        this.isChanged = false
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