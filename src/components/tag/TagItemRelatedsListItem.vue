<template>
  <li class="list-item">
    <router-link to="/" class="list-item__link">
      <figure class="figure">
        <img class="figure__img" src="https://www.mirrormedia.mg/projects/political-contribution/ogimage-story4.jpg" alt="">
        <figcaption class="figure__figcaption">
          <h1 class="figure__figcaption-category figure__figcaption-category--yellow" v-text="$t('TAG_NAV_ASIDE.CATEGORY.PROJECT')"></h1>
          <p class="figure__figcaption-title">title</p>
        </figcaption>
      </figure>
    </router-link>
  </li>
</template>

<style lang="stylus" scoped>
.list-item
  padding 6px 0
  &__link
    color black

.figure
  display flex
  flex-direction row-reverse
  justify-content space-between
  margin 0
  &__figcaption
    font-size 10px
    padding 0 13.5px 0 0
  &__img
    d = 50px
    width d
    min-width d
    height d
    min-height d
    object-fit cover
  &__figcaption-category
    display inline
    font-size inherit
    margin 0
    padding 1px 3px
    &--yellow
      background-color #ddcf21
  &__figcaption-title
    line-height 1.5
    margin 0
</style>
