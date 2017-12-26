<template>
  <div class="admin">
    <app-header :section="section"></app-header>
    <About :profile="profile"></About>
    <div class="management-items"></div>
    <MembersPanel></MembersPanel>
  </div>
</template>
<script>
  import _ from 'lodash'
  import About from '../components/About.vue'
  import Header from '../components/Header.vue'
  import MembersPanel from '../components/admin/MembersPanel.vue'

  const SECTIONS_DEFAULT = {
    'chief-editor-talk': '總編評論',
    'celebrity-talk': '名人聊新聞',
    'hot-talk': '熱門評論',
    'chief-editor-list': '總編列表',
    'projects': '新聞專題'
  }

  export default {
    components: {
      'app-header': Header,
      About,
      MembersPanel
    },
    computed: {
      profile () {
        return _.get(this.$store, [ 'state', 'profile' ], {})
      },
      section () {
        return SECTIONS_DEFAULT
      }
    },
    name: 'admin-page',
    methods: {},
    mounted () {}
  }
</script>
<style lang="stylus" scoped>
  .admin
    width 100%
</style>