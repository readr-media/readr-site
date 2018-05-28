<template>
  <div class="editors">
    <div class="editors__top">
      <AppTitledList class="custom-editors" :listTitle="$t('editors.WORDING_EDITORS_CURRENT_GUESTEDITOR')">
        <ul class="custom-editors__list">
          <EditorsIntroListItem
            class="custom-editors__list-item"
            :styleModifier="'large'"
            v-for="member in customEditors"
            :key="member.id"
            :editor="member"
          />
        </ul>
      </AppTitledList>
    </div>
    <div class="editors__bottom">
      <AppTitledList class="guest-editors" :listTitle="$t('editors.WORDING_EDITORS_LIST')">
        <ul class="guest-editors__list">
          <EditorsIntroListItem
            class="guest-editors__list-item"
            v-for="member in guestEditors"
            :key="member.id"
            :editor="member"
          />
        </ul>
      </AppTitledList>
      <!-- reports listing here -->
    </div>
  </div>
</template>

<script>
import { ROLE_MAP, } from '../constants'
import AppTitledList from '../components/AppTitledList.vue'
import EditorsIntroListItem from '../components/editors/EditorsIntroListItem.vue'
import { get, find, uniq, concat, } from 'lodash'

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
  //   const targ_key = find(ROLE_MAP, { value: i18n.t('editors.WORDING_EDITORS_GUESTEDITOR'), }).key
  //   return getMembersPublic(store, {
  //     role: targ_key,
  //   })
  // },
  components: {
    AppTitledList,
    EditorsIntroListItem,
  },
  data () {
    return {
      guestEditorRoleValue: this.$t('editors.WORDING_EDITORS_GUESTEDITOR'),
    }
  },
  computed: {
    customEditors () {
      return get(this.$store, 'state.customEditors.items', [])
    },
    guestEditors () {
      return get(this.$store, `state.publicMembers[${this.guestEditorRoleValue}].items`, [])
    },
  },
  beforeMount () {
    // Beta version code
    const roleNum = find(ROLE_MAP, { value: this.guestEditorRoleValue, }).key
    Promise.all([
      getMembersPublic(this.$store, {
        role: roleNum,
      }),
      getMembersPublic(this.$store, {
        custom_editor: true,
      }),
    ]).then(() => {
      if (this.$store.state.isLoggedIn) {
        const customEditorsIds = this.customEditors.map(editor => editor.id)
        const guestEditorsIds = this.guestEditors.map(member => member.id)
        const ids = uniq(concat(customEditorsIds, guestEditorsIds))
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
    //     const guestEditorsIds = this.$store.state.publicMembers[this.guestEditorRoleValue].items.map(member => member.id)
    //     const ids = uniq(concat(customEditorsIds, guestEditorsIds))
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
  &__bottom
    display flex
    justify-content flex-start
    align-items flex-start
    margin 29.5px 0 0 0

.custom-editors
  &__list
    margin 0
    padding 16.5px 0
    display flex
  &__list-item
    width 520px
    padding 0 50px 0 20px

.guest-editors
  &__list
    margin 0
    padding 0
  &__list-item
    width calc(650px - 20px - 20px)
    margin 0 20px
    padding 14px 0 10px 0
</style>


