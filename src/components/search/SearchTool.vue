<template>
  <div class="search">
    <div class="search--mobile">
      <img src="/public/icons/search-white.png" alt="" @click="toggleSearchBar">
      <section ref="searchBar" class="searchBar" @click.self="toggleSearchBar">
        <form action=".">
          <input
            ref="searchInput"
            v-model="currentSearchVal"
            type="text"
            :placeholder="$t('HEADER.SEARCH')"
            @change="checkIsChanged"
            @keyup="setCurrVal">
          <button @click.prevent="toggleSearchBar"><img src="/public/icons/close-grey.png" alt=""></button>
        </form>
      </section>
    </div>
    <div class="search--desktop">
      <input class="search__input" type="text" ref="searchInput"
        :placeholder="$t('HEADER.SEARCH')"
        v-model="currentSearchVal"
        @keyup="setCurrVal"
        @change="checkIsChanged">
      <span class="search__icon" @click="goSearch"></span>
    </div>
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
      }
    },
    computed: {
      searchVal () {
        return get(this.$route, 'params.keyword',)
      },
    },
    methods: {
      toggleSearchBar () {
        this.$refs.searchBar.classList.toggle('active')
      },
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
    img
      width 20px
      height 20px
    &--desktop
      display none
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
  .searchBar
    position absolute
    top -100vh
    left 0
    right 0
    z-index 1000
    width 100%
    height 100vh
    background-color rgba(0, 0, 0, .4)
    overflow hidden
    &.active
      top 0
      form
        top 0
    form
      position relative
      top -50px
      width 100%
      height 50px
      padding 5px 55px 5px 15px
      background-color #fff
      transition top 0.35s ease-out
      input
        width 100%
        height 100%
        padding 0 0 0 5px
        border none
        outline none
    button
      position absolute
      top 5px
      right 15px
      width 40px
      height 40px
      padding 2.5px
      background-color transparent
      border none

  @media (min-width 769px)
    .search
      &--mobile
        display none
      &--desktop
        display block
</style>