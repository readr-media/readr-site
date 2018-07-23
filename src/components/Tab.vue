<template>
  <div class="tab">
    <div class="tab__nav">
      <div class="tab__nav__item" :class="{ active: activeItem === i }" v-for="(tab, i) in tabs" v-text="tab" @click="navClickHandler(i)" :style="tabStyle"></div>
    </div>
    <div class="tab__content">
      <slot v-for="(t, i) in tabs" :name="i" v-if="i === activeItem"></slot>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'AppTab',
    props: {
      tabs: {},
      defaultTab: {
        default: 0,
      },
    },
    data () {
      return {
        activeItem: 0,
      }
    },
    computed: {
      tabStyle () {
        return {
          width: `${100 / (this.tabs ? this.tabs.length : 1)}%`,
        }
      },
    },
    watch: {
      activeItem (val) {
        this.$emit('changeTab', val)
        this.$emit('update:tabCurrIndex', val)
      },
    },
    mounted () {
      this.defaultTab && (this.activeItem = this.defaultTab)
    },
    methods: {
      navClickHandler (itemIndex) {
        this.activeItem = itemIndex
      },
    },
  }
</script>
<style lang="stylus" scoped>
  .tab
    &__nav
      width 100%
      &__item
        height 45px
        display inline-flex
        justify-content center
        align-items center
        color #808080
        font-size 0.9375rem
        cursor pointer
        &.active
          background-color #ddcf21
          color #fff
    &__content
      border 5px solid #d8ca21
      padding 20px
      font-size 0.625rem
      line-height 1rem
      color #000
  @media (min-width 950px)
    .tab
      &__content
        padding 37.5px 27.5px
</style>