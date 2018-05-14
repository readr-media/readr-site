<template>
  <section class="post-panel">
    <div class="post-panel-container">
      <div class="input input--title" :class="{ 'input--error': includes(errors, 'title') }">
        <input v-model="post.title" type="text" :disabled="loading" :placeholder="$t('POST_PANEL.TITLE_PLACEHOLDER')">
        <p v-if="includes(errors, 'title')" v-text="`${$t('POST_PANEL.VALIDATION_MSG')}${$t('POST_PANEL.TITLE')}`"></p>
      </div>
      <quill-editor-review
        v-if="isReview"
        :class="{ 'input--error': includes(errors, 'content') }"
        :content="post.content"
        :disabled="loading"
        @updateContent="$_postPanel_updateContent">
      </quill-editor-review>
      <quill-editor-news
        v-if="!isReview"
        :class="{ 'input--error': includes(errors, 'content') }"
        :content="post.content"
        :disabled="loading"
        @updateContent="$_postPanel_updateContent">
      </quill-editor-news>
      <p v-if="includes(errors, 'content')" v-text="`${$t('POST_PANEL.VALIDATION_MSG')}${$t('POST_PANEL.CONTENT')}`"></p>
      <div class="input input--link" :class="{ 'input--error': includes(errors, 'link') }">
        <label v-text="`${$t('POST_PANEL.NEWS')}${$t('POST_PANEL.LINK')}：`"></label>
        <input v-model="post.link" type="url" :disabled="loading" @change="$_postPanel_linkChanged">
        <p v-if="includes(errors, 'link')" v-text="`${$t('POST_PANEL.VALIDATION_MSG')}${$t('POST_PANEL.NEWS')}${$t('POST_PANEL.LINK')}`"></p>
      </div>
      <div v-if="$can('editPostOg') && (action === 'edit')" class="post-panel__link-meta">
        <p :class="{ active: post.linkTitle }">Title</p>
        <p :class="{ active: post.linkDescription }">Description</p>
        <p :class="{ active: post.linkImage }">Image</p>
        <p :class="{ active: post.linkName }">Site Name</p>
      </div>
      <div v-if="$can('editPostOg')" class="input input--date">
        <label v-text="`${$t('POST_PANEL.PUBLISH_DATE')}：`"></label>
        <datetime-picker
          v-model="publishedDate"
          input-format="YYYY/MM/DD HH:mm"
          :disabled="loading"
          :placeholder="`${$t('POST_PANEL.DATETIME_PLACEHOLDER')}`"
          type="datetime">
        </datetime-picker>
      </div>
      <div v-if="$can('editPostOg')" class="input input--tag">
        <label v-text="`${$t('POST_PANEL.TAG')}：`"></label>
        <post-panel-tag
          :disabled="loading"
          :tagsNeedAdd="tagsNeedAdd"
          :tagsSelected="tagsSelected"
          :tagsSelectedID="tagsSelectedID"
          @addToNeedAdd="$_postPanel_addTagToNeedAdd"
          @addToSelected="$_postPanel_addTagToSelected"
          @deselectNewTag="$_postPanel_deselectNewTag"
          @deselectTag="$_postPanel_deselectTag">
        </post-panel-tag>
      </div>
      <!-- <div v-if="$can('editPostOg')" class="input" :class="{ 'input--error': includes(errors, 'ogTitle') }">
        <label v-text="`${$t('POST_PANEL.OG_TITLE')}：`"></label>
        <input v-model="post.ogTitle" type="text" :disabled="loading">
        <p v-if="includes(errors, 'ogTitle')">請輸入分享標題</p>
      </div> -->
      <!-- <div v-if="$can('editPostOg')" class="input input--descr" :class="{ 'input--error': includes(errors, 'ogDescr') }">
        <label v-text="`${$t('POST_PANEL.OG_DESCRIPTION')}：`"></label>
        <textarea rows="3" :disabled="loading"></textarea>
        <p v-if="includes(errors, 'ogTitle')">請輸入分享說明</p>
      </div> -->
      <!-- <div v-if="$can('editPostOg')" class="input input--og-img">
        <label v-text="`${$t('POST_PANEL.OG_IMAGE')}：`"></label>
        <input v-model="post.ogImage" type="text" :disabled="loading" readonly>
        <button v-show="!loading" class="button button--img" :disabled="loading" @click="$_postPanel_addOgImage">
          <img src="/public/icons/upload.png" :alt="$t('POST_PANEL.UPLOAD')">
        </button>
        <button v-show="!loading" class="button button--img" :disabled="loading" @click="$_postPanel_deleteOgImage">
          <img src="/public/icons/delete.png" :alt="$t('POST_PANEL.DELETE')">
        </button>
        <input ref="uploadImg" class="input--hidden" type="file" accept="image/*" @change="$_postPanel_uploadImg">
      </div> -->
      <!-- <div v-if="post.ogImage && $can('editPostOg')" class="post-panel__og-img">
        <img :src="post.ogImage" :alt="post.ogTitle">
      </div> -->
      <div class="post-panel__action">
        <template v-if="isClientSide && !loading">
          <button
            v-if="$can('deletePost') && (action === 'edit') && (post.publishStatus !== config.publishStatus.PUBLISHED && post.publishStatus !== config.publishStatus.SCHEDULING)"
            class="button"
            @click="$_postPanel_showAlert(config.publishStatus.DELETED)"
            v-text="$t('POST_PANEL.DELETE')">
          </button>
          <button
            v-if="(action === 'edit') && $can('editPostOg') && (post.publishStatus !== config.publishStatus.DRAFT)"
            class="button"
            @click="$_postPanel_validation(config.publishStatus.DRAFT)"
            v-text="$t('POST_PANEL.RETURN_TO_DRAFT')">
          </button>
          <button
            v-if="$can('publishPost') && (action === 'edit') && (post.publishStatus === config.publishStatus.PUBLISHED || post.publishStatus === config.publishStatus.SCHEDULING) "
            class="button"
            @click="$_postPanel_validation(config.publishStatus.UNPUBLISHED)"
            v-text="$t('POST_PANEL.UNPUBLISH')">
          </button>
          <button
            v-if="(action === 'edit')"
            class="button"
            @click="$_postPanel_validation()"
            v-text="$t('POST_PANEL.SAVE')">
          </button>
          <button
            v-if="(action === 'add') && $can('addPost')"
            class="button"
            @click="$_postPanel_validation(config.publishStatus.DRAFT)"
            v-text="$t('POST_PANEL.SAVE_DRAFT')">
          </button>
          <button
            v-if="!$can('publishPost')"
            class="button"
            @click="$_postPanel_validation(config.publishStatus.PENDING)"
            v-text="$t('POST_PANEL.SAVE_PENDING')">
          </button>
          <button
            v-if="$can('publishPost') && (post.publishStatus !== config.publishStatus.PUBLISHED && post.publishStatus !== config.publishStatus.SCHEDULING)"
            class="button"
            @click="$_postPanel_validation(config.publishStatus.PUBLISHED)"
            v-text="$t('POST_PANEL.PUBLISH')">
          </button>
        </template>
        
        <p v-if="loading" v-text="$t('POST_PANEL.IN_SAVE')"></p>
      </div>
    </div>
    <base-light-box :isAlert="true" :showLightBox.sync="showAlert">
      <alert-panel
        :status="post.publish_status"
        :statusChanged="postStatusChanged"
        :isReturnToDraft="isReturnToDraft"
        :items="itemForAlert"
        :needConfirm="needConfirm"
        :showLightBox="showAlert"
        :type="alertType"
        @closeAlert="showAlert = false"
        @deletePosts="$_postPanel_deletePost"
        @publishPosts="$_postPanel_publish"
        @returnToDraftPosts="$_postPanel_updatePostConfirmed"
        @unpublishPosts="$_postPanel_updatePostConfirmed">
      </alert-panel>
    </base-light-box>
  </section>
</template>
<script>
  import { Datetime, } from 'vue-datetime'
  import { IMAGE_UPLOAD_MAX_SIZE, } from '../constants'
  import { POST_PUBLISH_STATUS, POST_TYPE, } from '../../api/config'
  import { find, get, identity, includes, map, mapKeys, pickBy, snakeCase, truncate, union, xor, } from 'lodash'
  import AlertPanel from './AlertPanel.vue'
  import BaseLightBox from './BaseLightBox.vue'
  import PostPanelTag from './PostPanelTag.vue'
  import QuillEditorNews from './QuillEditorNews.vue'
  import QuillEditorReview from './QuillEditorReview.vue'
  import validator from 'validator'

  const addPost = (store, params) => {
    return store.dispatch('ADD_POST', { params, })
  }

  const addTags = (store, text = '') => {
    return store.dispatch('ADD_TAGS', {
      params: {
        text: text,
        updated_by: get(store, [ 'state', 'profile', 'id', ]),
      },
    })
  }

  const deletePost = (store, id) => {
    return store.dispatch('DELETE_POST', { id: id, })
  }

  const getMeta = (store, url) => {
    return store.dispatch('GET_META', { url, })
  }

  const updatePost = (store, params) => {
    return store.dispatch('UPDATE_POST', { params, })
  }

  const uploadImage = (store, file) => {
    return store.dispatch('UPLOAD_IMAGE', { file, type: 'post', })
  }

  export default {
    name: 'PostPanel',
    components: {
      'alert-panel': AlertPanel,
      'base-light-box': BaseLightBox,
      'datetime-picker': Datetime,
      'post-panel-tag': PostPanelTag,
      'quill-editor-news': QuillEditorNews,
      'quill-editor-review': QuillEditorReview,
    },
    props: {
      action: {
        type: String,
        dafault: 'add',
      },
      editorType: {
        type: Number,
        required: true,
      },
      initialPost: {
        type: Object,
        default: () => {},
      },
    },
    data () {
      return {
        alertType: 'post',
        config: {
          publishStatus: POST_PUBLISH_STATUS,
        },
        errors: [],
        isReturnToDraft: false,
        linkChanged: false,
        loading: false,
        needConfirm: false,
        post: this.initialPost,
        postStatusChanged: false,
        publishedDate: '',
        showAlert: false,
        tagsNeedAdd: [],
        tagsSelected: [],
      }
    },
    computed: {
      itemForAlert () {
        return [ this.post, ]
      },
      isClientSide () {
        return get(this.$store, 'state.isClientSide', false)
      },
      isReview () {
        return this.editorType === POST_TYPE.REVIEW
      },
      tagsSelectedID () {
        return map(this.tagsSelected, tag => tag.id)
      },
    },
    watch: {
      initialPost () {
        this.post = this.initialPost
        this.publishedDate = get(this.post, [ 'publishedAt', ]) || ''
        this.alertType = 'post'
        this.linkChanged = false
        this.isReturnToDraft = false
        this.showAlert = false
        this.needConfirm = false
        this.postStatusChanged = false
        this.tagsSelected = []
        this.tagsNeedAdd = []
        const tags = get(this.post, [ 'tags', ]) || []
        tags.forEach((tag) => {
          tag.id = Number(tag.id)
          this.tagsSelected.push(tag)
        })
      },
      showAlert (value) {
        if (!value) {
          this.post = this.initialPost
          this.publishedDate = get(this.post, [ 'publishedAt', ]) || ''
          this.alertType = 'post'
          this.linkChanged = false
          this.isReturnToDraft = false
          this.needConfirm = false
          this.postStatusChanged = false
          this.tagsSelected = []
          this.tagsNeedAdd = []
          const tags = get(this.post, [ 'tags', ]) || []
          tags.forEach((tag) => {
            tag.id = Number(tag.id)
            this.tagsSelected.push(tag)
          })
          this.loading = false
        }
      },
    },
    methods: {
      $_postPanel_addOgImage () {
        this.$refs.uploadImg.click()
      },
      $_postPanel_addTagToNeedAdd (tag) {
        this.tagsNeedAdd.push(tag)
      },
      $_postPanel_addTagToSelected (tag) {
        this.tagsSelected.push(tag)
      },
      $_postPanel_deleteOgImage () {
        this.post.ogImage = ''
      },
      $_postPanel_deletePost () {
        deletePost(this.$store, this.post.id)
        .then(() => {
          this.needConfirm = false
          this.loading = false
          this.$emit('closeEditor')
          this.$emit('updateList', { needUpdateCount: true, })
        })
        .catch(() => {
          this.alertType = 'error'
          this.needConfirm = false
          this.showAlert = true
          this.loading = false
        })
      },
      $_postPanel_deselectNewTag (tag) {
        this.tagsNeedAdd = xor(this.tagsNeedAdd, [ tag, ])
      },
      $_postPanel_deselectTag (id) {
        const tag = [ find(this.tagsSelected, { id: id, }), ]
        this.tagsSelected = xor(this.tagsSelected, tag)
      },
      $_postPanel_linkChanged () {
        this.linkChanged = true
      },
      $_postPanel_publish () {
        if (this.action === 'add') {
          addPost(this.$store, this.post)
            .then(() => {
              this.needConfirm = false
              this.loading = false
              this.$emit('closeEditor')
              this.$emit('updateList', { needUpdateCount: true, })
            })
            .catch(() => {
              this.alertType = 'error'
              this.needConfirm = false
              this.showAlert = true
              this.loading = false
            })
        } else if (this.action === 'edit') {
          updatePost(this.$store, this.post)
            .then(() => {
                this.needConfirm = false
                this.loading = false
                this.$emit('closeEditor')
                this.$emit('updateList')
              })
              .catch(() => {
                this.alertType = 'error'
                this.needConfirm = false
                this.showAlert = true
                this.loading = false
              })
        }
      },
      $_postPanel_showAlert (publishStatus) {
        this.loading = true
        this.post.publish_status = publishStatus
        this.postStatusChanged = true
        this.needConfirm = true
        this.showAlert = true
      },
      $_postPanel_submit (publishStatus) {
        if (this.action === 'edit') {
          this.post = pickBy(mapKeys(this.post, (value, key) => snakeCase(key)), identity())
        }

        if (this.action === 'edit' && publishStatus === POST_PUBLISH_STATUS.DRAFT) {
          this.isReturnToDraft = true
        }

        this.post.publish_status = get(this.post, 'publish_status')

        if (publishStatus || publishStatus === POST_PUBLISH_STATUS.UNPUBLISHED) {
          this.postStatusChanged = true
          this.post.publish_status = publishStatus
        }

        this.post.updated_by = get(this.$store.state, 'profile.id')
        

        const promiseLink = new Promise((resolve) => {
          if (this.linkChanged) {
            let link = get(this.post, 'link')
            this.post.link_name = ''
            this.post.link_title = ''
            this.post.link_description = ''
            this.post.link_image = ''
            if (validator.isURL(link, { protocols: [ 'http','https', ], })) {
              if (link.match(/[\u3400-\u9FBF]/)) {
                link = encodeURI(link)
              }
              getMeta(this.$store, link)
                .then((res) => {
                  this.post.link_name = truncate(get(res, 'body.ogSiteName'), { 'length': 40, }) || ''
                  this.post.link_title = truncate(get(res, 'body.ogTitle'), { 'length': 200, }) || ''
                  this.post.link_description = truncate(get(res, 'body.ogDescription'), { 'length': 250, }) || ''
                  this.post.link_image = get(res, 'body.ogImage') || ''
                  resolve()
                })
            } else { 
              resolve()
            }
          } else {
            resolve()
          }
        })

        const promiseTagsNeedAdd = new Promise((resolve) => {
          if (this.tagsNeedAdd.length !== 0) {
            Promise.all(this.tagsNeedAdd.map(tag => addTags(this.$store, tag)))
            .then((value) => {
              const ids = map(value, t => get(t, 'body.tagId'))
              const unionTag = union(this.tagsSelectedID, ids)
              return resolve(unionTag)
            })
            .catch(() => resolve(this.tagsSelectedID))
          } else {
            resolve(this.tagsSelectedID)
          }
        })

        Promise.all([ promiseLink, promiseTagsNeedAdd, ])
        .then((value) => {
          const unionTag = value[1]
          const now = new Date(Date.now())

          if (unionTag && unionTag.length !== 0) {
            this.post.tags = unionTag
          }

          if (publishStatus === POST_PUBLISH_STATUS.PUBLISHED && !this.publishedDate) {
            this.post.published_at = now
          } else if (this.publishedDate) {
            this.post.published_at = new Date(this.publishedDate)
            const minComparedWithNow = (this.post.published_at.getTime() - now.getTime()) / 60000
            if (publishStatus === POST_PUBLISH_STATUS.PUBLISHED && minComparedWithNow > 1) {
              this.post.publish_status = POST_PUBLISH_STATUS.SCHEDULING
            }
          }

          if (this.action === 'add') {
            this.post.author = get(this.$store.state, 'profile.id')
            this.post.type = this.editorType
            if (this.post.publish_status === POST_PUBLISH_STATUS.SCHEDULING || this.post.publish_status === POST_PUBLISH_STATUS.PUBLISHED) {
              this.needConfirm = true
              this.showAlert = true
            } else {
              addPost(this.$store, this.post)
                .then(() => {
                  this.showAlert = true
                  this.loading = false
                  this.$emit('closeEditor')
                  this.$emit('updateList', { needUpdateCount: true, })
                })
                .catch(() => {
                  this.alertType = 'error'
                  this.needConfirm = false
                  this.showAlert = true
                  this.loading = false
                })
            }
          } else if (this.action === 'edit') {
            this.post.author = get(this.post, 'author.id')
            if (this.post.publish_status === POST_PUBLISH_STATUS.SCHEDULING ||
              this.post.publish_status === POST_PUBLISH_STATUS.PUBLISHED ||
              this.post.publish_status === POST_PUBLISH_STATUS.UNPUBLISHED ||
              (this.post.publish_status === POST_PUBLISH_STATUS.DRAFT && this.isReturnToDraft))
            {
              this.needConfirm = true
              this.showAlert = true
            } else {
              updatePost(this.$store, this.post)
                .then(() => {
                  this.showAlert = true
                  this.loading = false
                  this.$emit('closeEditor')
                  this.$emit('updateList')
                })
                .catch(() => {
                  this.alertType = 'error'
                  this.needConfirm = false
                  this.showAlert = true
                  this.loading = false
                })
            }
          }
        })
      },
      $_postPanel_updatePostConfirmed () {
        updatePost(this.$store, this.post)
          .then(() => {
            this.needConfirm = false
            this.loading = false
            this.$emit('closeEditor')
            this.$emit('updateList')
          })
          .catch(() => {
            this.alertType = 'error'
            this.needConfirm = false
            this.showAlert = true
            this.loading = false
          })
      },
      $_postPanel_updateContent (content) {
        this.$set(this.post, 'content', content)
      },
      $_postPanel_uploadImg () {
        const file = this.$refs.uploadImg.files[0]
        if (/^image\//.test(file.type) && file.size <= IMAGE_UPLOAD_MAX_SIZE) {
          const fd = new FormData()
          fd.append('image', file)
          uploadImage(this.$store, fd)
            .then((res) => {
              this.$set(this.post, 'ogImage', res.body.url)
            })
            .catch((err) => {
              console.error(err)
            })
        }
      },
      $_postPanel_validation (publishStatus) {
        this.errors = []
        this.loading = true
        if (!this.post.title) {
          this.errors.push('title')
        }

        if ((publishStatus === POST_PUBLISH_STATUS.PUBLISHED || publishStatus === POST_PUBLISH_STATUS.PENDING) && !this.post.content) {
          this.errors.push('content')
        }

        if (this.isReview && (publishStatus === POST_PUBLISH_STATUS.PUBLISHED || publishStatus === POST_PUBLISH_STATUS.PENDING) && !this.post.link) {
          this.errors.push('link')
        }

        if (this.errors.length === 0) {
          this.$_postPanel_submit(publishStatus)
        } else {
          this.loading = false
        }
      },
      includes,
    },
  }
</script>
<style lang="stylus" scoped>

.post-panel
  width 900px
  padding 30px 0 20px
  
  input
    position relative
    padding .2em .5em
    line-height 1
    outline none
    border 1px solid #d3d3d3
    transition background-color .5s linear
    &:disabled
      background-color rgba(0, 0, 0, .3)
    
  textarea
    padding .5em
    line-height 1.3
    min-height 80px
    border 1px solid #d3d3d3
    outline none
    transition background-color .5s linear
    &:disabled
      background-color rgba(0, 0, 0, .3)
  &-container
    max-width 715px
    max-height calc(100vh - 60px)
    margin 0 auto
    padding-right 15px
    overflow-y auto
    > p
      margin .2em 0
      color #ff0000
      font-size .75rem
      text-align right
  &__action
    display flex
    justify-content space-between
    margin-top 25px
    > p
      flex 1
      margin 0
      text-align center
  &__link-meta
    margin 0 0 25px
    text-align right
    p
      display inline-block
      min-width 60px
      margin 0
      color #d3d3d3
      text-align center
      font-size .75rem
      user-select none
      &.active
        color #000
    p + p
      margin 0 0 0 .5em
  &__og-img
    padding-left 80px
    margin-top 10px
    img
      width 180px
      height auto

.input
  display flex
  align-items center
  flex-wrap wrap
  width 100%
  input, textarea
    flex 1
  > p
    width 100%
    margin .2em 0
    color #ff0000
    font-size .75rem
    text-align right
    
  & + .input
    margin-top 10px
    &.input--date
      margin-top 25px
  &--title
    input
      font-size 1.125rem
      font-weight 600
  &--link
    margin 10px auto 5px
  &--date
    > div
      flex 1
    >>> input
      width 100%
      padding .2em .5em
      transition background-color .5s linear
      &:disabled
        background-color rgba(0, 0, 0, .3)
  &--descr
    align-items flex-start
    // input
    //   min-height 80px
  &--hidden
    display none
  &--error
    input
      border-color #ff0000
      background-color #ffe5e5
  

.button
  flex 1
  padding .2em 0
  background-color #fff
  border 1px solid #d3d3d3
  outline none
  & + .button
    margin-left 15px
  &.button--img
    flex 0 1 auto
    width 25px
    height 25px
    margin 0 0 0 10px
    padding 0
    border none
    img
      width 100%
      height auto
  
</style>