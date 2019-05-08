<template>
  <nav class="navs">
    <router-link
      class="navs__nav"
      to="/"
    >
      <img
        src="/public/2.0/icons/search-white.png"
        alt=""
      >
    </router-link>
    <router-link
      class="navs__nav"
      to="/"
    >
      <img
        src="/public/2.0/icons/follow-white.png"
        alt=""
      >
    </router-link>
    <router-link
      class="navs__nav"
      to="/"
    >
      <p>登入</p>
    </router-link>
  </nav>
</template>

<style lang="stylus" scoped>
.navs
  display flex
  align-items center
  &__nav
    display flex
    height 30px
    align-items center
    cursor pointer
    & + &
      margin 0 0 0 30px
    img
      height 100%
    p
      font-size 20px
      margin 0
      color white
</style>
