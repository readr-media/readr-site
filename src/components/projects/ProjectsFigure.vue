<template>
  <a :href="projectUrl" target="_blank" class="projects-figure">
    <img class="projects-figure__img" :src="project.heroImage">
    <figcaption class="projects-figcaption">
      <div class="projects-figcaption__share">
        <!-- <AppShareButton :shareUrl="'www.google.com.tw'" :direction="'down'"/> -->
      </div>
      <p class="projects-figcaption__date" v-text="updatedAtYYYYMMDD(project.updatedAt)"></p>
      <h1 class="projects-figcaption__title" v-text="project.title"></h1>
      <p class="projects-figcaption__description" v-text="project.description"></p>
      <AppArticleNav :articleType="'project'" :postId="project.id" :commentCount="project.commentAmount || 0"/>
    </figcaption>
  </a>
</template>

<script>
import { updatedAtYYYYMMDD, getProjectUrl, } from '../../util/comm'
import AppShareButton from 'src/components/AppShareButton.vue'
import AppArticleNav from 'src/components/AppArticleNav.vue'

export default {
  props: {
    project: {
      type: Object,
      required: true,
    },
  },
  components: {
    AppShareButton,
    AppArticleNav,
  },
  computed: {
    projectUrl () {
      if (this.project.slug) {
        return getProjectUrl(this.project.slug)
      }
      return '/'
    },
  },
  methods: {
    updatedAtYYYYMMDD,
  },
}
</script>

<style lang="stylus" scoped>
.projects-figure
  width 650px
  height inherit
  margin 0
  background-color white
  color black
  & + &
    margin-top 10px
  &__img
    width 650px
    height 341.5px
    object-fit cover
  &__comment
    margin-top 20px

.projects-figcaption
  padding 15px 25px 19px 20px
  min-height 186.5px
  position relative
  display flex
  flex-direction column
  &__share
    width 25px
    height 25px
    position absolute
    top 15px
    right 25px
  &__date
    margin 0
    font-size 14px
    font-weight normal
  &__title
    margin 5px 0 0 0
    font-size 18px
    font-weight normal
  &__description
    margin 10px 0 8.5px 0
    font-size 15px
    font-weight 300
</style>


