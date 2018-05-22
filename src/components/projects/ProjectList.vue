<template>
  <section class="project-list">
    <template v-for="(p, i) in projects">
      <div :key="p.id" class="project-block">
        <div class="project-block__index" v-text="i + 1"></div>
        <div class="project-block__info">
          <a :href="`/series/${p.id}`"><h2 v-text="p.title"></h2></a>
          <AppArticleNav :articleType="'project'" :postId="p.id" :commentCount="p.commentAmount || 0"/>
        </div>
      </div>
    </template>
  </section>
</template>

<script>

import AppArticleNav from 'src/components/AppArticleNav.vue'

export default {
  name: 'ProjectList',
  components: {
    AppArticleNav,
  },
  props: {
    projects: {
      type: Array,
      required: true,
    },
  },
}
</script>

<style lang="stylus" scoped>
  
    
  .project-block
    display flex
    padding 10px
    & + .project-block
      border-top 1px solid #979797
    &__index
      min-width 30px
      color #808080
      font-size 2.5rem
      text-align center
    &__info
      flex 1
      margin-left 10px
      a
        color #000
      h2
        margin 0 0 5px 0
        font-size .9375rem
</style>


