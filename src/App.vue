<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <router-view class="view"></router-view>
    </transition>
  </div>
</template>

<style lang="stylus">
body
  font-family -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
  font-size 16px
  background-color lighten(#eceef1, 30%)
  margin 0
  // padding-top 55px
  color #34495e
  overflow-y scroll

a
  color #34495e
  text-decoration none

.logo
  width 24px
  margin-right 10px
  display inline-block
  vertical-align middle

.view
  // max-width 800px
  margin 0 auto
  position relative

.fade-enter-active, .fade-leave-active
  transition all .2s ease

.fade-enter, .fade-leave-active
  opacity 0

</style>
