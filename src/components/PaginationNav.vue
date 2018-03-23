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
  export default {
    computed: {
      activePages () {
        const pagesArr = []
        // const leng = this.totalPages > 5 ? 5 : this.totalPages
        if (this.currPage < 4) {
          this.setRestPage('right')
          for (let i = 0; i < 5; i += 1) {
            if (i + 1 > this.totalPages) { continue }
            pagesArr.push(i + 1)
          }
        } else if (this.currPage > this.totalPages - 3) {
          this.setRestPage('left')
          for (let i = this.totalPages - 5; i < this.totalPages; i += 1) {
            pagesArr.push(i + 1)
          }
        } else {
          this.setRestPage('both')
          for (let i = this.currPage - 3; i < this.currPage + 2; i += 1) {
            pagesArr.push(i + 1)
          }
        }
        return pagesArr
      },
    },
    data () {
      return {
        currPage: 1,
        showLeftRest: false,
        showRightRest: false,
      }
    },
    name: 'PaginationNav',
    methods: {
      clickHandler (i) {
        this.currPage = i
      },
      clickPrev () {
        this.currPage = this.currPage > 1 ? this.currPage - 1 : this.currPage
      },
      clickNext () {
        this.currPage = this.currPage < this.totalPages ? this.currPage + 1 : this.currPage
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
      totalPages: {
        default: 0,
      },
    },
    watch: {
      currPage: function () {
        this.$emit('pageChanged', this.currPage)
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
      // &.pagination-nav__rest
      //   cursor default
    &__page
      &.active
        font-weight 600
        font-size 1rem
  .main-panel
    .pagination-nav
      margin-bottom 25px
      text-align right
</style>