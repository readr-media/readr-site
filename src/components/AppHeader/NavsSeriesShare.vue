<template>
  <div class="wrapper">
    <div
      class="wrapper__share"
      @click="toggleNavs"
    >
      <img
        src="/public/2.0/icons/share-white.png"
        alt=""
      >
    </div>
    <nav
      :class="[
        'wrapper__share-navs',
        { 'wrapper__share-navs--show': showNavs },
        'share-navs'
      ]"
    >
      <ShareFacebook
        class="share-navs__nav"
      />
      <ShareLine
        class="share-navs__nav"
      />
    </nav>
  </div>
</template>

<script>
import ShareFacebook from 'src/components/Share/ShareFacebook.vue'
import ShareLine from 'src/components/Share/ShareLine.vue'

export default {
  components: {
    ShareFacebook,
    ShareLine
  },
  data () {
    return {
      showNavs: false
    }
  },
  methods: {
    toggleNavs () {
      this.showNavs = !this.showNavs
    }
  }
}
</script>

<style lang="stylus" scoped>
.wrapper
  height 30px
  position relative
  display flex
  flex-direction column
  justify-content center
  align-items center
  &__share-navs
    position absolute
    top 30px
    opacity 0
    user-select none
    transition opacity .15s ease-out
    &--show
      opacity 1
      user-select initial

.share-navs
  margin 10px 0 0 0
  &__nav
    & + &
      margin 10px 0 0 0
</style>
