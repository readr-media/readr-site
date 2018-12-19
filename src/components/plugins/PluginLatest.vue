<template>
  <div class="latest">
    <div class="latest__logo-wrapper logo-wrapper">
      <a :href="SITE_FULL" target="_blank">
        <img class="logo-wrapper__logo" src="/public/icons/readr-logo-dark.svg" alt="">
      </a>
    </div>
    <PluginLatestList
      class="latest__list"
      :title="$t('PLUGINS.CUSTOM_EDITORS')"
      :listItems="customEditors"
      :listItemImgSize="'square'"
    />
    <PluginLatestList
      class="latest__list"
      :title="$t('PLUGINS.LATEST_PROJECTS')"
      :listItems="publicProjects"
      :listItemImgSize="'rect'"
    />
  </div>
</template>

<script>
import { get, take, } from 'lodash'
import { mapState, } from 'vuex'
import { PROJECT_PUBLISH_STATUS, PROJECT_STATUS, } from '../../../api/config'
import { SITE_FULL, } from 'src/constants'
import PluginLatestList from 'src/components/plugins/PluginLatestList.vue'

const DEFAULT_PAGE = 1
const DEFAULT_SORT = 'project_order,-updated_at'
const MAXRESULT = 2
const fetchProjectsList = (store, {
  max_result = MAXRESULT,
  page = DEFAULT_PAGE,
  sort = DEFAULT_SORT,
} = {}) => {
  return store.dispatch('GET_PUBLIC_PROJECTS', {
    params: {
      max_result: max_result,
      page: page,
      sort: sort,
      where: {
        status: [ PROJECT_STATUS.DONE, PROJECT_STATUS.WIP, ],
        publish_status: PROJECT_PUBLISH_STATUS.PUBLISHED,
      },
    },
  })
}

const getMembersPublic = (store, params) => {
  return store.dispatch('GET_PUBLIC_MEMBERS', {
    params: params,
  })
}

export default {
  components: {
    PluginLatestList,
  },
  data () {
    return {
      SITE_FULL,
      limitCustomEditors: 2,
      limitPublicProjects: 2,
    }
  },
  computed: {
    ...mapState({
      customEditors (state) {
        return take(get(state, [ 'customEditors', 'items', ], []), this.limitCustomEditors)
      },
      publicProjects (state) {
        return take(get(state, [ 'publicProjects', 'normal', ], []), this.limitPublicProjects)
      },
    }),
  },
  beforeMount () {
    getMembersPublic(this.$store, {
      custom_editor: true,
    })
    fetchProjectsList(this.$store)
  },
  mounted () {
    // JavaScript file that needs placing in the page contained within your iFrame
    require('iframe-resizer/js/iframeResizer.contentWindow.min.js')
  },
}
</script>

<style lang="stylus" scoped>
.latest
  border .5px solid #4a4a4a
  padding 8px 10px
  &__list
    & + &
      margin 14px 0 0 0

.logo-wrapper
  display flex
  justify-content center
  align-items center
  margin 0 0 10px 0
  &__logo
    height 50px
</style>