<template>
  <section class="accountPanelArticle">
    <input v-model="title" type="text" class="accountPanelArticle__title">
    <app-editor></app-editor>
  </section>
</template>
<script>
  import Editor from './Editor.vue'
  
  export default {
    name: 'AccountPanelArticle',
    components: {
      'app-editor': Editor
    },
    data () {
      return {
        title: '輸入標題'
      }
    },
    mounted () {},
    methods: {}
  }
</script>
<style lang="stylus" scoped>
.accountPanelArticle
  display flex
  flex-direction column
  justify-content center
  align-items center
  width 700px
  height 400px
  margin 0 auto
  background-color #fff
  border 5px solid #d8ca21
  > input 
    width 550px
    height 25px
  &__title
    padding-left 10px
    color #000
    font-size 15px
    font-weight 600
</style>