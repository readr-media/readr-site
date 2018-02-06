<template>
  <div id="app">
    <app-header :sections="sections"></app-header>
    <transition name="fade" mode="out-in">
      <router-view class="view"></router-view>
    </transition>
  </div>
</template>

<script>
  import { SECTIONS_DEFAULT } from './constants'
  import AppHeader from './components/AppHeader.vue'
  export default {
    components: {
      'app-header': AppHeader
    },
    computed: {
      sections () {
        return SECTIONS_DEFAULT
      }
    }
  }
</script>

<style lang="stylus">
a
  text-decoration none

button
  cursor pointer
  &:disabled
    cursor not-allowed
.view
  // max-width 800px
  margin 0 auto
  position relative
  background-color #fff
  &.locked
    width 100%
    height 100vh
    overflow hidden

.main-container
  width 90%
  max-width 90%
  margin 35px auto 0
  overflow hidden

.main-panel
  width 100%
  padding 20px 5%
  border 2px solid #d8ca21

.datepicker__input
  padding-left 10px
  width 100%
  height 25px
  color #808080

.fade-enter-active, .fade-leave-active
  transition all .2s ease

.fade-enter, .fade-leave-active
  opacity 0

@media (min-width 768px)
  .view
    background-color #e6e6e6

@media (min-width 950px)
  .main-container
    width 950px
    max-width 950px
    margin 22px auto 0
  .main-panel
    padding 35px calc((100% - 800px) / 2) 40px
</style>
