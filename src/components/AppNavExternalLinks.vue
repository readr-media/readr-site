<template>
  <div class="external-links">
    <ol class="nav-list">
      <a class="nav-list__link" :href="`//www.facebook.com/${SITE_DOMAIN}`" target="_blank">
        <li class="nav-list__list-item">
          <img src="/public/icons/fb.png" alt="">
        </li>
      </a>
      <!-- <a class="nav-list__link" href="">
        <li class="nav-list__list-item">
          <img src="/public/icons/github.png" alt="">
        </li>
      </a> -->
      <router-link class="nav-list__link" to="/about">
        <li class="nav-list__list-item">
          <img src="/public/icons/info.png" alt="">
        </li>
      </router-link>
    </ol>
    <a class="external-links__independent" :href="`//${MM_SITE_DOMAIN}`" target="_blank">
      <img src="/public/icons/mirrormedia.png" alt="">
    </a>
  </div>
</template>

<script>
import { SITE_DOMAIN, MM_SITE_DOMAIN, } from '../constants'

export default {
  data () {
    return {
      SITE_DOMAIN,
      MM_SITE_DOMAIN,
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
    width 25px
    height 25px
  &__independent
    flex 1 1 auto
    display flex
    justify-content center
    align-items center
    background-color #d3d3d3
    margin 0 0 0 5.5px

.nav-list
  list-style none
  width 130px
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

