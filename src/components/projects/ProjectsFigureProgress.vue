<template>
  <figure class="projects-figure-progress">
    <h2 v-text="projectName"></h2>
    <nav class="projects-figure-progress__nav">
      <button class="projects-figure-progress__button" v-text="`${projectProgress}%`"></button>
      <!-- <button class="projects-figure-progress__button"><img src="/public/icons/encoruage-white.png" alt=""></button> -->
    </nav>
  </figure>
</template>

<script>

import { get, } from 'lodash'

export default {
  name: 'ProjectsFigureProgress',
  props: {
    project: {
      type: Object,
      default: {},
    },
  },
  computed: {
    projectName () {
      return get(this.project, [ 'title', ])
    },
    projectProgress () {
      return get(this.project, [ 'progress', ])
    },
  },
}

</script>

<style lang="stylus" scoped>
.projects-figure-progress
  display flex
  max-height 75px
  margin 0
  background-color white
  border-bottom 1px solid #d3d3d3
  overflow hidden
  h2
    flex 1
    
    margin 0
    padding-left 15px
    font-size 1.5rem
    font-weight 400
    line-height 74px
  &__nav
    display flex
    flex-direction column
    justify-content space-between
  &__button
    width 37px
    height 74px
    border none
    background-color #11b8c9
    display flex
    justify-content center
    align-items center
    font-size 12px
    font-weight 600
    color white
    & > img
      width 19px
    &:focus
      outline none
</style>

