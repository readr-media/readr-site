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
    </div>
  </div>
</template>

<script>
import { ROLE_MAP, } from '../constants'
import AppTitledList from '../components/AppTitledList.vue'
import EditorsIntroListItem from '../components/editors/EditorsIntroListItem.vue'
import { isScrollBarReachBottom, } from 'src/util/comm'
import { get, find, uniqBy, } from 'lodash'

// const debug = require('debug')('CLIENT:Editors')

const DEFAULT_MAX_RESULT_INIT = 20
const DEFAULT_PAGE_INIT = 1
const DEFAULT_MAX_RESULT_LOADMORE = 10
const DEFAULT_PAGE_LOADMORE = 3

const getMembersPublic = (store, params) => {
  return store.dispatch('GET_PUBLIC_MEMBERS', {
    params: params,
  })
}

export default {
  name: 'Editors',
  asyncData ({ store, i18n, }) {
    const roleNum = find(ROLE_MAP, { value: i18n.t('editors.WORDING_EDITORS_GUESTEDITOR'), }).key
    return Promise.all([
      getMembersPublic(store, {
        role: roleNum,
        max_result: DEFAULT_MAX_RESULT_INIT,
        page: DEFAULT_PAGE_INIT,
      }),
      getMembersPublic(store, {
        custom_editor: true,
      }),
    ])
  },
  metaInfo () {
    return {
      description: this.$i18n ? this.$t('OG.DESCRIPTION') : 'Readr',
      ogTitle: this.$i18n ? this.$t('OG.GUESTEDITORS') : 'Readr',
      title: this.$i18n ? this.$t('OG.GUESTEDITORS') : 'Readr',
      metaUrl: this.$route.path,
    }
  },  
  components: {
    AppTitledList,
    EditorsIntroListItem,
  },
  watch: {
    isReachBottom () {
      if (this.isReachBottom && this.shouldLoadmore) {
        this.loadmoreEditors()
      }
    },
  },
  data () {
    return {
      guestEditorRoleValue: this.$t('editors.WORDING_EDITORS_GUESTEDITOR'),
      isReachBottom: false,
      currentPage: DEFAULT_PAGE_LOADMORE,
      shouldLoadmore: true,
    }
  },
  computed: {
    customEditors () {
      return get(this.$store, 'state.customEditors.items', [])
    },
    guestEditors () {
      return uniqBy(get(this.$store, `state.publicMembers[${this.guestEditorRoleValue}].items`, []), 'id')
    },
  },
  methods: {
    scrollHandler () {
      this.isReachBottom = isScrollBarReachBottom()
    },
    loadmoreEditors () {
      const roleNum = find(ROLE_MAP, { value: this.$t('editors.WORDING_EDITORS_GUESTEDITOR'), }).key
      getMembersPublic(this.$store, {
        role: roleNum,
        max_result: DEFAULT_MAX_RESULT_LOADMORE,
        page: this.currentPage,
      })
      .then(({ body, }) => {
        this.shouldLoadmore = body.items.length >= DEFAULT_MAX_RESULT_LOADMORE
        if (this.shouldLoadmore) { this.currentPage += 1 }
      })
      .catch(error => {
        console.log(error)
        this.shouldLoadmore = false
      })
    },
  },
  mounted () {
    window.addEventListener('scroll', this.scrollHandler)
  },
  destroyed () {
    window.removeEventListener('scroll', this.scrollHandler)
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


