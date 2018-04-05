<template>
  <div class="about">
    <div class="about__container">
      <aside class="about__aside">
        <app-aside-nav></app-aside-nav>
      </aside>
      <main class="about__main">
        <app-tab class="about__tab" :tabs="tabs">
          <article slot="0" class="about__content" v-html="aboutContent">
          </article>
        </app-tab>
      </main>
    </div>
  </div>
</template>

<script>
  import { ABOUT_CONTENT, } from '../constants/about'
  import AppAsideNav from '../components/AppAsideNav.vue'
  import Tab from '../components/Tab.vue'

  export default {
    name: 'PublicAbout',
    components: {
      'app-aside-nav': AppAsideNav,
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
      padding-top 37px
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
        max-width 1200px
        height 100%
        margin auto
        padding 60px 0
        display flex
      &__aside
        display block
      &__main
        display flex
        justify-content space-between
        align-items flex-start
        width 100%
        margin-left 40px
      &__tab
        width 100%
        max-width 950px
        margin 0 auto
        background-color #fff
</style>


