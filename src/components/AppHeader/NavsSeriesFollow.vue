<template>
  <div class="follow-wrapper">
    <div
      class="follow-wrapper__follow follow"
      @click="toggleFollow"
    >
      <IconFollow
        :color-default="isFollow ? '#ddcf21' : 'white'"
        :height="30"
      />
    </div>
    <transition
      name="fade"
      mode="out-in"
    >
      <div
        v-show="showTooltip"
        class="follow-wrapper__tooltip tooltip"
      >
        <p>收藏成功囉！</p>
      </div>
    </transition>
  </div>
</template>

<script>
import IconFollow from 'src/components/Icons/Follow.vue'

export default {
  components: {
    IconFollow,
  },
  data () {
    return {
      showTooltip: false,
      isFollow: false,
    }
  },
  methods: {
    toggleFollow () {
      this.isFollow = !this.isFollow
      if (this.isFollow) {
        this.toggleTooltipShow()
      } else {
        this.toggleTooltipHide()
      }
    },
    toggleTooltipShow () {
      this.showTooltip = true
      this._tooltipTimeout = setTimeout(() => {
        this.showTooltip = false
      }, 2000)
    },
    toggleTooltipHide () {
      if (this._tooltipTimeout) {
        clearTimeout(this._tooltipTimeout)
      }
      this.showTooltip = false
    },
  },
}
</script>

<style lang="stylus" scoped>
.follow-wrapper
  display flex
  flex-direction column
  align-items center
  position relative
  &__tooltip
    position absolute
    top 40px
    min-width max-content

.follow
  height 100%
  img
    height 100%
  &__icon
    width 100px
    height 100%
    background-color #8cffa0
    -webkit-mask-image url(/public/2.0/icons/follow-white.png)
    mask-image url(/public/2.0/icons/follow-white.png)

.tooltip
  background-color white
  padding 10px 5px
  p
    margin 0
</style>
