<template>
  <div :class="`app-share-button${isToogle ? '--toogle' : ''} ${direction}`">
    <button class="app-share-button__share-icon" :style="{ backgroundImage: `url(/public/icons/share-${iconColor}.png)`, backgroundColor: backgroundColor }"  @click="toogleShare"></button>
    <a class="app-share-button__item--fb" :href="`https://www.facebook.com/share.php?u=${shareUrl}`" target="_blank"></a>
    <a class="app-share-button__item--line" :href="`https://line.me/R/msg/text/?${shareUrl}`" target="_blank"></a>
    <a class="app-share-button__item--link" :href="`https://${shareUrl}`" target="_blank"></a>
  </div>
</template>

<script>
export default {
  props: {
    shareUrl: {
      type: String,
      // required: true
      default: 'www.google.com',
    },
    direction: { // options: up, down, left, right
      type: String,
      default: 'down', 
    },
    iconColor: {
      type: String,
      default: 'blue',
    },
    backgroundColor: {
      type: String,
      default: 'white',
    },
  },
  data () {
    return {
      isToogle: false,
    }
  },
  methods: {
    toogleShare () {
      this.isToogle = !this.isToogle
    },
  },
}
</script>

<style lang="stylus" scoped>
$app-share-button  
  // position absolute
  // top 15.5px
  // right 22.5px
  width 25px
  height 25px
$app-share-button__item
  transition-duration .19s
  position absolute
  top 0
  right 0
  display inline-block
  width 100%
  height 100%
  background-size 100% 100%
  z-index 1
.app-share-button
  @extends $app-share-button
  &__share-icon
    position absolute
    top 0
    right 0
    border none
    width 101%
    height 101%
    // background-image url(/public/icons/share-blue.png)
    background-size 100% 100%
    background-color transparent
    outline none
    z-index 2
  &__item
    &--fb
      @extends $app-share-button__item
      background-image url(/public/icons/share-fb.png)
    &--line
      @extends $app-share-button__item
      background-image url(/public/icons/share-line.png)
    &--link
      @extends $app-share-button__item
      background-image url(/public/icons/share-link.png)
  &--toogle
    @extends $app-share-button
    &.up
      .app-share-button__item--fb
        transform translate3d(0, -40px, 0)
      .app-share-button__item--line
        transform translate3d(0, -70px, 0)
      .app-share-button__item--link
        transform translate3d(0, -100px, 0)
    &.right
      .app-share-button__item--fb
        transform translate3d(40px, 0, 0)
      .app-share-button__item--line
        transform translate3d(70px, 0, 0)
      .app-share-button__item--link
        transform translate3d(100px, 0, 0)
    &.down
      .app-share-button__item--fb
        transform translate3d(0, 40px, 0)
      .app-share-button__item--line
        transform translate3d(0, 70px, 0)
      .app-share-button__item--link
        transform translate3d(0, 100px, 0)
    &.left
      .app-share-button__item--fb
        transform translate3d(-40px, 0, 0)
      .app-share-button__item--line
        transform translate3d(-70px, 0, 0)
      .app-share-button__item--link
        transform translate3d(-100px, 0, 0)

</style>

