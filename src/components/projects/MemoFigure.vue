<template>
  <div class="projects-figure-progress">
    <div class="projects-figure-progress__container" @click="navigateToMemo">
      <div class="projects-figure-progress__title">
        <h3 v-if="projectName" v-text="projectName"></h3>
        <h2 v-text="memo.title"></h2>
      </div>
      <div class="projects-figure-progress__info">
        <div v-if="deducted" :class="[ 'projects-figure-progress__btn-container', { 'projects-figure-progress__btn-container--wide': !showStatusTooltip } ]">
          <div :class="[ 'projects-figure-progress__link', { 'projects-figure-progress__link--small': !showStatusTooltip } ]"><img src="/public/icons/microphone-grey.png" :alt="$t('PROJECT.DISCUSS')"></div>
          <div v-if="showStatusTooltip" class="projects-figure-progress__alert" v-text="$t('PROJECT.DISCUSS')"></div>
          <p v-else class="projects-figure-progress__alert--hint" v-text="$t('PROJECT.DISCUSS')"></p>
        </div>
        <div v-else :class="[ 'projects-figure-progress__btn-container', { 'projects-figure-progress__btn-container--wide': !showStatusTooltip } ]">
          <button :class="[ 'projects-figure-progress__button', { 'projects-figure-progress__button--small': !showStatusTooltip }, 'button--encoruage']"><img src="/public/icons/participate-grey.png" :alt="$t('PROJECT.ENCOURAGE')"></button>
          <div v-if="showStatusTooltip" class="projects-figure-progress__alert" v-text="`${$t('PROJECT.ENCOURAGE_ACTION')}${$t('PROJECT.ENCOURAGE')}`"></div>
          <p v-else class="projects-figure-progress__alert--hint">{{ $t('PROJECT.ENCOURAGE_ACTION') }}<br>{{ $t('PROJECT.ENCOURAGE') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { get, includes, } from 'lodash'

const switchOnDeductionPanel = (store, item) => store.dispatch('SWITCH_ON_CONSUME_PANEL', { active: true, item, })

export default {
  name: 'MemoFigure',
  props: {
    memo: {
      type: Object,
      default: {},
    },
    showStatusTooltip: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    deducted () {
      const objectIds = get(this.$store, 'state.pointHistories', []).map(history => history.objectId)
      return includes(objectIds, get(this.memo, 'projectId'))
    },
    projectName () {
      return get(this.memo, 'project.title')
    },
    memoURL () {
      return `/series/${get(this.memo, 'project.slug')}`
    },
  },
  mounted () {
  },
  methods: {
    $_projectsFigureProgress_openLightBox () {
      switchOnDeductionPanel(this.$store, this.memo).then(() => {
        this.$router.push(this.memoURL)
      })
    },
    navigateToMemo () {
      this.deducted ? this.$router.push(this.memoURL) : this.$_projectsFigureProgress_openLightBox()
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
  color black
  cursor pointer
  // > h2
  //   flex 1
  //   margin 0
  //   padding-left 15px
  //   font-size 1.5rem
  //   font-weight 400
  //   line-height 74px
  &__container
    display flex
    width 100%
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
    display flex
    justify-content center
    align-items center
    &--wide
      width 99px
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
    &--small
      width 35px
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
    &--small
      width 35px
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
    &--hint
      font-size 10px
      color #808080
      margin 0
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
</style>

