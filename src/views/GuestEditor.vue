<template>
  <div class="guestEditor">
    <app-header :sections="sections"></app-header>
    <main class="guestEditor__main">
      <section class="guestEditor__manager">
        <button class="guestEditor__btn" @click="$_guestEditor_lightBoxHandler(true)">新增評論</button>
      </section>
      <base-light-box :showLightBox.sync="showLightBox">
        <post-panel-edit slot="postPanelEdit" v-on:closeLightBox="$_guestEditor_lightBoxHandler(false)"></post-panel-edit>
      </base-light-box>
    </main>
  </div>
</template>
<script>
  import BaseLightBox from '../components/BaseLightBox.vue'
  import Header from '../components/Header.vue'
  import PostPanelEdit from '../components/PostPanelEdit.vue'

  const SECTIONS_DEFAULT = {
    'chief-editor-talk': '總編評論',
    'celebrity-talk': '名人聊新聞',
    'hot-talk': '熱門評論',
    'chief-editor-list': '總編列表',
    'projects': '新聞專題'
  }

  export default {
    name: 'GuestEditor',
    components: {
      'app-header': Header,
      'base-light-box': BaseLightBox,
      'post-panel-edit': PostPanelEdit
    },
    computed: {
      sections () {
        return SECTIONS_DEFAULT
      }
    },
    data () {
      return {
        showLightBox: false
      }
    },
    mounted () {},
    methods: {
      $_guestEditor_lightBoxHandler (value) {
        this.showLightBox = value
      }
    }
  }
</script>
<style lang="stylus" scoped>
.guestEditor
  &__main
    width 720px
    max-width 720px
    margin 22px auto 0
  &__btn
    padding .2em 0
    margin 0 .5em
    color #4280a2
    font-size 15px
    font-weight 600
    background transparent
    border none
    border-bottom 1px solid #4280a2
    cursor pointer
  &__manager
    width 100%
    padding 22px 84px 33px
    border 2px solid #d8ca21
</style>