<template>
  <div class="header">
    <div class="header__top">
      <div class="header__top__wrapper">
        <div class="logo"></div>
        <div class="sharebar">
          <span></span>
          <i class="sharebar__search"></i>
          <i class="sharebar__fb-page"></i>
          <i class="sharebar__github"></i>
          <i class="sharebar__about"></i>
        </div>
      </div>
    </div>
    <div class="header__bottom">
      <div class="header__bottom__wrapper">
        <div class="nav">
          <a v-for="(section, name) in sections" class="nav__item" :class="name" v-text="section" href="/"></a>
        </div>
        <div class="login-status">
          <div class="login-status__login-btn"></div>
          <div class="login-status__logout-btn"></div>
          <div class="login-status__nickname"></div>
          <div class="login-status__icon"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

  export default {
    computed: {},
    name: 'header',
    methods: {},
    mounted () {},
    props: [ 'sections' ]
  }
</script>
<style lang="stylus" scoped>
  .header
    > div
      width 100%
      > div
        width 100%
        margin 0 auto
    &__top
      height 45px
      background-color #444746
      &__wrapper
        padding 5px 0
        height 100%
        display flex
        justify-content space-between
        align-items center
        // > div
          // display inline-block
        .logo
          background-image url(/public/icons/readr-logo.png)
          background-position center center
          background-repeat no-repeat
          background-size contain
          width 38px
          height 35px
        .sharebar
          > i
            background-position center center
            background-repeat no-repeat
            background-size contain
            width 20px
            height 20px
            display inline-block
            margin-left 7px
            vertical-align top
            cursor pointer
          &__search
            background-image url(/public/icons/search.png)
          &__fb-page
            background-image url(/public/icons/fb.png)
          &__github
            background-image url(/public/icons/github.png)
          &__about
            background-image url(/public/icons/info.png)

    &__bottom
      height 25px
      background-color #000
      color #fff
      &__wrapper
        height 100%
        display flex
        align-items center
        // justify-content center
        .nav
          display flex
          align-items center
          &__item
            color #fff
            display inline-block
            font-size 0.75rem
            // margin-right 26.5px
            border-right 1px solid #fff
            padding 0 13px
          &__item:first-child
            border-left 1px solid #fff
        .login-status
          min-width 74px
          padding 0 11px
  @media (min-width 720px)
    .header
      > div
        > div
          max-width 720px
</style>