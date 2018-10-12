<template>
  <section class="following-list-in-tab">
    <AppDropdownOptions
      class="following-list-in-tab__filter"
      :picked.sync="resource"
      :options="radioOptions"
    />
    <p
      class="following-list-in-tab__data-empty-hint"
      v-if="isDataEmpty"
      :is="dataEmptyHint"
    >
    </p>
    <template
      v-else
      v-for="date in calendarFormatsValues"
    >
      <FollowingList
        class="following-list-in-tab__list"
        :key="date"
        v-if="date in followingByUserGroupByDate"
        :date="date"
        :data="followingByUserGroupByDate[date]"
      />
    </template>
  </section>
</template>

<script>
import { get, groupBy, mapValues, sortBy, concat, isEmpty, pickBy, } from 'lodash'
import { isClientSide, } from 'src/util/comm'
import moment from 'moment'
import AppDropdownOptions from './AppDropdownOptions.vue'
import FollowingList from './FollowingList.vue'

const DEFAULT_MAX_RESULT_INIT = 20
const DEFAULT_PAGE_INIT = 1
const DEFAULT_MAX_RESULT_LOADMORE = 10
const DEFAULT_PAGE_LOADMORE = 3

const getFollowing = (store, { id = get(store, 'state.profile.id'), resource = 'project', resource_type = '', max_result, page, } = {}) => {
  return store.dispatch('GET_FOLLOWING_BY_USER', {
    id,
    resource,
    resource_type,
    max_result,
    page,
  })
}

export default {
  name: 'FollowingListInTab',
  components: {
    AppDropdownOptions,
    FollowingList,
  },
  watch: {
    isReachBottom () {
      if (this.isReachBottom && this.shouldLoadmore) {
        this.fetchFollowing(true)
      }
    },
  },
  props: {
    isReachBottom: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      resource: 'all', // all, project or tag (Following list in tab now only display projects or tags which were followed by user)
      currentPage: DEFAULT_PAGE_LOADMORE,
      shouldLoadmore: undefined,
      radioOptions: [
        {
          text: this.$t('FOLLOWING.FILTER.all'),
          key: 'all',
        },
        {
          text: this.$t('FOLLOWING.FILTER.project'),
          key: 'project',
        },
        {
          text: this.$t('FOLLOWING.FILTER.tag'),
          key: 'tag',
        },
      ],
      calendarFormats: this.$t('FOLLOWING.calendarFormats'),
    }
  },
  computed: {
    calendarFormatsValues () {
      return Object.values(this.calendarFormats)
    },
    isClientSide,
    isLoggedIn () {
      return this.$store.state.isLoggedIn
    },
    isPublicProfilePage () {
      return get(this.$route, 'fullPath', '').split('/')[1] === 'profile'
    },
    userId () {
      return this.isPublicProfilePage ? get(this.$route, 'params.id') : get(this.$store, 'state.profile.id')
    },
    followingByUser () {
      const _getFollowingByUserResource = resource => get(this.$store, [ 'state', 'followingByUser', this.userId, resource, ], [])
      const followingByUserProjects = _getFollowingByUserResource('project')
      const followingByUserTags = _getFollowingByUserResource('tag')
      const followingByUserAll = concat(followingByUserProjects, followingByUserTags)

      return {
        project: followingByUserProjects,
        tag: followingByUserTags,
        all: followingByUserAll,
      }
    },
    followingByUserGroupByDate () {
      const followingByUser = this.followingByUser[this.resource]
      const grouped = groupBy(followingByUser, followingItem => {
        const itemFollowedAt = get(followingItem, 'followedAt', '')
        return moment(itemFollowedAt, 'YYYY-MM-DD').calendar(null, this.calendarFormats)
      })
      const sorted = mapValues(grouped, array => sortBy(array, element => -moment(element.followedAt)))
      const filtered = pickBy(sorted, (value, key) => key !== 'Invalid date')

      return filtered
    },
    isDataEmpty () {
      return isEmpty(this.followingByUserGroupByDate)
    },
    dataEmptyHint () {
      const dataEmptyHintNotLoggedIn = {
        render: (h) => {
          return h('p', [
            h('router-link', { props: { to: '/login', }, }, this.$t('FOLLOWING.LOGIN_HINT.login')),
            this.$t('FOLLOWING.LOGIN_HINT.suffix'),
          ])
        },
      }
      const dataEmptyHintProfile = (() => {
        const to = this.resource === 'project' ? '/series-list' : '/'
        switch (this.resource) {
          case 'project':
          case 'tag':
            return {
              render: (h) => {
                return h('p', [
                  this.$t(`FOLLOWING.DATA_EMPTY_HINT.PROFILE.${this.resource}.prefix`),
                  h('router-link', { props: { to: to, }, }, this.$t(`FOLLOWING.TO['${to}']`)),
                  this.$t(`FOLLOWING.DATA_EMPTY_HINT.PROFILE.${this.resource}.suffix`),
                ])
              },
            }
          default:
            return {
              render: (h) => {
                return h('p', [
                  this.$t('FOLLOWING.DATA_EMPTY_HINT.PROFILE.all.prefix'),
                  h('router-link', { props: { to: '/', }, }, this.$t(`FOLLOWING.TO['/']`)),
                  this.$t('FOLLOWING.DATA_EMPTY_HINT.PROFILE.all.or'),
                  h('router-link', { props: { to: '/series-list', }, }, this.$t(`FOLLOWING.TO['/series-list']`)),
                  this.$t('FOLLOWING.DATA_EMPTY_HINT.PROFILE.all.suffix'),
                ])
              },
            }
        }
      })()
      const dataEmptyHintProfilePublic = {
        render: (h) => {
          return h('p', [
            this.resource === 'all' ? 
            `${this.$t('FOLLOWING.DATA_EMPTY_HINT.PUBLIC_PROFILE.prefix')}${this.$t('FOLLOWING.FILTER.project')}${this.$t('FOLLOWING.DATA_EMPTY_HINT.PUBLIC_PROFILE.and')}${this.$t('FOLLOWING.FILTER.tag')}` :
            `${this.$t('FOLLOWING.DATA_EMPTY_HINT.PUBLIC_PROFILE.prefix')}${this.$t(`FOLLOWING.FILTER.${this.resource}`)}`,
          ])
        },
      }
      if (!this.isPublicProfilePage) { return dataEmptyHintProfile }
      if (!this.isClientSide) { return dataEmptyHintProfilePublic }
      if (!this.isLoggedIn) { return dataEmptyHintNotLoggedIn }
      return dataEmptyHintProfilePublic
    },
    followingStatsLoggenInUser () {
      const data = get(this.$store, [ 'state', 'followingByUserStats', this.resource, ], [])
      return data
    },
  },
  methods: {
    fetchFollowing (isLoadmore) {
      const _maxResult = isLoadmore ? DEFAULT_MAX_RESULT_LOADMORE : DEFAULT_MAX_RESULT_INIT
      const _page = isLoadmore ? this.currentPage : DEFAULT_PAGE_INIT
      const _fetchFollowingPublicProfile = () => {
        const publicProfileUserId = Number(get(this.$route, 'params.id'))
        getFollowing(this.$store, { resource: [ 'project', 'tag', ], }),
        getFollowing(this.$store, { id: publicProfileUserId, resource: [ 'project', 'tag', ], max_result: _maxResult, page: _page, })
        .then(({ body, }) => {
          this.shouldLoadmore = body.items.length >= _maxResult
          if (isLoadmore && this.shouldLoadmore) { this.currentPage += 1 }
        })
        .catch(error => {
          console.log(error)
          this.shouldLoadmore = false
        })
      }
      const _fetchFollowingMemberCenter = () => {
        getFollowing(this.$store, { resource: [ 'project', 'tag', ], max_result: _maxResult, page: _page, })
        .then(({ body, }) => {
          this.shouldLoadmore = body.items.length >= _maxResult
          if (isLoadmore && this.shouldLoadmore) { this.currentPage += 1 }
        })
        .catch(error => {
          console.log(error)
          this.shouldLoadmore = false
        })
      }

      if (this.isLoggedIn) {
        if (this.isPublicProfilePage) {
          _fetchFollowingPublicProfile()
        } else {
          _fetchFollowingMemberCenter()
        }
      }
    },
  },
  created () {
    moment.calendarFormatDefault = Object.assign(moment.calendarFormat)

    // Customize calendarFormat function
    moment.calendarFormat = function (myMoment, now) {
      const endOfWeek = moment().endOf('isoWeek')
      const endOfLastWeek = endOfWeek.clone().subtract(7, 'days')
      const endOfMonth = moment().endOf('month')
      const endOfLastMonth = endOfMonth.clone().subtract(1, 'month').endOf('month')

      const diff = (compare) => myMoment.diff(compare, 'days', true)

      const retVal = 
        diff(now) >= 0 && diff(now) < 1 ? 'sameDay' :
        diff(now) >= -1 && diff(now) < 0 ? 'lastDay' :
        diff(endOfWeek) >= -7 ? 'thisWeek' :
        diff(endOfLastWeek) >= -7 ? 'lastWeek' :
        diff(endOfMonth) >= -endOfMonth.daysInMonth() ? 'thisMonth' :
        diff(endOfLastMonth) >= -endOfLastMonth.daysInMonth() ? 'lastMonth' : 'lastMonthBefore'

      return retVal
    }
  },
  destroyed () {
    // Restore calendarFormat function to default
    moment.calendarFormat = moment.calendarFormatDefault
  },
  beforeMount () {
    this.fetchFollowing()
  },
}
</script>
<style lang="stylus" scoped>
.following-list-in-tab
  padding 0 100.5px
  &__filter
    float right
  &__data-empty-hint
    clear right
    font-size 18px
    & >>> a
      color #4280a2
      border-bottom 1px solid #4280a2
  &__list
    clear right
    margin 14px 0 0 0
</style>
