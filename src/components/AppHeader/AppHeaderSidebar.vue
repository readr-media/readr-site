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
      @click="$emit('update:showSidebar', false)"
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
export default {
  props: {
    showSidebar: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
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
  transition opacity 0s .5s
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
    transition background-color .5s ease-out
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
    transition transform .5s ease-out
    &--show
      transform translateX(0px)

.sidebar
  padding 80px 0
  &__wrapper
    width 640px
    margin 0 auto
</style>
