<template>
  <div class="editors">
    <div class="editors__container">
      <aside class="editors__aside">
        <AppAsideNav/>
      </aside>
      <main class="editors__main">
        <AppTitledList :listTitle="$t('editors.WORDING_EDITORS_CURRENT_GUESTEDITOR')">
          <ul class="editors-list-container">
            <EditorsIntro class="editors-intro-main" v-for="customEditor in customEditors" :key="customEditor.id" :editor="customEditor"/>
          </ul>
        </AppTitledList>
        <ul class="editors__list-aside">
          <EditorsIntro class="editors-intro-aside" v-for="member in asideListMembers" :key="member.id" :editor="member" :trimDescription="true"/>
        </ul>
      </main>
    </div>
  </div>
</template>

<script>
import { ROLE_MAP, } from '../constants'
import AppAsideNav from '../components/AppAsideNav.vue'
import AppTitledList from '../components/AppTitledList.vue'
import EditorsIntro from '../components/editors/EditorsIntro.vue'
import _ from 'lodash'

// const debug = require('debug')('CLIENT:Editors')
const getMembersPublic = (store, params) => {
  return store.dispatch('GET_PUBLIC_MEMBERS', {
    params: params,
  })
}
const fetchFollowing = (store, params) => {
  if (params.subject) {
    return store.dispatch('GET_FOLLOWING_BY_USER', {
      subject: params.subject,
      resource: params.resource,
    })
  } else {
    return store.dispatch('GET_FOLLOWING_BY_RESOURCE', {
      resource: params.resource,
      ids: params.ids,
    })
  }
}

export default {
  name: 'Editors',
  // Uncomment this when v1.0 is released
  // asyncData ({ store, i18n, }) {
  //   const targ_key = _.find(ROLE_MAP, { value: i18n.t('editors.WORDING_EDITORS_GUESTEDITOR'), }).key
  //   return getMembersPublic(store, {
  //     role: targ_key,
  //   })
  // },
  components: {
    AppAsideNav,
    AppTitledList,
    EditorsIntro,
  },
  data () {
    return {
      asideListRoleValue: this.$t('editors.WORDING_EDITORS_GUESTEDITOR'),
    }
  },
  computed: {
    customEditors () {
      return _.get(this.$store, 'state.customEditors.items', [])
    },
    asideListMembers () {
      return _.get(this.$store, `state.publicMembers[${this.asideListRoleValue}].items`, [])
    },
  },
  beforeMount () {
    // Beta version code
    const targ_key = _.find(ROLE_MAP, { value: this.$t('editors.WORDING_EDITORS_GUESTEDITOR'), }).key
    Promise.all([
      getMembersPublic(this.$store, {
        role: targ_key,
      }),
      getMembersPublic(this.$store, {
        custom_editor: true,
      }),
    ]).then(() => {
      if (this.$store.state.isLoggedIn) {
        const customEditorsIds = this.$store.state.customEditors.items.map(editor => editor.id)
        const asideListMembersIds = this.$store.state.publicMembers[this.asideListRoleValue].items.map(member => member.id)
        const ids = _.uniq(_.concat(customEditorsIds, asideListMembersIds))
        fetchFollowing(this.$store, {
          resource: 'member',
          ids: ids,
        })
      }
    })
    // Uncomment this when v1.0 is released
    // Promise.all([
    //   getMembersPublic(this.$store, {
    //     custom_editor: true,
    //   }),
    // ]).then(() => {
    //   if (this.$store.state.isLoggedIn) {
    //     const customEditorsIds = this.$store.state.customEditors.items.map(editor => editor.id)
    //     const asideListMembersIds = this.$store.state.publicMembers[this.asideListRoleValue].items.map(member => member.id)
    //     const ids = _.uniq(_.concat(customEditorsIds, asideListMembersIds))
    //     fetchFollowing(this.$store, {
    //       resource: 'member',
    //       ids: ids,
    //     })
    //   }
    // })
  },
}
</script>

<style lang="stylus" scoped>
.editors
  background-color #e6e6e6
  min-height 100vh
  &__container
    max-width 1200px
    margin auto
    padding 60px 0
    display flex
  &__aside
    width 75px
    height 100%
    position sticky
    // position fixed
    top 60px
    z-index 999
  &__main
    flex 1
    margin-left 40px
    margin-right 40px
    display flex
    justify-content flex-start
    align-items flex-start
  &__list-aside
    background-color white
    list-style none
    padding 16px 0
    margin 0
    margin-left 35px

.editors-list-container
  margin 0
  padding 0
.editors-intro-main
  width calc(650px - 20px - 20px)
  margin 0 20px
  padding 14px 0 10px 0
.editors-intro-aside
  width calc(355px - 15px - 15px)
  margin 0 15px
  padding 10px 0
  &:nth-child(1)
    padding-top 0
</style>


