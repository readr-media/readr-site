<template>
  <div
    :class="[
      'sidebar-wrapper',
      { 'sidebar-wrapper--show': showSidebar }
    ]"
  >
    <div
      :class="[
        'sidebar-wrapper__dimmed',
        { 'sidebar-wrapper__dimmed--show': showSidebar }
      ]"
      @click="SET_SHOW_SIDEBAR(false)"
    />
    <div
      :class="[
        'sidebar-wrapper__sidebar',
        { 'sidebar-wrapper__sidebar--show': showSidebar },
        'sidebar'
      ]"
    >
      <div class="sidebar__wrapper">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  computed: {
    ...mapState({
      showSidebar: state => state.UIAppHeader.showSidebar
    })
  },
  methods: {
    ...mapMutations({
      SET_SHOW_SIDEBAR: 'UIAppHeader/SET_SHOW_SIDEBAR'
    })
  }
}
</script>

<style lang="stylus" scoped>
.sidebar-wrapper
  position fixed
  bottom 0
  left 0
  width 100vw
  height calc(100vh - 50px)
  opacity 0
  pointer-events none
  transition opacity 0s .25s
  &--show
    opacity 1
    pointer-events auto
    transition none
  &__dimmed
    position absolute
    top 0
    left 0
    bottom 0
    right 0
    background-color rgba(0, 0, 0, 0)
    transition background-color .25s ease-out
    &--show
      background-color rgba(0, 0, 0, 0.7)
  &__sidebar
    position absolute
    bottom 0
    left 0
    width 50vw
    height 100%
    background-color white
    transform translateX(-50vw)
    transition transform .25s ease-out
    &--show
      transform translateX(0px)

.sidebar
  padding 80px 0
  overflow-y scroll
  &__wrapper
    width 640px
    margin 0 auto
</style>
