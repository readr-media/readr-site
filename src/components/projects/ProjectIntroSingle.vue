<template>
  <div class="project-single-intro" :style="{ backgroundImage: `url(${getImageUrl(get(project, 'heroImage'))})`, }">
    <div class="project-single-intro__container">
      <div class="project-single-intro__title">
        <span v-text="title"></span>
      </div>
      <div class="project-single-intro__desc">
        <span v-text="desc"></span>
      </div>
    </div>
    <div class="project-single-intro__progress-bar" :style="{ width: `${targProgress}%` }">
      <div class="current-progress"><span v-text="`${currProgress}%`"></span></div>
    </div>
  </div>
</template>
<script>
import { get, } from 'lodash'
import { getImageUrl, } from 'src/util/comm'
// const debug = require('debug')('CLIENT:ProjectIntroSingle')

export default {
  name: 'ProjectIntroSingle',
  computed: {
    targProgress () {
      return get(this.project, 'progress', 0)
    },
    desc () {
      return get(this.project, 'description', '')
    },
    project () {
      return get(this.$store, 'state.publicProjectSingle', {})
    },
    title () {
      return get(this.project, 'title')
    },
  },
  data () {
    return {
      currProgress: 0,
      isProgressRun: false,
    }
  },
  methods: {
    get,
    getImageUrl,
    runProgress () {
      // debug('this.targProgress', this.targProgress)
      const interval = setInterval(() => {
        this.currProgress += Math.ceil(this.targProgress / 100)
        // debug('this.currProgress', this.currProgress)
        // debug('this.targProgress', this.targProgress)
        if (this.currProgress >= this.targProgress) {
          this.currProgress = this.targProgress
          clearInterval(interval)
        }
      }, 10)
    },
  },
  mounted () {},
  props: {
    projSlug: {
      type: String,
    },
  },
  watch: {
    targProgress () {
      if (!this.isProgressRun) {
        this.isProgressRun = true
        this.runProgress()
      }
    },
  },
}
</script>
<style lang="stylus" scoped>
.project-single-intro
  width 100%
  // min-height 205px
  margin-bottom 10px
  position relative
  background-color #fff
  background-position center right
  background-size 80%
  background-repeat no-repeat
  &__container
    background-image linear-gradient(to right, rgba(255,255,255,1) 0%,rgba(255,255,255,1) 30%,rgba(255,255,255,0) 70%,rgba(255,255,255,0) 100%)
    padding 20px 30px 35px
    width 100%
    height 100%
    font-size 1.125rem
    line-height 1.5625rem
    font-weight normal
    > div:not(:first-child)
      margin-top 10px
    > div:not(:last-child)
      margin-bottom 10px
  &__title
    font-size 3.125rem
    font-weight 600
    line-height normal
  &__desc
    width 40%
  &__progress-bar
    position absolute
    height 5px
    bottom 0
    left 0
    background-color #ddcf21
    transition width 1.5s
    .current-progress
      width 28px
      height 28px
      position absolute
      right -14px
      top -11px
      background-color #ddcf21
      border-radius 50%
      display flex
      justify-content center
      align-items center
      color #fff
      font-size 0.625rem
      z-index 999
</style>