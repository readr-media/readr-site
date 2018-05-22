<template>
  <figure class="projects-figure-progress">
    <div class="projects-figure-progress__title">
      <h3 v-if="projectName" v-text="projectName"></h3>
      <h2 v-text="memo.title"></h2>
    </div>
    <div class="projects-figure-progress__info">
      <div v-if="deducted" class="projects-figure-progress__btn-container">
        <router-link :to="`/series/${get(memo, 'projectId')}`" class="projects-figure-progress__link"><img src="/public/icons/microphone-grey.png" :alt="$t('PROJECT.DISCUSS')"></router-link>
        <div class="projects-figure-progress__alert" v-text="$t('PROJECT.DISCUSS')"></div>
      </div>
      <div v-else class="projects-figure-progress__btn-container">
        <button class="projects-figure-progress__button button--encoruage" @click="$_projectsFigureProgress_openLightBox"><img src="/public/icons/participate-grey.png" :alt="$t('PROJECT.ENCOURAGE')"></button>
        <div class="projects-figure-progress__alert" v-text="$t('PROJECT.ENCOURAGE')"></div>
      </div>
    </div>
    <base-light-box :showLightBox.sync="showLightBox" borderStyle="nonBorder">
      <div class="project-memo-alert">
        <div class="project-memo-alert__content">
          <h2 v-text="$t('PROJECT.JOIN_CONTENT_1')"></h2>
          <h1 v-text="projectName"></h1>
          <h2>{{ $t('PROJECT.JOIN_CONTENT_2') }}<strong v-text="get(memo, 'project.memoPoints', 0) || 0"></strong>{{ $t('PROJECT.JOIN_CONTENT_POINT') }}</h2>
          <button
            :disabled="deducting"
            @click="$_projectsFigureProgress_deductPoints()"
            v-text="deducting ? `${$t('PROJECT.DEDUCTING')} ...` : $t('PROJECT.JOIN_CONFIRM')">
          </button>
        </div>
      </div>
    </base-light-box>
  </figure>
</template>

<script>

import { POINT_OBJECT_TYPE, } from '../../../api/config'
import { get, includes, } from 'lodash'
import BaseLightBox from '../BaseLightBox.vue'

const deductPoints = (store, { objectId, memoPoints, } = {}) => {
  return store.dispatch('ADD_REWARD_POINTS_TRANSACTIONS', {
    params: {
      member_id: get(store, [ 'state', 'profile', 'id', ]),
      object_type: POINT_OBJECT_TYPE.PROJECT_MEMO,
      object_id: objectId,
      points: memoPoints,
    },
  })
}

export default {
  name: 'MemoFigure',
  components: {
    BaseLightBox,
  },
  props: {
    memo: {
      type: Object,
      default: {},
    },
  },
  data () {
    return {
      deducting: false,
      showLightBox: false,
    }
  },
  computed: {
    deducted () {
      const objectIds = get(this.$store, 'state.pointHistories', []).map(history => history.objectId)
      return includes(objectIds, get(this.memo, 'projectId'))
    },
    projectName () {
      return get(this.memo, 'project.title')
    },
  },
  mounted () {
  },
  methods: {
    $_projectsFigureProgress_deductPoints () {
      this.deducting = true
      deductPoints(this.$store, { objectId: get(this.memo, 'projectId'), memoPoints: get(this.memo, 'project.memoPoints') || 0, })
      .then(() => {
        this.deducting = false
        this.$router.push(`/series/${get(this.memo, 'projectId')}`)
      })
    },
    $_projectsFigureProgress_openLightBox () {
      this.showLightBox = true
    },
    get,
  },
}

</script>

<style lang="stylus" scoped>
.projects-figure-progress
  display flex
  max-height 75px
  margin 0
  background-color white
  border-bottom 1px solid #d3d3d3
  overflow hidden
  // > h2
  //   flex 1
  //   margin 0
  //   padding-left 15px
  //   font-size 1.5rem
  //   font-weight 400
  //   line-height 74px
  &__title
    flex 1
    padding 10px
    h2, h3
      margin 0
    h2
      font-size .9375rem
    h3
      margin-bottom 5px
      color #808080
      font-size .625rem
  &__info
    display flex
    justify-content center
    align-items center
  &__btn-container
    flex 1
    position relative
    width 37px
    margin 0 5px
    border-left 1px solid #979797
    &:hover
      .projects-figure-progress__alert
        display block
  &__button
    width 100%
    height 100%
    border none
    background-color #fff
    display flex
    justify-content center
    align-items center
    font-size 12px
    font-weight 600
    color white
    & > img
      width 25px
      height 25px
    &:focus
      outline none
  &__link
    display flex
    justify-content center
    align-items center
    width 100%
    height 100%
    background-color #fff
    cursor pointer
    & > img
      width 25px
      height 25px
  &__alert
    display none
    position absolute
    top 50%
    right 40px
    transform translateY(-50%)
    padding .2em .5em
    color #000
    font-size .75rem
    background #fff
    border 1px solid #d3d3d3
    user-select none
    white-space nowrap
    &::before
      content ''
      position absolute
      top 50%
      right -10px
      transform translateY(-50%)
      width 0
      height 0
      border-style solid
      border-width 5px 0 5px 8.7px
      border-color transparent transparent transparent #d3d3d3
    &::after
      content ''
      position absolute
      top 50%
      right -9px
      transform translateY(-50%)
      width 0
      height 0
      border-style solid
      border-width 5px 0 5px 8.7px
      border-color transparent transparent transparent #fff
    
.button--progress
  cursor auto

.project-memo-alert
  position relative
  min-width 500px
  min-height 400px
  background-color #11b8c9
  background-image url(/public/icons/join.png)
  background-position calc(100% - 20px) center
  background-size 185px auto
  background-repeat no-repeat
  border 5px solid #fff
  &__content
    position absolute
    left 30px
    bottom 60px
    h1
      max-width 290px
      margin 1em 0 0
      color #fff
      font-size 1.875rem
      font-weight 400
      letter-spacing 1px
    h2
      margin 0
      font-size 1.125rem
      strong
        color #fff
        font-size 1.875rem
        margin 0 .2em
    button
      width 290px
      margin-top 30px
      padding 15px 0
      color #11b8c9
      font-size 1.875rem
      background-color #fff
      border none
      transition color .5s
      &:disabled
        color rgba(17, 184, 201, .6)
</style>

