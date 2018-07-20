<template>
  <div class="projects-figure">
    <router-link class="projects-figure-content" :to="`/series/${this.project.slug}`">
      <figure>
        <img v-if="project.heroImage" :src="project.heroImage">
        <span v-if="!project.heroImage" v-text="project.title"></span>
      </figure>
      <div class="projects-figure-content__info">
        <div class="progress">
          <span v-text="`${progress}%`"></span>
          <div class="progress__left rect">
            <div class="circle" :style="{ transform: progress >= 50 ? `rotate(${225 + (progress - 50) / 50 * 180}deg)` : 'rotate(225deg)' }"></div>
          </div>
          <div class="progress__right rect">
            <div class="circle" :style="{ transform: progress >= 50 ? 'rotate(405deg)' : `rotate(${225 + progress / 50 * 180}deg)` }"></div>
          </div>
        </div>
        <div class="projects-figure-content__info-title">
          <p v-text="updatedAtYYYYMMDD(project.updatedAt)"></p>
          <h1 v-text="project.title"></h1>
        </div>
        <p class="projects-figure-content__descr" v-text="project.description"></p>
      </div>
    </router-link>
    <div class="projects-figure-controlbar">
      <div>
        <img src="/public/icons/comment-quote.png" alt="">
        <span v-text="project.commentAmount || 0"></span>
      </div>
      <div>
        <img src="/public/icons/view-blue.png" alt="">
        <span v-text="project.views || 0"></span>
      </div>
      <div v-if="isLoggedIn" class="follow" @click="toogleFollow">
        <img :src="isFollowed ? '/public/icons/star-blue.png' : '/public/icons/star-line-blue.png'" alt="">
        <span v-text="$t('FOLLOWING.FOLLOW')"></span>
      </div>
      <!-- <div>
        <img src="/public/icons/donate.png" alt="">
      </div> -->
    </div>
  </div>
</template>

<script>
import { find, } from 'lodash'
import { updatedAtYYYYMMDD, } from '../../util/comm'

const publishAction = (store, data) => store.dispatch('FOLLOW', { params: data, })
const updateStoreFollowingByResource = (store, { action, resource, resourceId, userId, }) => {
  return store.dispatch('UPDATE_FOLLOWING_BY_RESOURCE', {
    params: {
      action: action,
      resource: resource,
      resourceId: resourceId,
      userId: userId,
    },
  })
}

export default {
  name: 'ProjectsFigure',
  props: {
    project: {
      type: Object,
      required: true,
    },
  },
  computed: {
    followers () {
      const data = find(this.$store.state.followingByResource.project, { resourceID: this.projectId, })
      return data ? data.followers : []
    },
    isFollowed () {
      return this.$store.state.isLoggedIn && this.followers && this.followers.indexOf(this.$store.state.profile.id) !== -1 
    },
    isLoggedIn () {
      return this.$store.state.isLoggedIn
    },
    progress () {
      return (this.project.progress && this.project.progress > 0) ? this.project.progress : 0
    },
    projectId () {
      return this.project.id
    },
  },
  methods: {
    toogleFollow () {
      if (this.isFollowed) {
        publishAction(this.$store, {
          action: 'unfollow',
          resource: 'project',
          subject: this.$store.state.profile.id,
          object: this.projectId,
        })
        updateStoreFollowingByResource(this.$store, {
          action: 'unfollow',
          resource: 'project',
          resourceId: this.projectId,
          userId: this.$store.state.profile.id,
        })
      } else {
        publishAction(this.$store, {
          action: 'follow',
          resource: 'project',
          subject: this.$store.state.profile.id,
          object: this.projectId,
        })
        updateStoreFollowingByResource(this.$store, {
          action: 'follow',
          resource: 'project',
          resourceId: this.projectId,
          userId: this.$store.state.profile.id,
        })
      }
    },
    updatedAtYYYYMMDD,
  },
}
</script>

<style lang="stylus" scoped>
.projects-figure
  display flex
  flex-direction column
  width 100%
  height inherit
  margin 0
  background-color white
  color black
  transition transform .3s ease-in-out
  &:hover
    transform translateY(-10px)
    box-shadow 5px 15px 5px #bcbcbc
    
   
.projects-figure-content
  flex 1
  display block
  h1, p, figure
    margin 0
    color #000
  h1
    margin-top .5em
    font-size .9375rem
  p
    font-size .75rem
  figure
    position relative
    width 100%
    padding-top 56.25%
    background-color #11b8c9
    span
      position absolute
      top 50%
      left 50%
      transform translate(-50%, -50%)
      width 70%
      color #fff
      line-height 1.3
      font-size 1.5625rem
  img
    position absolute
    top 0
    left 0
    width 100%
    height 100%
    object-fit cover
    object-position center center
  &__info
    display flex
    flex-wrap wrap
    align-items center
    padding 20px 10px
  &__info-title
    flex 1
    margin-left 10px
  &__descr
    max-height 3.34em
    line-height 1.67
    overflow hidden
  .projects-figure-content__descr
    margin-top .5em
 
.projects-figure-controlbar
  display flex
  align-items center
  width calc(100% - 20px)
  margin 0 auto
  color #11b8c9
  padding 10px 0
  border-top 1px solid #d3d3d3
  > div
    display inline-block
    position relative
    // &:last-of-type
    //   margin 0 0 0 auto
    & + div
      margin-left 10px
  img
    width 20px
    height 20px
  span
    position relative
    left -2px
    bottom -2px
    font-size .6875rem
    user-select none
  .follow
    cursor pointer

.progress
  position relative
  width 40px
  height 40px
  span
    position absolute
    top 50%
    left 50%
    transform translate(-50%, -50%)
    color #ddcf21
    font-size .625rem
  &__left
    left 0
    .circle
      position absolute
      top 0
      left 0
      transform rotate(225deg)
      width 40px
      height 40px
      border 3px solid #ccc
      border-bottom 3px solid #ddcf21
      border-left 3px solid #ddcf21
      border-radius 50%
  &__right
    right 0
    .circle
      position absolute
      top 0
      right 0
      transform rotate(225deg)
      width 40px
      height 40px
      border 3px solid #ccc
      border-top 3px solid #ddcf21
      border-right 3px solid #ddcf21
      border-radius 50%
  .rect
    position absolute
    top 0
    width 20px
    height 40px
    overflow hidden
</style>



