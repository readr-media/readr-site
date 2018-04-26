<template>
  <section class="home-project-aside">
    <template v-for="(project, i) in projectsDone">
      <div class="home-project-aside__container">
        <a :href="projectsUrl[i]" target="_blank"><img class="home-project-aside__project-image" :src="project.heroImage ? project.heroImage : '/public/icons/readr-logo.png'"></a>
        <div class="home-project-aside__content">
          <a :href="projectsUrl[i]" target="_blank"><h1 class="home-project-aside__project-title" v-text="project.title"></h1></a>
        </div>
        <div class="home-project-aside__comment">
          <AppArticleNav :articleType="'project'" :postId="project.id" :commentCount="project.commentAmount || 0"/>
        </div>
      </div>
    </template>
  </section>
</template>

<script>
import AppArticleNav from 'src/components/AppArticleNav.vue'
import { get, } from 'lodash'
import { getProjectUrl, } from 'src/util/comm'

export default {
  components: {
    AppArticleNav,
  },
  computed: {
    // featuredProject () {
    //   return get(this.$store, 'state.projectsList.items[0]', {})
    // },
    projectsDone () {
      return get(this.$store, [ 'state', 'publicProjects', 'done', ], [])
    },
    projectsUrl () {
      return this.projectsDone.map(project => {
        if (project.slug) {
          return getProjectUrl(project.slug)
        }
        return '/'
      })
    },
    // projectsInProgress () {
    //   return get(this.$store, [ 'state', 'publicProjects', 'inProgress', ], [])
    // },
  },
}
</script>


<style lang="stylus" scoped>
.home-project-aside
  &__container
    position relative
    display flex
    justify-content space-between
    flex-wrap wrap
    width 100%
    padding 15px
    color black
    &:not(:first-of-type)
      margin-top -25px
    > a
      font-size 0
    
  &__project-image
    width 120px
    height 120px
    
    object-fit cover
  &__content
    flex 1
    display flex
    flex-direction column
    
    justify-content space-between
    margin-left 20px
    padding-bottom 25px
    
  &__project-title
    color #000
    font-size 1.125rem
    text-align justify
    margin 2px 0 0 
  &__comment
    position relative
    top -15px
    width 100%

$icon-size
  width 25px
  height 25px
.article-nav
  
  width 100%
  min-height 25px
  margin 0 auto
>>> .article-nav__nav-btns
  padding-left 140px

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

