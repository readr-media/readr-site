<template>
  <section v-show="showLightBox" class="baseLightBox">
    <div class="baseLightBox__container">
      <slot name="postPanelEdit"></slot>
      <button class="baseLightBox__btn--close" @click="$_baseLightBox_close">close</button>
    </div>
    <div class="baseLightBox__curtain" @click="$_baseLightBox_close"></div>
  </section>
</template>
<script>
  export default {
    name: 'BaseLightBox',
    components: {
    },
    props: {
      showLightBox: {
        type: Boolean,
        default: false
      }
    },
    mounted () {},
    methods: {
      $_baseLightBox_close () {
        this.$emit('update:showLightBox', false)
      }
    }
  }
</script>
<style lang="stylus" scoped>

.baseLightBox
  position fixed
  top 0
  left 0
  right 0
  bottom 0
  z-index 100
  display flex
  justify-content center
  align-items center
  width 100%
  height 100vh
  background-color rgba(0,0,0,.6)
  &__btn
    &--close
      cursor pointer
      position absolute
      top -5px
      right -55px
      width 50px
      height 50px
  &__container
    position relative
    z-index 10
    display flex
    flex-direction column
    justify-content center
    align-items center
    position relative
    background-color #fff
    border 5px solid #d8ca21
  &__curtain
    position absolute
    top 0
    left 0
    right 0
    bottom 0
    z-index 1

</style>
