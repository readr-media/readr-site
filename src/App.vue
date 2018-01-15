<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <router-view class="view"></router-view>
    </transition>
  </div>
</template>

<script>
  export default {}
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

.main-container
  width 950px
  max-width 950px
  margin 22px auto 0
  overflow hidden

.main-panel
  width 100%
  padding 35px 80px 40px
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

</style>
