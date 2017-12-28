<template>
  <section class="postPanelEdit">
    <input v-model="title" type="text" class="postPanelEdit__title" placeholder="輸入標題">
    <app-editor v-on:updateContent="$_postPanelEdit_updateContent"></app-editor>
    <div class="postPanelEdit__control">
      <div class="postPanelEdit__link">
        <label for="">新聞連結：</label>
        <input v-model="link" type="url">
      </div>
      <div>
        <div class="postPanelEdit__btn draft" @click="$_postPanelEdit_submit">存成草稿</div>
        <div class="postPanelEdit__btn submit" @click="$_postPanelEdit_submit('pending')">提交</div>
      </div>
    </div>
  </section>
</template>
<script>
  import Editor from './Editor.vue'
  
  const addPost = (store, params) => {
    return store.dispatch('ADD_POST', { params })
  }

  export default {
    name: 'PostPanelEdit',
    components: {
      'app-editor': Editor
    },
    data () {
      return {
        content: '',
        link: '',
        title: ''
      }
    },
    mounted () {},
    methods: {
      $_postPanelEdit_submit (status = undefined) {
        const params = {}
        if (status === 'pending') {
          params.active = 2
        }
        // params.author =
        params.title = this.title
        params.content = this.content
        params.link = this.link
        addPost(this.$store, params)
          .then(() => {
            this.$emit('closeLightBox')
          })
      },
      $_postPanelEdit_updateContent (content) {
        this.content = content
      }
    }
  }
</script>
<style lang="stylus" scoped>

.postPanelEdit
  width 100%
  > input 
    width 100%
    height 25px
  &__title
    padding-left 10px
    color #000
    font-size 15px
    font-weight 600
  &__control
    display flex
    justify-content space-between
    width 550px
    margin-top 15px
    label
      line-height 25px
    input
      padding-left 10px
      width 250px
      height 25px
      color #808080
  &__btn
    display inline-flex
    justify-content center
    align-items center
    width 80px
    height 45px
    margin-left 10px
    font-weight 300
    border 1px solid #d3d3d3
    cursor pointer
    user-select none
    &.submit
      color #fff
      background-color #4280a2

</style>