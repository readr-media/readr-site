<template>
  <div class="external-links">
    <ol class="nav-list">
      <a class="nav-list__link" :href="URL_FB_FANPAGE" target="_blank">
        <li class="nav-list__list-item">
          <img src="/public/icons/fb-square.svg" alt="">
        </li>
      </a>
      <a class="nav-list__link" :href="URL_TWITTER" target="_blank">
        <li class="nav-list__list-item">
          <img src="/public/icons/twitter.png" alt="">
        </li>
      </a>
      <a class="nav-list__link" :href="URL_IG" target="_blank">
        <li class="nav-list__list-item">
          <img src="/public/icons/ig.png" alt="">
        </li>
      </a>
    </ol>
  </div>
</template>

<script>
import {
  URL_FB_FANPAGE,
  URL_TWITTER,
  URL_IG,
} from '../constants'

export default {
  data () {
    return {
      URL_FB_FANPAGE,
      URL_TWITTER,
      URL_IG,
    }
  },
}
</script>

<style lang="stylus" scoped>
.external-links
  height 30px
  display flex
  margin 24px 0 0 0
  img
    width auto
    height 23px

.nav-list
  list-style none
  width 100%
  padding 0
  margin 0
  display flex
  align-items center
  background-color #d3d3d3
  &__link
    flex 1 1 auto
    padding 7.5px 0
    height 20px
    display flex
    justify-content center
    align-items center
    & + &
      .nav-list__list-item
        border-left .5px solid white
  &__list-item
    display flex
    justify-content center
    align-items center
    width 100%
    height 20px
</style>

