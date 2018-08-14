<template>
  <section class="followingListInTab">
    <nav class="followingListInTab__nav">
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
      <button
        :class="{ active: resource === 'report' }"
        @click="$_followingListInTab_handleResource('report')"
        v-text="`${$t('FOLLOWING.FOLLOW')}${$t('FOLLOWING.REPORT')}`">
      </button>
      <button
        :class="{ active: resource === 'memo' }"
        @click="$_followingListInTab_handleResource('memo')"
        v-text="`${$t('FOLLOWING.FOLLOW')}${$t('FOLLOWING.MEMO')}`">
      </button>
    </nav>
    <!-- <pagination-nav></pagination-nav> -->
    <div class="followingListInTab__list">
      <div v-for="follow in followingByUser" :key="follow.id" class="followingListInTab__item" :class="resource">
        <div class="followingListInTab__img">
          <template v-if="!isProfilePage">
            <button @click="$_followingListInTab_unfollow(follow.id)"><img src="/public/icons/star-grey.png"></button>
          </template>
          <template v-else-if="isProfilePage && isLoggedIn">
            <button @click="$_followingListInTab_toggleFollow(follow.id, $_followingListInTab_isFollow(follow.id))"><img :src="$_followingListInTab_isFollow(follow.id) ? '/public/icons/star-grey.png' : '/public/icons/star-line-grey.png'"></button>
          </template>
        </div>
        <div class="followingListInTab__content">
          <h2 v-text="follow.title"></h2>
          <p v-if="$_followingListInTab_getDescription(follow)" v-text="$_followingListInTab_getDescription(follow)"></p>
        </div>
        <div 
          v-if="resource === 'project' || resource === 'report'" 
          class="followingListInTab__og"
          :class="{ 'no-image': !follow.heroImage }"
          :style="{ backgroundImage: follow.heroImage ? `url(${follow.heroImage})` : `url(/public/icons/exclamation.png)` }">
        </div>
      </div>
      <span v-if="followingByUser.length === 0" v-text="`${$t('FOLLOWING.NO_RECORD')}${alertText}`"></span>
    </div>
  </section>
</template>
<script>
  import { find, get, } from 'lodash'
  import PaginationNav from './PaginationNav.vue'

  const getFollowing = (store, { id = get(store, 'state.profile.id'), resource = 'post', resourceType = 'review', } = {}) => {
    return store.dispatch('GET_FOLLOWING_BY_USER', {
      id: id,
      resource: resource,
      resource_type: resourceType,
    })
  }

  const publishAction = (store, { action, resource = 'post', object, }) => {
    return store.dispatch('FOLLOW', {
      params: {
        action: action,
        resource: resource,
        subject: get(store, 'state.profile.id'),
        object: object,
      },
    })
  }

  const updateStoreFollowingByUser = (store, { action, resource = 'post', object, item, }) => {
    return store.dispatch('UPDATE_FOLLOWING_BY_USER', {
      params: {
        action: action,
        resource: resource,
        resourceId: object,
        userId: get(store, 'state.profile.id'),
        item: item,
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
        resource: 'post',
        resourceType: 'review',
      }
    },
    computed: {
      alertText () {
        switch (this.resource) {
          case 'memo':
            return this.$t('FOLLOWING.MEMO')
          case 'post':
            if (this.resourceType === 'review') {
              return this.$t('FOLLOWING.REVIEW')
            }
            return this.$t('FOLLOWING.NEWS')
          case 'project':
            return this.$t('FOLLOWING.PROJECT')
          case 'report':
            return this.$t('FOLLOWING.REPORT')
        }
      },
      isLoggedIn () {
        return this.$store.state.isLoggedIn
      },
      isProfilePage () {
        return get(this.$route, 'fullPath', '').split('/')[1] === 'profile'
      },
      userId () {
        return this.isProfilePage ? get(this.$route, 'params.id') : get(this.$store, 'state.profile.id')
      },
      followingByUser () {
        if (this.resource === 'post') {
          return get(this.$store, [ 'state', 'followingByUser', this.userId, this.resource, this.resourceType, ], [])
        } else {
          return get(this.$store, [ 'state', 'followingByUser', this.userId, this.resource, ], [])
        }
      },
    },
    beforeMount () {
      if (this.isProfilePage) {
        Promise.all([ getFollowing(this.$store), getFollowing(this.$store, { id: Number(get(this.$route, 'params.id')), }), ])
      } else {
        getFollowing(this.$store)
      }
    },
    methods: {
      $_followingListInTab_getDescription (follow) {
        switch (this.resource) {
          case 'project':
          case 'report': {
            return get(follow, [ 'description', ])
          }
          case 'post':
          case 'memo': {
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
            if (this.isProfilePage) {
              return Promise.all([
                getFollowing(this.$store, { resource: this.resource, resourceType: this.resourceType, }),
                getFollowing(this.$store, { id: Number(get(this.$route, 'params.id')), resource: this.resource, resourceType: this.resourceType, }),
              ])
            } else {
              return getFollowing(this.$store, { resource: this.resource, resourceType: this.resourceType, })
            }
          case 'news':
            this.resource = 'post'
            this.resourceType = 'news'
            if (this.isProfilePage) {
              return Promise.all([
                getFollowing(this.$store, { resource: this.resource, resourceType: this.resourceType, }),
                getFollowing(this.$store, { id: Number(get(this.$route, 'params.id')), resource: this.resource, resourceType: this.resourceType, }),
              ])
            } else {
              return getFollowing(this.$store, { resource: this.resource, resourceType: this.resourceType, })
            }
          default:
            this.resource = type
            this.resourceType = ''
            if (this.isProfilePage) {
              return Promise.all([
                getFollowing(this.$store, { resource: this.resource, }),
                getFollowing(this.$store, { id: Number(get(this.$route, 'params.id')), resource: this.resource, }),
              ])
            } else {
              return getFollowing(this.$store, { resource: this.resource, })
            }
        }
      },
      $_followingListInTab_isFollow (id) {
        return find(get(this.$store, [ 'state', 'followingByUser', get(this.$store, 'state.profile.id'), ]), { id: id, })
      },
      $_followingListInTab_toggleFollow (id, isFollow) {
        if (isFollow) {
          publishAction(this.$store, { action: 'unfollow', resource: this.resource, object: id, })
          .then(() => {
            updateStoreFollowingByUser(this.$store, { action: 'unfollow', resource: this.resource, object: id, })
          })
        } else {
          const item = find(this.followingByUser, { id: id, })
          publishAction(this.$store, { action: 'follow', resource: this.resource, object: id, })
          .then(() => {
            updateStoreFollowingByUser(this.$store, { action: 'follow', resource: this.resource, object: id, item: item, })
          })
        }
      },
      $_followingListInTab_unfollow (id) {
        publishAction(this.$store, { action: 'unfollow', resource: this.resource, object: id, })
        .then(() => {
          updateStoreFollowingByUser(this.$store, { action: 'unfollow', resource: this.resource, object: id, })
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
    background-position center
    background-size cover
    background-repeat no-repeat
    &.no-image
      background-size contain

</style>
