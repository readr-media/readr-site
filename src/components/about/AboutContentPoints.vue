<template>
  <section class="about-points">
    <div class="about-points__close" @click="clickClose">
      <img src="/public/icons/shutdown.jpg" alt="">
    </div>
    <section class="about-points__content content">
      <img class="content__title" src="/public/about-points/title.png" alt="">
      <ol class="content__articles-list articles-list">
        <li
          class="articles-list__list-item list-item"
          v-for="order in 6"
          :key="order"
        >
          <div class="list-item__order">
            <img :src="`/public/about-points/q${order}.png`" alt=""> 
          </div>
          <div class="list-item__content" v-html="createPointsIntroContent(memberCenter)[order - 1]"></div>
        </li>
      </ol>
    </section>
    <footer class="about-points__footer" v-html="FOOTER_MESSAGE"></footer>
  </section>
</template>

<script>
import { get, filter, } from 'lodash'
import { ROLE_MAP, } from 'src/constants'
import { createPointsIntroContent, POINTS_INTRO_CONTENT, FOOTER_MESSAGE, } from 'src/constants/pointsIntro'

export default {
  data () {
    return {
      POINTS_INTRO_CONTENT,
      FOOTER_MESSAGE,
    }
  },
  computed: {
    memberCenter () {
      return get(filter(ROLE_MAP, { key: get(this.$store, 'state.profile.role',), }), [ 0, 'route', ], 'member')
    },
  },
  methods: {
    clickClose () {
      this.$emit('clickClose')
    },
    createPointsIntroContent,
  },
}
</script>

<style lang="stylus" scoped>
.about-points
  position fixed
  top 0
  left 0
  z-index 1000
  width 100%
  height 100vh
  background-color white
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
  &__content
    width 773.7px
    margin 0 auto
  &__footer
    height 74px
    background-color #444746
    display flex
    justify-content center
    align-items center
    & >>> p
      margin 0
      color white
      font-size 15px
      font-weight 600
      a
        color #ddcf21

.content
  padding 42px 0
  &__title
    width 100%
  &__articles-list
    margin 26px 0 0 0
    padding 0 83px
    list-style none

.articles-list
  &__list-item
    & + &
      margin 19px 0 0 0

.list-item
  display flex
  &__order
    min-width 92px
    max-width 92px
    & > img
      width 100%
  &__content
    margin 0 0 0 22px
    color #444746
    & >>> h1
      font-size 25px
      font-weight 600
      margin 25px 0 15px 0
    & >>> h2
      font-size 18px
      font-weight normal
      letter-spacing .5px
      margin 25px 0
      color white
      span
        display inline-block
        padding 5px 10px
        background-color #11b8c9
    & >>> p
      font-size 15px
      line-height 1.6
      letter-spacing .5px
      text-align justify
      margin 5px 0
      &.more-margin
        margin 25px 0
      &.bold
        font-weight 600
      a
        color #11b8c9
        text-decoration underline
      .lock-icon
        height 11.5px
        margin 0 5px
      .donate-icon
        height 20px
        margin 0 5px
        position relative
        top 3px
</style>

