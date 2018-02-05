<template>
  <section class="home-list-aside">
    <div class="home-list-aside__title">
      <div class="plus"></div>
      <h1>焦點</h1>
    </div>
    <HomeArticleAside v-for="post in posts" :articleData="post" :key="post.id"/>
  </section>
</template>

<script>
import HomeArticleAside from './HomeArticleAside.vue'

export default {
  components: {
    HomeArticleAside
  },
  computed: {
    posts () {
      return this.$store.state.publicPostsHot.items
    }
  }
}
</script>

<style lang="stylus" scoped>
.home-list-aside
  width 355px
  margin-left 35px
  background-color white
  padding 5px 15px 22.5px 15px
  // height auto
  &__title
    display flex
    align-items center
    .plus
      length = 18px
      display inline-block
      width length
      height length
      position relative
      margin-right 7.5px
      // CSS based plus sign
      &::before
        content ''
        width length
        height 4px
        background-color #ddcf21
        position absolute
        top 0
        bottom 0
        left 0
        right 0
        margin auto
      &::after
        content ''
        width 4px
        height length
        background-color #ddcf21
        position absolute
        top 0
        bottom 0
        left 0
        right 0
        margin auto
    h1
      display inline
      font-size 18px
      font-weight 600
      margin 0
      // &::before
      //   content '＋'
      //   font-weight bold
      //   color #ddcf21
      //   margin-right 7.5px
</style>
