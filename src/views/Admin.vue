<template>
  <div class="admin">
    <app-header :section="section"></app-header>
    <About :profile="profile"></About>
    <div class="management-items"></div>
    <MembersPanel></MembersPanel>
  </div>
</template>
<script>
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
        return {
          name: 'Justin BB',
          role: 'admin',
          introduction: '先速不生間發，處水是車內可紅，這在心相日價得推會當術重而而地後，把人司小一活整資為，家身無就好空人算請著營種的變車商突：臉我安以可吃結出而技冷水新戰口都紀！通快低死事媽兩建子那與的畫語了係來站車外。'
        }
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