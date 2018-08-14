<template>
  <header class="header">
    <h1 class="header__title">{{ $t(`TAG_NAV_ASIDE.TITLE.${picked}`) }}</h1>
    <div class="dropdown">
      <div class="dropdown__icon" @click="toogleDropdown" v-click-outside="closeDropdown"></div>
      <div class="dropdown__options options" v-show="isDropdownToogled">
        <label class="radio-container">{{ $t('TAG_NAV_ASIDE.TITLE.hot') }}
          <input type="radio" name="radio" value="hot" :checked="picked === 'hot'" @click="pickRadio('hot')">
          <span class="radio-container__checkmark"></span>
        </label>
        <label class="radio-container">{{ $t('TAG_NAV_ASIDE.TITLE.latest') }}
          <input type="radio" name="radio" value="latest" :checked="picked === 'latest'" @click="pickRadio('latest')">
          <span class="radio-container__checkmark"></span>
        </label>
        <label class="radio-container">{{ $t('TAG_NAV_ASIDE.TITLE.taggedProjects') }}
          <input type="radio" name="radio" value="taggedProjects" :checked="picked === 'taggedProjects'" @click="pickRadio('taggedProjects')">
          <span class="radio-container__checkmark"></span>
        </label>
        <label class="radio-container">{{ $t('TAG_NAV_ASIDE.TITLE.followed') }}
          <input type="radio" name="radio" value="followed" :checked="picked === 'followed'" @click="pickRadio('followed')">
          <span class="radio-container__checkmark"></span>
        </label>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  props: {
    picked: {
      type: String,
      required: true,
    },
  },
  data () {
    return {
      isDropdownToogled: false,
    }
  },
  methods: {
    toogleDropdown () {
      this.isDropdownToogled = !this.isDropdownToogled
    },
    closeDropdown () {
      this.isDropdownToogled = false
    },
    pickRadio (value) {
      this.$emit('update:picked', value)
      this.closeDropdown()
    },
  },
  directives: {
    'click-outside': {
      bind (el, binding, vnode) {
        el.clickOutsideEvent = function (event) {
          // here I check that click was outside the el and his childrens
          if (!(el == event.target || el.contains(event.target))) {
            // and if it did, call method provided in attribute value
            vnode.context[binding.expression](event)
          }
        }
        document.body.addEventListener('click', el.clickOutsideEvent)
      },
      unbind (el) {
        document.body.removeEventListener('click', el.clickOutsideEvent)
      },
    },
  },
}
</script>

<style lang="stylus" scoped>
.header
  display flex
  align-items center
  &__title
    font-size 18px
    font-weight 600
    margin 0

.dropdown
  position relative
  margin 0 0 0 5px
  &__icon
    width 0
    height 0
    border-style solid
    border-width 7.5px 5px 0 5px
    border-color black transparent transparent transparent
    cursor pointer
  &__options
    position absolute
    top 20px
    left calc(-105px / 2 + 5px)
    width 105px
    height 89.5px
    background-color #ffffff
    box-shadow 0 1px 2px 0 rgba(0, 0, 0, 0.5), 1px 1px 4px 0 rgba(129, 129, 129, 0.5)
    z-index 10

.options
  padding 6.5px 8px
  display flex
  flex-direction column
  justify-content center

.radio-container
  display block
  position relative
  padding-left 15px
  cursor pointer
  font-size 12px
  user-select none
  color #808080
  -webkit-font-smoothing antialiased
  & + &
    margin 6px 0 0 0
  input
    position absolute
    opacity 0
    cursor pointer
    &:checked
      & ~ .radio-container__checkmark
        background-color #808080
        &:after
          display block
  &:hover
    input
      & ~ .radio-container__checkmark
        background-color #ccc
      &:checked
        & ~ .radio-container__checkmark
          background-color #808080
          &:after
            display block
  &__checkmark
    position absolute
    top 0
    left 0
    height 10px
    width 10px
    background-color white
    border-radius 50%
    box-shadow 0 1px 2px 0 rgba(0, 0, 0, 0.5), 1px 1px 4px 0 rgba(129, 129, 129, 0.5)
    &:after
      content ""
      position absolute
      display none
      top 2.5px
      left 3px
      width 5px
      height 5px
      border-radius 50%
      background white
</style>

