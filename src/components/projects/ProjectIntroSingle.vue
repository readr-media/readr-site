<template>
  <div class="project-single-intro" :style="{ backgroundImage: `url(${getFullUrl(get(project, 'heroImage') || '/public/media.jpeg')})`, }">
    <div class="project-single-intro__container">
      <div class="follow" @click="clickFollow">
        <img class="follow__icon" :src="isFollowed ? '/public/icons/star-blue.png' : '/public/icons/star-line-blue.png'" alt="">
        <span class="follow__hint" v-text="`${$t('FOLLOWING.FOLLOW')}${$t('FOLLOWING.PROJECT')}`"></span>
      </div>
      <div class="project-single-intro__title">
        <span v-text="title"></span>
      </div>
      <div class="project-single-intro__desc">
        <span v-text="desc"></span>
      </div>
    </div>
  </div>
</template>
<script>
import { get, } from 'lodash'
import { getFullUrl, } from 'src/util/comm'
import { mapState, } from 'vuex'
// const debug = require('debug')('CLIENT:ProjectIntroSingle')

const publishAction = (store, data) => store.dispatch('FOLLOW', { params: data, })
const switchOn = (store, message) => store.dispatch('LOGIN_ASK_TOGGLE', { active: true, message, type: 'GO_LOGIN', })
const toogleFollowingByUserStat = (store, { resource, resourceType = '', targetId, }) => {
  return store.commit('TOOGLE_FOLLOWING_BY_USER_STAT', {
    params: {
      resource,
      resourceType,
      targetId,
    },
  })
}

export default {
  name: 'ProjectIntroSingle',
  computed: {
    ...mapState({
      projectFollowingByUser: state => get(state.followingByUserStats, [ 'project', ], {}),
    }),
    project () {
      return get(this.$store, 'state.publicProjectSingle', {})
    },
    desc () {
      return get(this.project, 'description', '')
    },
    title () {
      return get(this.project, 'title')
    },
    isLoggedIn () {
      return this.$store.state.isLoggedIn
    },
    isFollowed () {
      return this.$store.state.isLoggedIn && get(this.projectFollowingByUser, this.project.id, false)
    },
  },
  data () {
    return {
      isProgressRun: false,
    }
  },
  methods: {
    get,
    getFullUrl,
    // TODO: Refactor following to a component like ButtonFollow.vue
    clickFollow () {
      if (this.isLoggedIn) {
        this.toogleFollow()
      } else {
        switchOn(this.$store)
      }
    },
    toogleFollow () {
      if (this.isFollowed) {
        publishAction(this.$store, {
          action: 'unfollow',
          resource: 'project',
          subject: this.$store.state.profile.id,
          object: this.project.id,
        })
      } else {
        publishAction(this.$store, {
          action: 'follow',
          resource: 'project',
          subject: this.$store.state.profile.id,
          object: this.project.id,
        })
      }

      toogleFollowingByUserStat(this.$store, { resource: 'project', targetId: this.project.id, })
    },
  },
  mounted () {},
  props: {
    projSlug: {
      type: String,
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
  background-color #e6e6e6
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
    line-height 1.25
    max-width 40%
    text-align justify
  &__desc
    width 40%
  
.follow
  margin 0
  &__icon
    d = 25px
    width d
    height d
    cursor pointer
  &__hint
    font-size 14px
    color #11b8c9
    margin 0 0 0 5px
    position relative
    bottom 2px
</style>