<template>
  <div class="about">
    <div class="about__thumbnail">
      <img :src="thumbnail">
    </div>
    <div class="about__name">
      <span class="name" v-text="name"></span>
      <span class="role" v-text="`（${role}）`" v-if="role"></span>
    </div>
    <div class="about__introduction" v-text="introduction"></div>
  </div>
</template>
<script>
  import _ from 'lodash'

  export default {
    computed: {
      introduction () {
        return _.get(this.profile, [ 'description' ], '')
      },
      name () {
        return _.get(this.profile, [ 'name' ]) || _.get(this.profile, [ 'nickname' ]) || _.get(this.profile, [ 'mail' ])
      },
      role () {
        return _.get(this.profile, [ 'role' ])
      },
      thumbnail () {
        return _.get(this.profile, [ 'image', 'url' ], '/public/icons/exclamation.png')
      }
    },
    name: 'about',
    methods: {},
    mounted () {},
    props: [ 'profile' ]
  }
</script>
<style lang="stylus" scoped>
  .about
    width 100%
    margin 25px auto
    padding-left 55px
    position relative
    color #000
    &__thumbnail
      position absolute
      left 0
      top 0
      width 45px
      height 45px
      border 1px solid #979797
      border-radius 50%
      overflow hidden
      > img
        width 100%
        height 100%
        object-fit contain
        object-position center center
        // box-shadow inset 0 0 0 10px #fff
    &__name
      font-size 0.9375rem
    &__introduction
      margin-top 5px
      font-size 0.625rem
      font-weight 300
      line-height 0.875rem
  @media (min-width 720px)
    .about
      width 720px
</style>