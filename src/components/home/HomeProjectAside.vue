<template>
  <section class="home-project-aside">
    <div class="home-project-aside__project-image" :style="{ backgroundImage: `url(${featuredProject.heroImage}` }"></div>
    <div class="home-project-aside__content">
      <h1 class="home-project-aside__project-title" v-text="featuredProject.title"></h1>
      <AppArticleNav :articleType="'project'" :postId="featuredProject.id" :commentCount="featuredProject.commentAmount || 0"/>
    </div>
  </section>
</template>

<script>
import AppArticleNav from 'src/components/AppArticleNav.vue'
import _ from 'lodash'

export default {
  components: {
    AppArticleNav
  },
  computed: {
    featuredProject () {
      return _.get(this.$store, 'state.projectsList.items[0]', {})
    }
  }
}
</script>


<style lang="stylus" scoped>
.home-project-aside
  &__project-image
    width 100%
    height 236.4px
    margin-top 5px
    background-repeat no-repeat
    background-size cover
    background-position center center
  &__content
    padding 0 20px
  &__project-title
    font-size 15px
    text-align justify
    margin 8.1px 0 6px 0
  &__comment
    margin-top 20px

$icon-size
  width 25px
  height 25px
.article-nav
  margin-top 10px
  min-height 25px

.comment-icon
  cursor pointer
  &__thumbnail
    @extends $icon-size
  &__count
    position relative
    right 5px
    font-size 14px
    color #11b8c9
.follow-icon
  @extends $icon-size
  margin-left 4.5px
  cursor pointer
</style>

