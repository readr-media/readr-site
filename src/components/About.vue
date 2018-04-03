<template>
  <div class="about">
    <div class="about__thumbnail">
      <img v-show="thumbnail" :src="getImageUrl(thumbnail)">
    </div>
    <div class="about__name">
      <span class="name" v-text="name"></span>
      <span class="role" v-text="role"></span>
    </div>
    <div class="about__introduction" v-text="introduction"></div>
    <div class="about__edit" v-if="isCurrUser">
      <span class="about__edit__btn" v-text="editText" @click="goEdit"></span>
    </div>
    <BaseLightBox :showLightBox.sync="showLightBox" borderStyle="nonBorder">
      <BaseLightBoxProfileEdit :showLightBox="showLightBox" :profile="profile" @save="showLightBox = false"/>
    </BaseLightBox>
  </div>
</template>
<script>
  import { filter, get, } from 'lodash'
  import { ROLE_MAP, } from 'src/constants'
  import { getImageUrl, } from 'src/util/comm'
  import BaseLightBox from 'src/components/BaseLightBox.vue'
  import BaseLightBoxProfileEdit from 'src/components/BaseLightBoxProfileEdit.vue'

  const debug = require('debug')('CLIENT:About')
  export default {
    components: {
      BaseLightBox,
      BaseLightBoxProfileEdit,
    },
    computed: {
      isCurrUser () {
        const currUser = get(this.$store, 'state.profile.id')
        debug('currUser', currUser)
        debug('profile', get(this.profile, 'id'))
        return currUser === get(this.profile, 'id')
      },
      introduction () {
        return get(this.profile, [ 'description', ], '')
      },
      name () {
        return get(this.profile, [ 'nickname', ])
      },
      role () {
        const text = get(filter(ROLE_MAP, { key: get(this.profile, [ 'role', ]), }), [ 0, 'value', ])
        return text && ` (${text})`
      },
      thumbnail () {
        return get(this.profile, [ 'profileImage', ], '/public/icons/exclamation.png')
      },
    },
    data () {
      return {
        editText: '(edit)',
        showLightBox: false,
      }
    },
    name: 'about',
    methods: {
      getImageUrl,
      goEdit () {
        debug('isCurrUser', this.isCurrUser)
        this.isCurrUser && (this.showLightBox = true)
      },
    },
    mounted () {},
    props: [ 'profile', ],
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
      max-width 950px
</style>