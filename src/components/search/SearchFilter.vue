<template>
  <div class="search-filter">
    <div class="search-filter__title">
      <span v-text="$t('search.WORDING_SEARCH_FILTER_TITLE')"></span>
    </div>
    <div class="search-filter__container">
      <div class="icon">
        <img src="/public/icons/triangle-right.png">
      </div>
      <div class="items">
        <div class="item" :class="{ active: flag === item.key }" v-for="item in filters" @click="change(item.key)">
          <span v-text="item.name"></span>
        </div>
      </div>    
    </div>
  </div>
</template>
<script>
  export default {
    name: 'SearchFilter',
    data () {
      return {
        flag: 'post',
        filters: [
          { key: 'post', name: this.$t('search.WORDING_SEARCH_FILTER_VIEW'), },
          { key: 'project', name: this.$t('search.WORDING_SEARCH_FILTER_PROJECT'), },
        ],
      }
    },
    methods: {
      change (key) {
        this.flag = key
        this.$emit('searchChange', key)
      },
    },
  }
</script>
<style lang="stylus" scoped>
  .search-filter
    margin-bottom 20px
    &__title
      font-size 0.9375rem
      font-weight 600
      color #000
      margin-bottom 12px
    &__container
      display flex
      justify-content center
      align-items center
      > .icon
        height 18px
        width 15px
        margin-right 10px
        > img
          width 100%
          height 100%
          object-fit contain
      > .items
        > .item
          display inline-block
          margin-right 8px
          color #000
          font-size 1.125rem
          padding 2px 0
          cursor pointer
          &:not(:first-child)
            margin-left 8px
          &.active
            border-bottom 2px solid #000
            font-weight 600
</style>