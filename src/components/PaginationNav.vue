<template>
  <div class="pagination-nav" ref="pagination">
    <template v-if="totalPages > 0">
      <div class="pagination-nav__prev" @click="clickPrev">&lt;</div>
      <div class="pagination-nav__rest" @click="clickPrev" v-if="showLeftRest">...</div>
      <div class="pagination-nav__page" :class="{ active: i === currPage }" v-for="i in activePages" v-text="i" @click="clickHandler(i)"></div>
      <div class="pagination-nav__rest" @click="clickNext" v-if="showRightRest">...</div>
      <div class="pagination-nav__next" @click="clickNext">&gt;</div>
    </template>
  </div>
</template>
<script>
  const debug = require('debug')('CLIENT:PaginationNav')
  export default {
    computed: {
      activePages () {
        const pagesArr = []
        if (this.currPage < 4) {
          this.setRestPage('right')
          debug('this.currPage < 4', this.currPage)
          for (let i = 0; i < 5; i += 1) {
            if (i + 1 > this.totalPages) { continue }
            pagesArr.push(i + 1)
          }
        } else if (this.currPage > this.totalPages - 3) {
          const base = this.totalPages <= 5 ? 0 : this.totalPages - 5
          debug('this.currPage > this.totalPages - 3', this.currPage, this.totalPages - 3)
          this.setRestPage('left')
          for (let i = base; i < this.totalPages; i += 1) {
            pagesArr.push(i + 1)
          }
        } else {
          this.setRestPage('both')
          debug('else', this.currPage)
          for (let i = this.currPage - 3; i < this.currPage + 2; i += 1) {
            pagesArr.push(i + 1)
          }
        }
        debug('activePages', pagesArr)
        return pagesArr
      },
    },
    data () {
      return {
        curr_page: this.currPage,
        showLeftRest: false,
        showRightRest: false,
      }
    },
    name: 'PaginationNav',
    methods: {
      clickHandler (i) {
        this.curr_page = i
        debug('this.currPage', i)
      },
      clickPrev () {
        this.curr_page = this.curr_page > 1 ? this.curr_page - 1 : this.curr_page
      },
      clickNext () {
        this.curr_page = this.curr_page < this.totalPages ? this.curr_page + 1 : this.curr_page
      },
      setRestPage (restCase) {
        if (this.totalPages > 5) {
          switch (restCase) {
            case 'left':
              this.showLeftRest = true
              this.showRightRest = false
              break
            case 'right':
              this.showLeftRest = false
              this.showRightRest = true
              break
            case 'both':
              this.showLeftRest = true
              this.showRightRest = true
              break
          }
        }
      },
    },
    mounted () {
      debug('PaginationNav mounted')
      this.$refs[ 'pagination' ].addEventListener('dragstart', (e) => {
        e.preventDefault()
        return false
      }, false)
      this.$refs[ 'pagination' ].addEventListener('selectstart', (e) => {
        e.preventDefault()
        return false
      }, false)
    },
    props: {
      currPage: {
        default: 1,
      },
      totalPages: {
        default: 0,
      },
    },
    watch: {
      curr_page: function () {
        debug('Mutation detected: curr_page', this.curr_page)        
        this.$emit('update:currPage', this.curr_page)
      },
      totalPages: function () {
        debug('Mutation detected: totalPages', this.totalPages)
      },
    },
  }
</script>
<style lang="stylus" scoped>
  .pagination-nav
    font-size 0.875rem
    color #808080
    > div
      display inline-block
      cursor pointer
      margin 0 4px
    &__page
      &.active
        font-weight 600
        font-size 1rem
  .main-panel
    .pagination-nav
      margin-bottom 25px
      text-align right
</style>