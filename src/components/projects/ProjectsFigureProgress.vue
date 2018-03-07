<template>
  <figure class="projects-figure-progress">
    <div class="projects-figure-progress__img" :style="{ 'backgroundImage': `url(https://www.mirrormedia.mg/projects/20170801aboriginal/ogimage.jpg)` }"></div>
    <figcaption class="projects-figure-progress__figcaption">這議題有點讚</figcaption>
    <nav class="projects-figure-progress__nav">
      <button class="projects-figure-progress__button">66%</button>
      <button class="projects-figure-progress__button"><img src="/public/icons/encoruage-white.png" alt=""></button>
    </nav>
  </figure>
</template>

<style lang="stylus" scoped>
.projects-figure-progress
  margin 0
  display flex
  width 355px
  background-color white
  &__img
    width 75px
    height 75px
    background-size cover
    background-position center center
  &__figcaption
    padding 14.5px
    width calc(355px - 75px - 37px)
    font-size 15px
  &__nav
    display flex
    flex-direction column
    justify-content space-between
  &__button
    width 37px
    height 37px
    border none
    background-color #ddcf21
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

