<template>
  <section class="followingListInTab">
    <nav class="followingListInTab__nav">
      <button
        :class="{ active: resource === 'member' }"
        @click="$_followingListInTab_handleResource('member')"
        v-text="$t('FOLLOWING.GUEST_EDITOR')">
      </button>
      <button
        :class="{ active: resource === 'post' && resourceType === 'review' }"
        @click="$_followingListInTab_handleResource('review')"
        v-text="`${$t('FOLLOWING.FOLLOW')}${$t('FOLLOWING.REVIEW')}`">
      </button>
      <button
        :class="{ active: resource === 'post' && resourceType === 'news' }"
        @click="$_followingListInTab_handleResource('news')"
        v-text="`${$t('FOLLOWING.FOLLOW')}${$t('FOLLOWING.NEWS')}`">
      </button>
      <button
        :class="{ active: resource === 'project' }"
        @click="$_followingListInTab_handleResource('project')"
        v-text="`${$t('FOLLOWING.FOLLOW')}${$t('FOLLOWING.PROJECT')}`">
      </button>
    </nav>
    <!-- <pagination-nav></pagination-nav> -->
    <div class="followingListInTab__list">
      <div v-for="follow in followingByUser" :key="follow.id" class="followingListInTab__item" :class="resource">
        <div class="followingListInTab__img">
          <div v-if="resource === 'member'" :style="{ backgroundImage: `url(${follow.profileImage})` }"></div>
          <button @click="$_followingListInTab_unfollow(follow.id)"><img src="/public/icons/star-grey.png"></button>
        </div>
        <div class="followingListInTab__content">
          <h2 v-if="resource === 'member'" v-text="follow.nickname"></h2>
          <h2 v-if="resource !== 'member'" v-text="follow.title"></h2>
          <p v-if="$_followingListInTab_getDescription(follow)" v-text="$_followingListInTab_getDescription(follow)"></p>
        </div>
        <div v-if="resource === 'project'" class="followingListInTab__og"></div>
      </div>
      <span v-if="followingByUser.length === 0" v-text="`${$t('FOLLOWING.NO_RECORD')}${alertText}`"></span>
    </div>
  </section>
</template>
<script>
  import { get, } from 'lodash'
  import PaginationNav from './PaginationNav.vue'

  const getFollowing = (store, route, { isProfilePage = false, resource = 'member', resourceType = '', } = {}) => {
    return store.dispatch('GET_FOLLOWING_BY_USER', {
      subject: isProfilePage ? get(route, 'params.id') : get(store, 'state.profile.id'),
      resource: resource,
      resource_type: resourceType,
    })
  }

  const unfollow = (store, { resource = 'member', object, }) => {
    return store.dispatch('FOLLOW', {
      params: {
        action: 'unfollow',
        resource: resource,
        subject: get(store, 'state.profile.id'),
        object: object,
      },
    })
  }

  const deleteStoreFollowingByUser = (store, { resource = 'member', object, }) => {
    return store.dispatch('UPDATE_FOLLOWING_BY_USER', {
      params: {
        action: 'unfollow',
        resource: resource,
        resourceId: object,
        userId: get(store, 'state.profile.id'),
      },
    })
  }

  export default {
    name: 'FollowingListInTab',
    components: {
      'pagination-nav': PaginationNav,
    },
    data () {
      return {
        resource: 'member',
        resourceType: '',
      }
    },
    computed: {
      alertText () {
        switch (this.resource) {
          case 'member':
            return this.$t('FOLLOWING.GUEST_EDITOR')
          case 'review':
            return this.$t('FOLLOWING.REVIEW')
          case 'news':
            return this.$t('FOLLOWING.NEWS')
          case 'project':
            return this.$t('FOLLOWING.PROJECT')
        }
      },
      isProfilePage () {
        return get(this.$route, 'fullPath', '').split('/')[1] === 'profile'
      },
      followingByUser () {
        return get(this.$store, 'state.followingByUser', [])
      },
    },
    beforeMount () {
      getFollowing(this.$store, this.$route, { isProfilePage: this.isProfilePage, })
    },
    methods: {
      $_followingListInTab_getDescription (follow) {
        switch (this.resource) {
          case 'member': {
            return get(follow, [ 'description', ])
          }
          case 'post': {
            const parser = new DOMParser()
            const html = parser.parseFromString(follow.content, 'text/html')
            const origin = Array.from(html.querySelectorAll('p'))
              .filter((node) => {
                return node.innerHTML !== '<br>'
              })
              .map((node) => {
                return node.innerHTML.replace(/<[^>]*>/g, "")
              })
              .join('')
            return origin
          }
          default:
            return ''
        }
      },
      $_followingListInTab_handleResource (type) {
        switch (type) {
          case 'review':
            this.resource = 'post'
            this.resourceType = 'review'
            return getFollowing(this.$store, this.$route, { isProfilePage: this.isProfilePage, resource: this.resource, resourceType: this.resourceType, })
          case 'news':
            this.resource = 'post'
            this.resourceType = 'news'
            return getFollowing(this.$store, this.$route, { isProfilePage: this.isProfilePage, resource: this.resource, resourceType: this.resourceType, })
          default:
            this.resource = type
            this.resourceType = ''
            getFollowing(this.$store, this.$route, { isProfilePage: this.isProfilePage, resource: this.resource, })
        }
      },
      $_followingListInTab_unfollow (id) {
        unfollow(this.$store, { resource: this.resource, object: id, })
        .then(() => {
          deleteStoreFollowingByUser(this.$store, { resource: this.resource, object: id, })
        })
      },
    },
  }
</script>
<style lang="stylus" scoped>

.followingListInTab
  width 750px
  margin 0 auto
  &__nav
    button
      height 15px
      padding 0
      margin 0 5px
      color #a8a8a8
      font-size 15px
      background transparent
      border none
      outline none
      &.active
        color #000
        &::before
          content ''
          width 0
          height 0
          margin-right 3px
          font-size 0
          line-height 0
          vertical-align super
          border-style solid
          border-width 7.5px 0 7.5px 15px
          border-color transparent transparent transparent #ddcf21
  &__list
    margin-top 30px
    min-height 297px
    > span
      font-size 1.125rem
  &__item
    display flex
    align-items flex-start
    margin-bottom 25px
    &.review
      .followingListInTab__img
        width 25px
        height 25px
        text-align left
      .followingListInTab__content
        h2
          height 25px
          line-height 25px
  &__img
      width 60px
      text-align center
      > div
        width 60px
        height 60px
        margin-bottom 10px
        background-position center
        background-size cover
        background-repeat no-repeat
        border 1px solid #979797
        border-radius 50%
      > button
        width 25px
        height 25px
        padding 0
        text-align center
        background transparent
        border none
        outline none
        img 
          width 100%
  &__content
    flex 1
    margin-left 10px
    h2
      margin 0
      font-size 18px
      line-height 20px
    p
      max-height 63px
      margin-top 1em
      margin-bottom 0
      font-size 15px
      text-align justify
      line-height 1.4
      overflow hidden
  &__og
    width 175px
    height 92px
    margin-left 15px

</style>
