<template>
  <PublicPage :pageTitle="pageTitle">
    <SeriesList :fetchProjectsList="fetchProjectsList"></SeriesList>
  </PublicPage>
</template>
<script>
import PublicPage from 'src/components/layout/PublicPage.vue'
import SeriesList from 'src/components/SeriesList.vue'
import { PROJECT_PUBLISH_STATUS, PROJECT_STATUS, } from '../../api/config'

const DEFAULT_PAGE = 1
const DEFAULT_SORT = 'project_order,-updated_at'
const MAXRESULT = 9
// const debug = require('debug')('CLIENT:PublicProjectList')
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

export default {
  name: 'PublicProjectList',
  asyncData ({ store, }) {
    return fetchProjectsList(store)
  },
  metaInfo () {
    return {
      description: this.$i18n ? this.$t('OG.DESCRIPTION') : 'Readr',
      ogTitle: this.$i18n ? this.$t('OG.PROJECT_LIST') : 'Readr',
      title: this.$i18n ? this.$t('OG.PROJECT_LIST') : 'Readr',
      metaUrl: this.$route.path,
    }
  },  
  components: {
    PublicPage,
    SeriesList,
  },
  computed: {},
  data () {
    return {
      pageTitle: this.$t('SECTIONS.SERIES_LIST'),
    }
  },
  methods: {
    fetchProjectsList,
  },
  beforeMount () {},
}

</script>
