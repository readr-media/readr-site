<template>
  <section class="postPanelEdit">
    <input v-model="post.title" type="text" class="postPanelEdit__title" :placeholder="wording.WORDING_POSTEDITOR_INPUT_TITLE">
    <text-editor
      :contentEdit="post.content"
      :needReset="resetToggle"
      :type="type"
      @updateContent="$_postPanelEdit_updateContent">
    </text-editor>
    <div class="postPanelEdit__input postPanelEdit__link">
      <label for="" v-text="`${wording.WORDING_POSTEDITOR_LINK}：`"></label>
      <input v-model="post.link" type="url" @change="$_postPanelEdit_toggleMeta">
    </div>
    <div v-if="$can('editPostOg')" class="postPanelEdit__input postPanelEdit--publishDate">
      <label for="" v-text="`${wording.WORDING_POSTEDITOR_PUBLISH_DATE}：`"></label>
      <no-ssr>
        <datepicker
          v-model="post.date"
          :format="dateFormat"
          :input-class="'datepicker__input'"
          :language="'zh'">
        </datepicker>
      </no-ssr>
    </div>
    <div v-if="$can('editPostOg')" class="postPanelEdit__input">
      <label for="" v-text="`${wording.WORDING_POSTEDITOR_OG_TITLE}：`"></label>
      <input v-model="post.ogTitle" type="text">
    </div>
    <div v-if="$can('editPostOg')" class="postPanelEdit__input">
      <label for="" v-text="`${wording.WORDING_POSTEDITOR_OG_DESCRIPTION}：`"></label>
      <input v-model="post.ogDescription" type="text">
    </div>
    <div v-if="$can('editPostOg')" class="postPanelEdit__input">
      <label for="" v-text="`${wording.WORDING_POSTEDITOR_OG_IMAGE}：`"></label>
      <input v-model="post.ogImage" type="text" readonly>
      <button class="postPanelEdit__btn--img" @click="$_postPanelEdit_uploadImage">
        <img src="/public/icons/upload.png" :alt="wording.WORDING_POSTEDITOR_UPLOAD">
      </button>
      <button class="postPanelEdit__btn--img" @click="$_postPanelEdit_cleanOgImage">
        <img src="/public/icons/delete.png" :alt="wording.WORDING_POSTEDITOR_DELETE">
      </button>
    </div>
    <div v-show="post.ogImage && $can('editPostOg')" class="postPanelEdit__ogImg">
      <img :src="post.ogImage" :alt="post.ogTitle">
    </div>
    <div :class="[ (action === 'edit') ? 'advanced' : '' ]" class="postPanelEdit__submit">
      <button
        v-if="$can('deletePost') && (action === 'edit')"
        class="postPanelEdit__btn"
        :disabled="(action === 'add') && isEmpty"
        @click="$_postPanelEdit_delete"
        v-text="wording.WORDING_POSTEDITOR_DELETE">
      </button>
      <button
        class="postPanelEdit__btn"
        :disabled="(action === 'add') && isEmpty"
        @click="$_postPanelEdit_submit(config.active.draft)"
        v-text="wording.WORDING_POSTEDITOR_SAVE_DRAFT">
      </button>
      <button
        v-if="!$can('publishPost')"
        class="postPanelEdit__btn dark"
        :disabled="(action === 'add') && isEmpty"
        @click="$_postPanelEdit_submit(config.active.pending)"
        v-text="wording.WORDING_POSTEDITOR_SAVE_PENDING">
      </button>
      <button
        v-if="$can('publishPost')"
        class="postPanelEdit__btn dark"
        :disabled="(action === 'add') && isEmpty"
        @click="$_postPanelEdit_submit(config.active.active)"
        v-text="wording.WORDING_POSTEDITOR_PUBLISH">
      </button>
    </div>
  </section>
</template>
<script>
  import { 
    IMAGE_UPLOAD_MAX_SIZE,
    WORDING_POSTEDITOR_DELETE,
    WORDING_POSTEDITOR_INPUT_TITLE,
    WORDING_POSTEDITOR_LINK,
    WORDING_POSTEDITOR_OG_DESCRIPTION,
    WORDING_POSTEDITOR_OG_IMAGE,
    WORDING_POSTEDITOR_OG_TITLE,
    WORDING_POSTEDITOR_PUBLISH,
    WORDING_POSTEDITOR_PUBLISH_DATE,
    WORDING_POSTEDITOR_SAVE_DRAFT,
    WORDING_POSTEDITOR_SAVE_PENDING,
    WORDING_POSTEDITOR_UPLOAD
  } from '../constants'
  import { POST_ACTIVE } from '../../api/config'
  import _ from 'lodash'
  import AlertPanel from './AlertPanel.vue'
  import BaseLightBox from './BaseLightBox.vue'
  import Datepicker from 'vuejs-datepicker'
  import TextEditor from './TextEditor.vue'
  import NoSSR from 'vue-no-ssr'
  import validator from 'validator'
  
  const addPost = (store, params) => {
    return store.dispatch('ADD_POST', { params })
  }

  const getMeta = (store, url) => {
    return store.dispatch('GET_META', { url })
  }

  const updatePost = (store, params) => {
    return store.dispatch('UPDATE_POST', { params })
  }

  const uploadImage = (store, file) => {
    return store.dispatch('UPLOAD_IMAGE', { file, type: 'post' })
  }

  export default {
    name: 'PostPanel',
    components: {
      'alert-panel': AlertPanel,
      'base-light-box': BaseLightBox,
      'datepicker': Datepicker,
      'text-editor': TextEditor,
      'no-ssr': NoSSR
    },
    props: {
      action: {
        default: undefined
      },
      isCompleted: {
        default: false
      },
      post: {
        type: Object,
        default: {}
      },
      showLightBox: {
        default: false
      },
      type: {
        type: Number,
        required: true
      }
    },
    data () {
      return {
        active: undefined,
        config: {
          active: POST_ACTIVE
        },
        dateFormat: 'yyyy/MM/d',
        needFetchMeta: false,
        resetToggle: true,
        showAlert: false,
        wording: {
          WORDING_POSTEDITOR_DELETE,
          WORDING_POSTEDITOR_INPUT_TITLE,
          WORDING_POSTEDITOR_LINK,
          WORDING_POSTEDITOR_OG_DESCRIPTION,
          WORDING_POSTEDITOR_OG_IMAGE,
          WORDING_POSTEDITOR_OG_TITLE,
          WORDING_POSTEDITOR_PUBLISH,
          WORDING_POSTEDITOR_PUBLISH_DATE,
          WORDING_POSTEDITOR_SAVE_DRAFT,
          WORDING_POSTEDITOR_SAVE_PENDING,
          WORDING_POSTEDITOR_UPLOAD
        }
      }
    },
    computed: {
      isEmpty () {
        return _.isEmpty(_.trim(_.get(this.post, [ 'link' ], '')))
          && _.isEmpty(_.trim(_.get(this.post, [ 'title' ], '')))
          && _.isEmpty(_.trim(_.replace(_.get(this.post, [ 'content' ], ''), /<[^>]*>/g, '')))
      },
      postActive () {
        return _.get(this.post, [ 'active' ])
      },
      postId () {
        return _.get(this.post, [ 'id' ])
      }
    },
    watch: {
      showAlert (val) {
        if (!val) {
          this.$emit('closeLightBox')
        }
      },
      showLightBox (val) {
        if (!val) {
          if (!this.isEmpty && !this.isCompleted) {
            this.$_postPanelEdit_submit(this.postActive)
          }
        }
      }
    },
    mounted () {},
    methods: {
      $_postPanelEdit_cleanOgImage () {
        this.post.ogImage = ''
      },
      $_postPanelEdit_delete () {
        this.$emit('deletePost', this.postId)
      },
      $_postPanelEdit_resetContent () {
        this.resetToggle = !this.resetToggle
      },
      $_postPanelEdit_submit (active = POST_ACTIVE.DRAFT) {
        const params = {}
        params.active = active
        params.link_title = ''
        params.link_description = ''
        params.link_image = ''
        params.content = _.get(this.post, [ 'content' ]) || ''
        params.link = _.get(this.post, [ 'link' ]) || ''
        
        params.og_description = _.get(this.post, [ 'ogDescription' ]) || ''
        params.og_image = _.get(this.post, [ 'ogImage' ]) || ''
        params.og_title = _.get(this.post, [ 'ogTitle' ]) || _.get(this.post, [ 'title' ]) || ''
        params.title = _.get(this.post, [ 'title' ]) || ''
        params.updated_by = _.get(this.$store.state, [ 'profile', 'id' ])
        
        this.active = active

        if (Date.parse(_.get(this.post, [ 'date' ]))) {
          params.published_at = _.get(this.post, [ 'date' ])
        }

        if (this.needFetchMeta) {
          const link = _.get(this.post, [ 'link' ])
          if (validator.isURL(link, { protocols: [ 'http','https' ] })) {
            getMeta(this.$store, link)
              .then((res) => {
                params.link_name = _.truncate(_.get(res, [ 'body', 'openGraph', 'siteName' ]), { 'length': 80 })
                params.link_title = _.get(res, [ 'body', 'openGraph', 'title' ])
                params.link_description = _.get(res, [ 'body', 'openGraph', 'description' ])
                params.link_image = _.get(res, [ 'body', 'openGraph', 'image', 'url' ])
              })
              .then(() => {
                if (this.action === 'add') {
                  params.author = _.get(this.$store.state, [ 'profile', 'id' ])
                  params.type = this.type
                  if (this.active === POST_ACTIVE.ACTIVE) {
                    this.$emit('showAlert', true, active, false)
                  } else {
                    addPost(this.$store, params)
                      .then(() => {
                        this.$emit('showAlert', true, active, true)
                      })
                      .catch((err) => console.error(err))
                  }
                } else if (this.action === 'edit') {
                  params.id = _.get(this.post, [ 'id' ])
                  params.author = _.get(this.post, [ 'author', 'id' ])
                  if (this.active === POST_ACTIVE.ACTIVE) {
                    this.$emit('showAlert', true, active, false)
                  }
                  if (this.active === POST_ACTIVE.PENDING || this.active === POST_ACTIVE.DRAFT) {
                    updatePost(this.$store, params)
                      .then(() => {
                        this.$emit('showAlert', true, active, true)
                      })
                      .catch((err) => console.error(err))
                  }
                }
              })
              .catch(err => console.error('err', err))
          }
          this.needFetchMeta = false
        } else {
          if (this.action === 'add') {
            params.author = _.get(this.$store.state, [ 'profile', 'id' ])
            params.type = this.type
            if (this.active === POST_ACTIVE.ACTIVE) {
              this.$emit('showAlert', true, active, false)
            } else {
              addPost(this.$store, params)
                .then(() => {
                  this.$emit('showAlert', true, active, true)
                })
                .catch((err) => console.error(err))
            }
          } else if (this.action === 'edit') {
            params.id = _.get(this.post, [ 'id' ])
            params.author = _.get(this.post, [ 'author', 'id' ])
            if (this.active === POST_ACTIVE.ACTIVE) {
              this.$emit('showAlert', true, active, false)
            }
            if (this.active === POST_ACTIVE.PENDING || this.active === POST_ACTIVE.DRAFT) {
              updatePost(this.$store, params)
                .then(() => {
                  this.$emit('showAlert', true, active, true)
                })
                .catch((err) => console.error(err))
            }
          }
        }
      },
      $_postPanelEdit_toggleMeta () {
        this.needFetchMeta = true
      },
      $_postPanelEdit_updateContent (content) {
        this.post.content = content
      },
      $_postPanelEdit_uploadImage () {
        const input = document.createElement('input')
        input.setAttribute('type', 'file')
        input.setAttribute('accept', 'image/*')
        input.click()
        input.onchange = () => {
          const file = input.files[0]
          if (/^image\//.test(file.type) && file.size <= IMAGE_UPLOAD_MAX_SIZE) {
            const fd = new FormData()
            fd.append('image', file)
            uploadImage(this.$store, fd)
              .then((res) => {
                this.ogImage = res.body.url
              })
              .catch((err) => {
                console.error(err)
              })
          }
        }
      }
    }
  }
</script>
<style lang="stylus" scoped>

.postPanelEdit
  display flex
  flex-direction column
  width 90%
  height 100%
  margin 0 auto
  padding 55px 0 35px
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
        width calc((100% - 20px) / 3)
  &__btn
    display inline-flex
    justify-content center
    align-items center
    width calc((100% - 20px) / 2)
    height 25px
    margin 0
    font-size 14px
    font-weight 300
    border 1px solid #d3d3d3
    user-select none
    &.dark
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

.alert
  width 325px
  color #000
  font-size 15px
  background #fff
  box-shadow: 1px 1px 2.5px 0 rgba(0, 0, 0, 0.5)
  > p
    margin .5em 25px
  &__control
    display flex
    justify-content space-between
    margin-top 30px
  &__title
    display block
    margin 15px 25px 0
    color #4280a2
  &__btn
    flex 1
    height 30px
    background transparent
    border .5px solid #d3d3d3
    border-collapse collapse
    outline none
    &:first-of-type
      border-right none

@media (min-width 950px)
  .postPanelEdit
    width 900px
    padding 30px 100px
    &__submit
      &.advanced
        .postPanelEdit__btn
          width 210px
    &__btn
      width 340px
      height 30px
</style>