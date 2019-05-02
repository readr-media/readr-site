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
      <router-view class="view"/>
    </transition>
    <AppFooter class="app__footer" />
  </div>
</template>

<script>
import AppHeader from 'src/components/AppHeader/AppHeader.vue'
import AppFooter from 'src/components/AppFooter.vue'

export default {
  components: {
    AppHeader,
    AppFooter,
  },
}
</script>

<style lang="stylus">
.app
  background-color #f1f1f1
  &__header
    position fixed
    top 0
    left 0

a
  text-decoration none
</style>
