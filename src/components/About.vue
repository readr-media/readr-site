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
    <div class="about__edit">
      <span class="about__edit__btn" v-text="editText" @click="showLightBox = true"></span>
    </div>
    <BaseLightBox :showLightBox.sync="showLightBox" borderStyle="nonBorder">
      <BaseLightBoxProfileEdit :showLightBox="showLightBox" :profile="profile"/>
    </BaseLightBox>
  </div>
</template>
<script>
  import _ from 'lodash'
  import { ROLE_MAP } from '../constants'
  import BaseLightBox from './BaseLightBox.vue'
  import BaseLightBoxProfileEdit from './BaseLightBoxProfileEdit.vue'

  export default {
    components: {
      BaseLightBox,
      BaseLightBoxProfileEdit
    },
    computed: {
      introduction () {
        return _.get(this.profile, [ 'description' ], '')
      },
      name () {
        return _.get(this.profile, [ 'nickname' ])
      },
      role () {
        return _.get(_.filter(ROLE_MAP, { key: _.get(this.profile, [ 'role' ]) }), [ 0, 'value' ])
      },
      thumbnail () {
        return _.get(this.profile, [ 'profileImage' ]) || '/public/icons/exclamation.png'
      }
    },
    data () {
      return {
        editText: '(edit)',
        showLightBox: false
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
    min-height 100px
    margin 40px auto
    padding-left 130px
    position relative
    color #000
    &__thumbnail
      position absolute
      left 0
      top 0
      width 100px
      height 100px
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
      font-size 1.125rem
    &__introduction
      margin-top 10px
      font-size 0.9375rem
      font-weight 300
      line-height 1.375rem
    &__edit
      text-align right
      &__btn
        color #4280a2
        font-weight 600
        cursor pointer
  @media (min-width 950px)
    .about
      width 950px
</style>