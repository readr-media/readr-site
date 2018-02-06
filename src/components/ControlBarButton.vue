<template>
  <button class="controlBarButton" @click="$_controlBarButton_clickHandler" v-text="text"></button>
</template>
<script>
  
  export default {
    name: 'ControlBarButton',
    props: {
      text: {
        type: String,
        required: true
      }
    },
    mounted () {
      this.$emit('changeBtnAmount', true)
    },
    destroyed () {
      this.$emit('changeBtnAmount', false)
    },
    methods: {
      $_controlBarButton_clickHandler () {
        this.$emit('click')
      }
    }
  }
</script>
<style lang="stylus" scoped>
.controlBarButton
  width 90px
  height 30px
  margin 0 2.5px
  font-size 15px
  background-color #fff
  border 1px solid #d3d3d3
  cursor pointer
  outline none
  transition all .5s ease-in-out
  &:first-of-type
    margin-left 0
  &:last-of-type
    margin-right 0

@media (min-width 950px)
  .controlBarButton
    width 100px
    font-size 18px

</style>
