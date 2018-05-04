<template>
  <figure class="projects-figure-progress">
    <h2 v-text="projectName"></h2>
    <div class="projects-figure-progress__info">
      <div class="projects-figure-progress__btn-container">
        <button class="projects-figure-progress__button button--progress" v-text="`${projectProgress}%`"></button>
        <div class="projects-figure-progress__alert" v-text="$t('PROJECT.PROGRESS')"></div>
      </div>
      <div v-if="deducted"  class="projects-figure-progress__btn-container">
        <router-link :to="`/memo/${get(this.project, 'id')}`" class="projects-figure-progress__link"><img src="/public/icons/microphone.png" :alt="$t('PROJECT.DISCUSS')"></router-link>
        <div class="projects-figure-progress__alert" v-text="$t('PROJECT.DISCUSS')"></div>
      </div>
      <div v-else class="projects-figure-progress__btn-container">
        <button class="projects-figure-progress__button button--encoruage" @click="$_projectsFigureProgress_openLightBox"><img src="/public/icons/encoruage-white.png" :alt="$t('PROJECT.ENCOURAGE')"></button>
        <div class="projects-figure-progress__alert" v-text="$t('PROJECT.ENCOURAGE')"></div>
      </div>
    </div>
    <base-light-box :showLightBox.sync="showLightBox" borderStyle="nonBorder">
      <div class="project-memo-alert">
        <div class="project-memo-alert__content">
          <h2 v-text="$t('PROJECT.JOIN_CONTENT_1')"></h2>
          <h1 v-text="projectName"></h1>
          <h2>{{ $t('PROJECT.JOIN_CONTENT_2') }}<strong v-text="get(project, [ 'memoPoints' ], 0) || 0"></strong>{{ $t('PROJECT.JOIN_CONTENT_POINT') }}</h2>
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
  name: 'ProjectsFigureProgress',
  components: {
    BaseLightBox,
  },
  props: {
    project: {
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
      return includes(objectIds, get(this.project, 'id'))
    },
    projectName () {
      return get(this.project, [ 'title', ])
    },
    projectProgress () {
      return get(this.project, [ 'progress', ])
    },
  },
  mounted () {
  },
  methods: {
    $_projectsFigureProgress_deductPoints () {
      this.deducting = true
      deductPoints(this.$store, { objectId: get(this.project, 'id'), memoPoints: get(this.project, 'memoPoints') || 0, })
      .then(() => {
        this.deducting = false
        this.$router.push(`/memo/${get(this.project, 'id')}`)
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
  > h2
    flex 1
    margin 0
    padding-left 15px
    font-size 1.5rem
    font-weight 400
    line-height 74px
  &__info
    display flex
    flex-direction column
    justify-content space-between
    * + *
      border-top 1px solid #fff
  &__btn-container
    flex 1
    position relative
    width 37px
    &:hover
      .projects-figure-progress__alert
        display block
  &__button
    width 100%
    height 100%
    border none
    background-color #11b8c9
    display flex
    justify-content center
    align-items center
    font-size 12px
    font-weight 600
    color white
    & > img
      width 19px
    &:focus
      outline none
  &__link
    display flex
    justify-content center
    align-items center
    width 100%
    height 100%
    background-color #11b8c9
    cursor pointer
    & > img
      width 13px
  &__alert
    display none
    position absolute
    top 50%
    left -66px
    transform translateY(-50%)
    padding .2em .5em
    color #000
    font-size .75rem
    background #fff
    border 1px solid #d3d3d3
    user-select none
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

