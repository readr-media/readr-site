<template>
  <section class="tag-nav">
    <div v-for="tag in tags" :key="tag.id" class="tag">
      <span v-text="tag.text"></span>
      <span v-if="isLoggedIn" class="tag__action">
        <img :src="isFollow(tag.id) ? '/public/icons/star-blue.png' : '/public/icons/star-line-blue.png'" @click="toogleFollow(tag.id)">
      </span>
    </div>
  </section>
</template>
<script>

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
    name: 'TagNav',
    props: {
      tags: {
        default: () => [],
      },
    },
    computed: {
      isLoggedIn () {
        return this.$store.state.isLoggedIn
      },
    },
    methods: {
      isFollow (id) {
        const data = this.$store.state.followingByResource.tag.find(tag => tag.resourceID === id)
        const followers = data ? data.followers : []
        return followers.find(memberId => memberId === this.$store.state.profile.id )
      },
      toogleFollow (id) {
        if (this.isFollow(id)) {
          publishAction(this.$store, {
            action: 'unfollow',
            resource: 'tag',
            subject: this.$store.state.profile.id,
            object: id,
          })
          updateStoreFollowingByResource(this.$store, {
            action: 'unfollow',
            resource: 'tag',
            resourceId: id,
            userId: this.$store.state.profile.id,
          })
        } else {
          publishAction(this.$store, {
            action: 'follow',
            resource: 'tag',
            subject: this.$store.state.profile.id,
            object: id,
          })
          updateStoreFollowingByResource(this.$store, {
            action: 'follow',
            resource: 'tag',
            resourceId: id,
            userId: this.$store.state.profile.id,
          })
        }
      },
    },
  }
</script>
<style lang="stylus" scoped>

.tag-nav
  .tag
    display inline-block
    padding 0 .5em
    font-size .9375rem
    line-height 1.5rem
    font-weight 700
    border 1px solid #11b8c9
    border-radius 12px
    user-select none
    &:first-of-type
      position relative
      margin-left 20px
      &::before
        content '#'
        position absolute
        top 0
        left -20px
        color #11b8c9
        font-size 1.5rem
    & + .tag
      margin-left 5px
  .tag__action
    margin-left 5px
    > img
      position relative
      top 2px
      width 20px
      height 15px
      padding-left 5px
      border-left 1px solid #d3d3d3
      cursor pointer

</style>
