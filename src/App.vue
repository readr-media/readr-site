<template>
  <div
    id="app"
    class="app"
  >
    <AppHeader class="app__header" />
    <transition
      name="fade"
      mode="out-in"
    >
      <router-view class="view" />
    </transition>
    <AppFooter class="app__footer" />
  </div>
</template>

<script>
import AppHeader from 'src/components/AppHeader/AppHeader.vue'
import AppFooter from 'src/components/AppFooter.vue'

import { SITE_FULL, SITE_NAME } from './constants'

export default {
  components: {
    AppHeader,
    AppFooter
  },
  metaInfo: {
    titleTemplate: `%s - ${SITE_NAME}`,
    meta: [
      { name: 'og:image', content: `${SITE_FULL}/public/og-image.jpg` }
    ]
  }
}
</script>

<style lang="stylus">

h1, h2, h3, p, a, figure, pre
  margin 0
h1, h2, h3, p, a,
  color #000
h1
  font-size 1.875rem
  font-weight 600
h2
  font-size 1.5rem
  font-weight 500
p
  font-size 1rem
  &.small
    font-size .875rem
a
  text-decoration none
  cursor pointer
  &:link, &:visited, &:hover, &:active
    color #000
button
  cursor pointer
pre
  padding .5em
  color #f8f8f2
  white-space pre-line
  background-color #23241f
  border-radius 3px

.app
  background-color #f1f1f1
  &__header
    position fixed
    top 0
    left 0
  &-content-area
    width 60%
    max-width 800px
    margin-left auto
    margin-right auto

</style>
