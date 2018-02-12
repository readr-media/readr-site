<template>
  <figure class="projects-figure">
    <div class="projects-figure__img" :style="{ 'backgroundImage': `url(${project.heroImage})` }"></div>
    <figcaption class="projects-figcaption">
      <div class="projects-figcaption__share">
        <AppShareButton :shareUrl="'www.google.com.tw'" :direction="'down'"/>
      </div>
      <p class="projects-figcaption__date" v-text="updatedAtYYYYMMDD(project)"></p>
      <h1 class="projects-figcaption__title" v-text="project.title"></h1>
      <p class="projects-figcaption__description" v-text="project.description"></p>
      <AppArticleNav :commentContainerSelector="'.projects-figure__comment'" :articleType="'project'" :postId="project.id" :commentCount="project.commentAmount || 0"/>
      <div class="projects-figure__comment">
        <div :class="`comment comment-${project.id}`"></div>
      </div>
    </figcaption>
  </figure>
</template>

<script>
import { updatedAtYYYYMMDD } from '../../util/comm'
import AppShareButton from 'src/components/AppShareButton.vue'
import AppArticleNav from 'src/components/AppArticleNav.vue'

export default {
  props: {
    project: {
      type: Object,
      required: true
    }
  },
  components: {
    AppShareButton,
    AppArticleNav
  },
  methods: {
    updatedAtYYYYMMDD
  }
}
</script>

<style lang="stylus" scoped>
.projects-figure
  width 650px
  height inherit
  margin 0
  background-color white
  & + &
    margin-top 10px
  &__img
    width 650px
    height 341.5px
    background-size cover
    background-position center center
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


