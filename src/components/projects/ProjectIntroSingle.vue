<template>
  <div class="project-single-intro">
    <div class="project-single-intro__progress-bar" :style="{ width: `${targProgress}%` }">
      <div class="current-progress"><span v-text="`${currProgress}%`"></span></div>
    </div>
    <div class="project-single-intro__container">
      <div class="project-single-intro__desc">
        <span v-text="desc"></span>
      </div>
      <AppArticleNav :articleType="'project'" :postId="project.id" :commentCount="project.commentAmount || 0"></AppArticleNav>
    </div>
  </div>
</template>
<script>
import AppArticleNav from 'src/components/AppArticleNav.vue'
import { get, } from 'lodash'
const debug = require('debug')('CLIENT:ProjectIntroSingle')

export default {
  name: 'ProjectIntroSingle',
  components: {
    AppArticleNav,
  },
  computed: {
    targProgress () {
      return get(this.project, 'progress', 0)
    },
    desc () {
      return get(this.project, 'description', '')
    },
    project () {
      return get(this.$store, 'state.publicProjectSingle')
    },
  },
  data () {
    return {
      currProgress: 0,
      isProgressRun: false,
    }
  },
  methods: {
    runProgress () {
      debug('this.targProgress', this.targProgress)
      const interval = setInterval(() => {
        this.currProgress += Math.round(this.targProgress / 100)
        debug('this.targProgress', this.targProgress)
        if (this.currProgress >= this.targProgress) {
          this.currProgress = this.targProgress
          clearInterval(interval)
        }
      }, 10)
    },
  },
  mounted () {},
  props: {
    projId: {
      type: Number,
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
  background-color #fff
  padding 30px 30px 24px
  margin-bottom 10px
  position relative
  &__container
    width 100%
    font-size 1.125rem
    line-height 1.5625rem
    font-weight normal
    > div:not(:first-child)
      margin-top 20px
    > div:not(:last-child)
      margin-bottom 20px
  &__progress-bar
    position absolute
    height 5px
    top 0
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
</style>