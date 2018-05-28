<template>
  <div class="backstage member">
    <div class="backstage-container">
      <app-about :profile="profile"></app-about>
      <app-tab class="backstage__tab" :tabs="tabs">
        <following-list-tab
          slot="0"
          :currentResource="followingResource"
          :followingByUser="followingByUser"
          @changeResource="$_member_updateFollowingList"
          @unfollow="$_member_unfollow">
        </following-list-tab>
      </app-tab>
    </div>
  </div>
</template>
<script>
  import { get, } from 'lodash'
  import About from '../components/About.vue'
  import FollowingListInTab from '../components/FollowingListInTab.vue'
  import Tab from '../components/Tab.vue'

  // const MAXRESULT = 20
  const DEFAULT_PAGE = 1
  // const DEFAULT_SORT = '-updated_at'

  const getFollowing = (store, { subject, resource, resourceType = '', }) => {
    return store.dispatch('GET_FOLLOWING_BY_USER', {
      subject: subject,
      resource: resource,
      resource_type: resourceType,
    })
  }

  const unfollow = (store, resource, subject, object) => {
    return store.dispatch('FOLLOW', {
      params: {
        action: 'unfollow',
        resource: resource,
        subject: subject,
        object: object,
      },
    })
  }

  export default {
    name: 'AppMember',
    components: {
      'app-about': About,
      'app-tab': Tab,
      'following-list-tab': FollowingListInTab,
    },
    data () {
      return {
        followingResource: 'member',
        tabs: [
          this.$t('tab.WORDING_TAB_FOLLOW_RECORD'),
        ],
      }
    },
    computed: {
      followingByUser () {
        return get(this.$store, [ 'state', 'followingByUser', ], [])
      },
      profile () {
        return get(this.$store, [ 'state', 'profile', ], {})
      },
    },
    beforeMount () {
      getFollowing(this.$store, { subject: get(this.profile, [ 'id', ]), resource: 'member', })
    },
    methods: {
      $_member_unfollow (resource, object) {
        const subject = get(this.profile, [ 'id', ]) 
        const objectID = object.toString()
        unfollow(this.$store, resource, subject, objectID) 
        .then(() => {
          setTimeout(() => this.$_member_updateFollowingList(), 1000)
        }) 
      },
      $_member_updateFollowingList (resource = this.followingResource) {
        this.followingResource = resource
        this.page = DEFAULT_PAGE
        switch (resource) {
          case 'review':
            return getFollowing(this.$store, { subject: get(this.profile, [ 'id', ]), resource: 'post', resourceType: resource, })
          case 'news':
            return getFollowing(this.$store, { subject: get(this.profile, [ 'id', ]), resource: 'post', resourceType: resource, })
          default:
            getFollowing(this.$store, { subject: get(this.profile, [ 'id', ]), resource: resource, })
        }
      },
    },
  }
</script>
<style lang="stylus" scoped>

</style>
