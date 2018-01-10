<template>
  <section class="postPanelEdit">
    <input v-model="title" type="text" class="postPanelEdit__title" placeholder="輸入標題">
    <text-editor :contentEdit="content" :needReset="resetToggle" v-on:updateContent="$_postPanelEdit_updateContent"></text-editor>
    <div class="postPanelEdit__input postPanelEdit__link">
      <label for="">新聞連結：</label>
      <input v-model="link" type="url">
    </div>
    <div v-if="$can('editPostOg')" class="postPanelEdit__input postPanelEdit--publishDate">
      <label for="">發佈日期：</label>
      <no-ssr>
        <datepicker v-model="date" :format="dateFormat" :input-class="'datepicker__input'" :language="'zh'"></datepicker>
      </no-ssr>
    </div>
    <div v-if="$can('editPostOg')" class="postPanelEdit__input">
      <label for="">分享標題：</label>
      <input v-model="ogTitle" type="text">
    </div>
    <div v-if="$can('editPostOg')" class="postPanelEdit__input">
      <label for="">分享說明：</label>
      <input v-model="ogDescription" type="text">
    </div>
    <div v-if="$can('editPostOg')" class="postPanelEdit__input">
      <label for="">分享縮圖：</label>
      <input v-model="ogImage" type="text" readonly>
      <button class="postPanelEdit__btn--img" @click="$_postPanelEdit_uploadImage"><img src="/public/icons/upload.png" alt="上傳"></button>
      <button class="postPanelEdit__btn--img" @click="$_postPanelEdit_cleanOgImage"><img src="/public/icons/delete.png" alt="刪除"></button>
    </div>
    <div v-show="ogImage && $can('editPostOg')" class="postPanelEdit__ogImg">
      <img :src="ogImage" :alt="ogTitle">
    </div>
    <div :class="{ advanced: $can('publishPost') }" class="postPanelEdit__submit">
      <div class="postPanelEdit__btn draft" @click="$_postPanelEdit_submit()">存成草稿</div>
      <div class="postPanelEdit__btn submit" @click="$_postPanelEdit_submit(2)">提交</div>
      <div v-if="$can('publishPost')" class="postPanelEdit__btn" @click="$_postPanelEdit_submit(1)">發佈</div>
    </div>
  </section>
</template>
<script>
  import _ from 'lodash'
  import Datepicker from 'vuejs-datepicker'
  import TextEditor from './TextEditor.vue'
  import NoSSR from 'vue-no-ssr'
  
  const addPost = (store, params) => {
    return store.dispatch('ADD_POST', { params })
  }

  const updatePost = (store, params) => {
    return store.dispatch('UPDATE_POST', { params })
  }

  const uploadImage = (store, file) => {
    return store.dispatch('UPLOAD_IMAGE', { file })
  }

  export default {
    name: 'PostPanelEdit',
    components: {
      'text-editor': TextEditor,
      'datepicker': Datepicker,
      'no-ssr': NoSSR
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
        default: false
      }
    },
    data () {
      return {
        content: '',
        date: '',
        dateFormat: 'yyyy/MM/d',
        link: '',
        ogDescription: '',
        ogImage: '',
        ogTitle: '',
        resetToggle: true,
        title: ''
      }
    },
    computed: {
      isEmpty () {
        return _.isEmpty(_.trim(this.link)) && _.isEmpty(_.trim(this.title)) && _.isEmpty(_.trim(_.replace(this.content, /<[^>]*>/g, '')))
      },
      postActive () {
        return _.get(this.post, [ 'active' ])
      }
    },
    watch: {
      post (val) {
        this.content = _.get(val, [ 'content' ])
        this.date = _.get(val, [ 'publishedAt' ])
        this.link = _.get(val, [ 'link' ])
        this.title = _.get(val, [ 'title' ])
        this.ogDescription = _.get(val, [ 'ogDescription' ])
        this.ogImage = _.get(val, [ 'ogImage' ])
        this.ogTitle = _.get(val, [ 'ogTitle' ])
      },
      showLightBox (val) {
        if (!val) {
          if (!this.isEmpty) {
            this.$_postPanelEdit_submit(this.postActive)
          }
        }
      }
    },
    mounted () {},
    methods: {
      $_postPanelEdit_cleanOgImage () {
        this.ogImage = ''
      },
      $_postPanelEdit_resetContent () {
        this.content = ''
        this.date = ''
        this.link = ''
        this.ogDescription = ''
        this.ogImage = ''
        this.ogTitle = ''
        this.title = ''
        this.resetToggle = !this.resetToggle
      },
      $_postPanelEdit_submit (status = 3) {
        const params = {}
        params.active = status
        params.author = _.get(this.$store.state, [ 'profile', 'id' ])
        params.content = this.content
        params.link = this.link
        params.og_description = this.ogDescription
        params.og_image = this.ogImage
        params.og_title = this.ogTitle || this.title
        params.title = this.title
        params.updated_by = _.get(this.$store.state, [ 'profile', 'id' ])

        if (Date.parse(this.date)) {
          params.published_at = this.date
        }

        if (this.status === 'add') {
          addPost(this.$store, params)
            .then(() => {
              this.$_postPanelEdit_resetContent()
              this.$emit('closeLightBox')
              this.$emit('updatePostList')
            })
        }
        if (this.status === 'edit') {
          params.id = _.get(this.post, [ 'id' ])
          updatePost(this.$store, params)
            .then(() => {
              this.$_postPanelEdit_resetContent()
              this.$emit('closeLightBox')
              this.$emit('updatePostList')
            })
        }
      },
      $_postPanelEdit_updateContent (content) {
        this.content = content
      },
      $_postPanelEdit_uploadImage () {
        const input = document.createElement('input')
        input.setAttribute('type', 'file')
        input.setAttribute('accept', 'image/*')
        input.click()
        input.onchange = () => {
          const file = input.files[0]
          if (/^image\//.test(file.type)) {
            const fd = new FormData()
            fd.append('image', file)
            uploadImage(this.$store, fd)
              .then((res) => {
                this.ogImage = res.body.url
              })
              .catch((err) => {
                console.log(err)
              })
          }
        }
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
  &__input
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
    button
      width 25px
      height 25px
      img
        width 100%
        height auto
  &__ogImg
    padding-left 80px
    margin-top 10px
    img
      width 180px
      height auto
  &--publishDate
    margin-top 26px
    .vdp-datepicker
      flex 1
      
  &__submit
    display flex
    justify-content space-between
    width 100%
    margin-top 20px
    &.advanced
      .postPanelEdit__btn
        width 210px
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
      background-color #808080
    &--img
      padding 0
      margin 0 5px
      background none
      border none
      cursor pointer
      outline none
      user-select none
      &:first-of-type
        margin-left 10px

</style>