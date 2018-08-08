<template>
  <section class="home-project-aside">
    <template v-for="report in reports">
      <div :key="report.id" class="home-project-aside__container">
        <a class="home-project-aside__content" :href="getReportUrl(report.slug)" target="_blank">
          <h3 v-if="report.project.title" v-text="report.project.title"></h3>
          <h1 class="home-project-aside__project-title" v-text="report.title"></h1>
        </a>
        <a :href="getReportUrl(report.slug)" target="_blank"><img class="home-project-aside__project-image" :src="report.heroImage ? report.heroImage : '/public/icons/readr-logo.png'"></a>
        <div class="home-project-aside__comment">
          <AppArticleNav :articleType="'report'" :postId="report.id" :commentCount="report.commentAmount || 0" :toogleComment="false"/>
        </div>
      </div>
    </template>
  </section>
</template>

<script>
import AppArticleNav from 'src/components/AppArticleNav.vue'
import { get, } from 'lodash'
import { getReportUrl, } from 'src/util/comm'

export default {
  name: 'HomeAsideReport',
  components: {
    AppArticleNav,
  },
  computed: {
    reports () {
      return get(this.$store, [ 'state', 'publicReports', ], [])
    },
  },
  methods: {
    getReportUrl,
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
    padding 25px 15px 0
    color black
    &:not(:first-of-type)
      border-top 1px solid #d3d3d3
  &__project-image
    width 130px
    height 70px
    object-fit cover
    object-position center center
  &__content
    display flex
    flex-direction column
    width calc(100% - 150px)
    padding-bottom 25px
    h3
      margin 0 0 3px
      color #808080
      font-size .625rem
  &__project-title
    margin 2px 0 0 
    color #000
    font-size 1.125rem
    text-align left
    text-overflow ellipsis
    white-space nowrap
    overflow hidden
  &__comment
    position relative
    top -25px
    width 100%

$icon-size
  width 25px
  height 25px
.article-nav
  width 100%
  min-height 25px
  margin 0 auto

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

