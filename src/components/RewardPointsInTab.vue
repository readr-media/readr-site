<template>
  <section class="reward-points-in-tab">
    <h1 class="reward-points-in-tab__current-points">目前點數：<span :class="`points${currentRewardPoints < 0 ? '--less-than-zero' : ''}`" v-text="currentRewardPoints"></span></h1>
    <PostListInTab
      :parent="$options.name"
      :posts="rewardPointsTransactions">
    </PostListInTab>
  </section>
</template>

<script>
import PostListInTab from './PostListInTab.vue'
import _ from 'lodash'

const fetchProjectsList = (store, params) => {
  return store.dispatch('GET_PROJECTS_LIST', {
    params: params
  })
}

const fetchRewardPointsTransactions = (store, params) => {
  return store.dispatch('GET_REWARD_POINTS_TRANSACTIONS', {
    params: params
  })
}

export default {
  name: 'RewardPointsInTab',
  components: {
    PostListInTab
  },
  data () {
    return {
      userId: _.get(this.$store.state, 'profile.id', ''),
      currentRewardPoints: 300 - _.get(this.$store.state, 'profile.points', '')
    }
  },
  computed: {
    rewardPointsTransactions () {
      return _.forEach(_.get(this.$store.state, 'rewardPointsTransactions.items', []), transaction => {
        const id = transaction.objectId
        const found = _.find(this.projects, [ 'id', id ])
        const active = found ? found.active : 3
        const title = found ? found.title : '不存在的專題'
        this.$set(transaction, 'active', active)
        this.$set(transaction, 'title', title)
      })
    },
    projects () {
      return _.get(this.$store.state, 'projectsList.items', [])
    }
  },
  beforeMount () {
    fetchRewardPointsTransactions(this.$store, {
      id: this.userId
    })
    fetchProjectsList(this.$store, {})
  }
}
</script>

<style lang="stylus" scoped>
.reward-points-in-tab
  width 750px
  margin 0 auto
  &__current-points
    margin 15px 0
    font-size 14px

$points
  font-size 25px
  font-weight 600
.points
  @extends $points
  color #11b8c9
  &--less-than-zero
    @extends $points
    color #d0021b
</style>

