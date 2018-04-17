<template>
  <div class="about">
    <div class="about__container">
      <app-tab class="about__tab" :tabs="tabs">
        <article slot="0" class="about__content" v-html="aboutContent">
        </article>
      </app-tab>
    </div>
  </div>
</template>

<script>
  import { ABOUT_CONTENT, } from '../constants/about'
  import Tab from '../components/Tab.vue'

  export default {
    name: 'PublicAbout',
    components: {
      'app-tab': Tab,
    },
    data () {
      return {
        aboutContent: ABOUT_CONTENT,
        tabs: [
          this.$t('ABOUT.TAB_TITLE'),
        ],
      }
    },
  }
</script>

<style lang="stylus" scoped>
  .about
    width 100%
    min-height 100vh
    &__container
      padding-top 22.5px
    &__aside
      display none
      position sticky
      top 60px
      width 75px
      height 100%
    &__content
      >>> h3
        margin-top 0
        font-size 1.5rem
        line-height 1
      >>> p
        font-size .9375rem
        text-align justify
        line-height 1.5
        &:last-of-type
          margin-bottom 0
  @media (min-width 950px)
    .about
      &__container
        display flex
        justify-content space-between
        align-items flex-start
        width 100%
      &__tab
        width 100%
        max-width 950px
        margin 0 auto
        background-color #fff
</style>


