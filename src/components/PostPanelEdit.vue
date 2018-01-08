<template>
  <section class="postPanelEdit">
    <input v-model="title" type="text" class="postPanelEdit__title" placeholder="輸入標題">
    <app-editor :contentEdit="content" :needReset="resetToggle" v-on:updateContent="$_postPanelEdit_updateContent"></app-editor>
    <div class="postPanelEdit__link">
      <label for="">新聞連結：</label>
      <input v-model="link" type="url">
    </div>
    <div class="postPanelEdit__submit">
      <div class="postPanelEdit__btn draft" @click="$_postPanelEdit_submit">存成草稿</div>
      <div class="postPanelEdit__btn submit" @click="$_postPanelEdit_submit('pending')">提交</div>
    </div>
  </section>
</template>
<script>
  import _ from 'lodash'
  import Editor from './Editor.vue'
  
  const addPost = (store, params) => {
    return store.dispatch('ADD_POST', { params })
  }

  export default {
    name: 'PostPanelEdit',
    components: {
      'app-editor': Editor
    },
    props: {
      status: {
        type: String,
        default: 'add'
      },
      post: {
        type: Object,
        default: {}
      },
      showLightBox: {
        type: Boolean
      }
    },
    data () {
      return {
        content: '',
        link: '',
        resetToggle: true,
        title: ''
      }
    },
    computed: {
      isChange () {
        return !_.isEmpty(this.link.trim()) || !_.isEmpty(this.title.trim()) || !_.isEmpty(this.content.replace(/<[^>]*>/g, '').trim())
      }
    },
    watch: {
      post (val) {
        this.title = _.get(val, [ 'title' ])
        this.content = _.get(val, [ 'content' ])
        this.link = _.get(val, [ 'link' ])
      },
      showLightBox (val) {
        if (!val) {
          if (this.isChange) {
            this.$_postPanelEdit_submit()
          }
        }
      }
    },
    mounted () {},
    methods: {
      $_postPanelEdit_resetContent () {
        this.content = ''
        this.link = ''
        this.title = ''
        this.resetToggle = !this.resetToggle
      },
      $_postPanelEdit_submit (status = undefined) {
        const params = {}
        if (status === 'pending') {
          params.active = 2
        }
        params.author = _.get(this.$store.state, [ 'profile', 'id' ])
        params.updated_by = _.get(this.$store.state, [ 'profile', 'id' ])
        params.title = this.title
        params.content = this.content
        params.link = this.link
        if (this.status === 'add') {
          addPost(this.$store, params)
            .then(() => {
              this.$_postPanelEdit_resetContent()
              this.$emit('closeLightBox')
            })
        }
      },
      $_postPanelEdit_updateContent (content) {
        this.content = content
      }
    }
  }
</script>
<style lang="stylus" scoped>

.postPanelEdit
  width 900px
  padding 30px 100px
  > input 
    width 100%
    height 25px
  &__title
    padding-left 10px
    color #000
    font-size 18px
    font-weight 600
  &__link
    display flex
    width 100%
    margin-top 10px
    label
      line-height 25px
    input
      flex 1
      padding-left 10px
      width 440px
      height 25px
      color #808080
  &__submit
    display flex
    justify-content space-between
    width 100%
    margin-top 20px
  &__btn
    display inline-flex
    justify-content center
    align-items center
    width 340px
    height 30px
    margin 0
    font-size 14px
    font-weight 300
    border 1px solid #d3d3d3
    cursor pointer
    user-select none
    &.submit
      color #fff
      background-color #4280a2

</style>