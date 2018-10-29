<template>
  <div class="about">
    <div class="about__close" @click="clickClose">
      <img src="/public/icons/shutdown.jpg" alt="">
    </div>
    <section class="about__welcome">
      <div class="content">
        <img src="/public/icons/join.png" alt="">
        <div>
          <p v-text="$t('ABOUT.WELCOME.PARAGRAPH_1')"></p>
          <h1 v-text="$t('ABOUT.WELCOME.PARAGRAPH_2')"></h1>
          <p v-text="$t('ABOUT.WELCOME.PARAGRAPH_3')"></p>
          <p v-text="$t('ABOUT.WELCOME.PARAGRAPH_4')"></p>
        </div>
      </div>
    </section>
    <section class="about__transparent" :style="[ transparentHeight > 0 ? { height: `${transparentHeight}px` } : {} ]"></section>
    <section class="about__what-readr about--grid-line">
      <div class="content">
        <img class="title" src="/public/icons/about-title-1.png" alt="">
        <p v-text="$t('ABOUT.WHAT_READR.PARAGRAPH_1')"></p>
        <p v-text="$t('ABOUT.WHAT_READR.PARAGRAPH_2')"></p>
        <div class="text-with-img">
          <div>
            <ul>
              <li v-text="$t('ABOUT.WHAT_READR.PARAGRAPH_3')"></li>
              <li v-text="$t('ABOUT.WHAT_READR.PARAGRAPH_4')"></li>
              <li v-text="$t('ABOUT.WHAT_READR.PARAGRAPH_5')"></li>
              <li v-text="$t('ABOUT.WHAT_READR.PARAGRAPH_6')"></li>
            </ul>
            <p v-text="$t('ABOUT.WHAT_READR.PARAGRAPH_7')"></p>
          </div>
          <img src="/public/icons/about-flow.png" alt="">
        </div>
      </div>
    </section>
    <section class="about__what-guest-editor">
      <div class="content">
        <img class="title" src="/public/icons/about-title-2.png" alt="">
        <p v-text="$t('ABOUT.WHAT_GUEST_EDITOR.PARAGRAPH_1')"></p>
      </div>
    </section>
    <section class="about__how-member about--grid-line">
      <div class="content">
        <img class="title" src="/public/icons/about-title-3.png" alt="">
        <p v-text="$t('ABOUT.HOW_MEMBER.PARAGRAPH_1')"></p>
        <p v-text="$t('ABOUT.HOW_MEMBER.PARAGRAPH_2')"></p>
        <router-link class="to-about-points" to="points" v-text="$t('ABOUT.TO_ABOUT_POINTS')" append></router-link>
      </div>
    </section>
    <section class="about__info">
      <div class="content">
        <p><strong v-text="$t('ABOUT.COMPANY_NAME')"></strong></p>
        <p v-text="$t('ABOUT.COMPANY_ADDRESS')"></p>
        <p v-text="$t('ABOUT.PHONE_NUMBER')"></p>
      </div>
    </section>
  </div>
</template>
<script>
export default {
  name: 'AboutContent',
  data () {
    return {
      transparentHeight: 0,
    }
  },
  mounted () {
    this.transparentHeight = document.querySelector('.about__welcome').offsetHeight || 0
  },
  methods: {
    clickClose () {
      this.$emit('clickClose')
    },
  },
}
</script>
<style lang="stylus" scoped>
  .about
    position fixed
    top 0
    left 0
    right 0
    z-index 1000
    width 100%
    height 100vh
    background-color #11b8c9
    overflow-x hidden
    overflow-y auto
    &__close
      position absolute
      top 0
      right 0
      z-index 10
      width 50px
      cursor pointer
      img 
        width 100%
    &__transparent
      position relative
      z-index 1
      height 65vh
    &__welcome, &__how-member
      color #fff
      .content
        p
          font-weight 300
    &__welcome
      position fixed
      top 0
      left 0
      right 0
      width 100%
      padding 60px 0 20px
      margin 0 auto
      background-color #11b8c9
      .content
        display flex
        align-items flex-end
        > div
          margin-left 20px
      img
        width 220px
        height auto
        min-height 400px
    &__what-readr
      position relative
      z-index 1
      padding 120px 0
      background-color #fff
      clip-path polygon(0% 80px, 0% calc(100% - 80px), 100% 100%, 100% 0%)
      &.about--grid-line
        background-image url(/public/icons/about-grid-white.png)
        background-repeat repeat
        background-size 15px 15px
      .title
        position absolute
        top 0
        left -230px
        width 200px
        height 190px
      .content
        > div
          margin-top 1em
    &__what-guest-editor
      position relative
      z-index 1
      padding 60px 0
      background-color #d3d3d3
      &:before
        content ''
        position absolute
        top -80px
        left 0
        right 0
        width 100%
        height 80px
        background-color #d3d3d3
        clip-path polygon(0% 0, 100% 78px, 100% 100%, 0% 100%)
      &:after
        content ''
        position absolute
        left 0
        right 0
        bottom -80px
        width 100%
        height 80px
        background-color #d3d3d3
        clip-path polygon(0% 0, 100% 0, 100% calc(100% - 78px), 0% 100%)
      .title
        position absolute
        top -55px
        left calc(-10% - 55px)
        width 240px
        height 153px
      .content
        padding-left 10%
    &__how-member
      padding 250px 0 60px
      background-color #444746
      clip-path polygon(0% 80px, 0% 100%, 100% 100%, 100% 0%)
      &.about--grid-line
        background-image url(/public/icons/about-grid-black.png)
        background-repeat repeat
        background-size 15px 15px
      .title
        position absolute
        top -185px
        right -190px
        width 380px
        height 165px
    &__info
      padding 15px 0
    
    .about__info
      .content
        width auto
        text-align center
        p
          display inline
          color #fff
          font-weight 300
          & + p
            margin-left 1.5em

    .content
      position relative
      // max-width 50%
      // width 60%
      width 600px
      margin 0 auto
      text-align justify
      line-height 1.67
      letter-spacing 1px
      h1
        font-size 1.5625rem
        font-weight 400
      p
        margin 0
        & + p
          margin-top 1em
      .text-with-img
        display flex
        align-items flex-start
        ul
          list-style-type none
          padding 0 0 0 35px
          li
            position relative
            margin-top 1em
            &:before
              content ''
              position absolute
              top 0
              left -35px
              width 30px
              height 30px
              background-size auto 25px
              background-repeat no-repeat
              background-position 50% 50%
          li:nth-of-type(1)
            &:before
              background-image url(/public/icons/about-list-first.png)
          li:nth-of-type(2)
            &:before
              background-image url(/public/icons/about-list-second.png)
          li:nth-of-type(3)
            &:before
              background-image url(/public/icons/about-list-third.png)
          li:nth-of-type(4)
            &:before
              background-image url(/public/icons/about-list-fourth.png)
        img
          width 325px
          margin-left 35px

  .to-about-points
    height 30px
    background-color #ddcf21
    color #454746
    display flex
    justify-content center
    align-items center
    margin 16px 0
    letter-spacing .5px
</style>
