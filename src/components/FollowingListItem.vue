<template>
  <li class="list-item">
    <slot></slot>
    <img
      class="list-item__follow-icon"
      :src="isFollowed ? '/public/icons/star-blue.png' : '/public/icons/star-line-blue.png'"
      alt="follow"
      @click="toggleFollow"
    >
  </li>
</template>

<script>
import { get, } from 'lodash'

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
  props: {
    id: {
      type: Number,
      required: true,
    },
    resource: {
      type: String,
      required: true,
    },
  },
  computed: {
    followingStatsLoggenInUser () {
      const data = get(this.$store, [ 'state', 'followingByUserStats', this.resource, ], [])
      return data
    },
    isFollowed () {
      return get(this.followingStatsLoggenInUser, this.id, false)
    },
  },
  methods: {
    get,
    toggleFollow () {
      publishAction(this.$store, { action: this.isFollowed ? 'unfollow' : 'follow', resource: this.resource, object: this.id, })
      toogleFollowingByUserStat(this.$store, { resource: this.resource, targetId: this.id, })
    },
  },
}
</script>

<style lang="stylus" scoped>
.list-item
  display flex
  justify-content space-between
  align-items center
  padding 13px 0 13px 13px
  &__follow-icon
    d = 15px
    width d
    height d
    cursor pointer
</style>

