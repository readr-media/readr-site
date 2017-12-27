<template>
  <div class="member-editor" v-if="shouldShow">
    <div class="member-editor__form">
      <div class="title"></div>
      <div class="email"></div>
      <div class="btn--save"></div>
      <div class="btn--set">
        <div class="btn--set__confirm"></div>
        <div class="btn--set__cancel"></div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'mamber-editor',
    methods: {},
    mounted () {},
    props: [ 'shouldShow' ]
  }
</script>
<style lang="stylus" scoped>
  .member-editor
    width 100%
    height 100%
    background-color rgba(0, 0, 0, 0.5)
    position fixed
    top 0
    left 0
    display flex
    justify-content center
    align-items center
    &__form
      background-color #fff
      width 500px
      height 500px
</style>