<template>
  <section class="postPanel">
    <input v-model="post.title" type="text" class="postPanel__title" :placeholder="wording.WORDING_POSTEDITOR_INPUT_TITLE">
    <text-editor
      :contentEdit="post.content"
      :type="postType"
      @updateContent="$_postPanel_updateContent">
    </text-editor>
    <div class="postPanel__input postPanel__link">
      <label for="" v-text="`${wording.WORDING_POSTEDITOR_LINK}：`"></label>
      <input v-model="post.link" type="url" @change="$_postPanel_metaChanged">
    </div>
    <div v-if="$can('editPostOg')" class="postPanel__input postPanel--publishDate">
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
    <div
      v-if="$can('editPostOg')"
      class="postPanel__input">
      <label for="" v-text="`${wording.WORDING_POSTEDITOR_TAG}：`"></label>
      <div class="postPanel__tags">
        <div class="postPanel__tags-selected">
          <template>
            <div v-for="t in tagsSelected" :key="`${t.id}-selected`" class="postPanel__tags-selected-item">
              <p v-text="t.text"></p>
              <button @click="$_postPanel_deleteTag(t.id)">Ｘ</button>
            </div>
          </template>
        </div>
        <div class="postPanel__tags-input">
          <input ref="tagsInput" v-model="tagInput" type="text" @blur="$_postPanel_closeTagList" @focus="$_postPanel_showTagList" @input="$_postPanel_getTags">
          <div ref="tagsList" class="postPanel__tags-list hidden">
            <button v-show="tags.length === 0" class="noResult" v-text="wording.WORDING_POSTEDITOR_NOT_FOUND"></button>
            <template>
              <button v-for="(t) in tags" :key="t.id" @mousedown="$_postPanel_addTag(t.id)" v-text="t.text"></button>
            </template>
          </div>
        </div>
      </div>
    </div>
    <div v-if="$can('editPostOg')" class="postPanel__input">
      <label for="" v-text="`${wording.WORDING_POSTEDITOR_OG_TITLE}：`"></label>
      <input v-model="post.ogTitle" type="text">
    </div>
    <div v-if="$can('editPostOg')" class="postPanel__input">
      <label for="" v-text="`${wording.WORDING_POSTEDITOR_OG_DESCRIPTION}：`"></label>
      <input v-model="post.ogDescription" type="text">
    </div>
    <div v-if="$can('editPostOg')" class="postPanel__input">
      <label for="" v-text="`${wording.WORDING_POSTEDITOR_OG_IMAGE}：`"></label>
      <input v-model="post.ogImage" type="text" readonly>
      <button class="postPanel__btn--img" @click="$_postPanel_addOgImage">
        <img src="/public/icons/upload.png" :alt="wording.WORDING_POSTEDITOR_UPLOAD">
      </button>
      <button class="postPanel__btn--img" @click="$_postPanel_deleteOgImage">
        <img src="/public/icons/delete.png" :alt="wording.WORDING_POSTEDITOR_DELETE">
      </button>
    </div>
    <div v-show="post.ogImage && $can('editPostOg')" class="postPanel__ogImg">
      <img :src="post.ogImage" :alt="post.ogTitle">
    </div>
    <div :class="[ (panelType === 'edit') ? 'advanced' : '' ]" class="postPanel__submit">
      <button
        v-if="$can('deletePost') && (panelType === 'edit')"
        class="postPanel__btn"
        @click="$_postPanel_deletePost"
        v-text="wording.WORDING_POSTEDITOR_DELETE">
      </button>
      <button
        v-if="(panelType === 'edit') && $can('editPostOg')"
        class="postPanel__btn"
        :disabled="post.active === config.active.DRAFT"
        @click="$_postPanel_submitHandler(config.active.DRAFT)"
        v-text="wording.WORDING_POSTEDITOR_RETURN_TO_DRAFT">
      </button>
      <button
        v-if="(panelType === 'edit')"
        class="postPanel__btn"
        @click="$_postPanel_submitHandler()"
        v-text="wording.WORDING_POSTEDITOR_SAVE">
      </button>
      <button
        v-if="(panelType === 'add') && $can('addPost')"
        class="postPanel__btn"
        :disabled="isEmpty"
        @click="$_postPanel_submitHandler(config.active.DRAFT)"
        v-text="wording.WORDING_POSTEDITOR_SAVE_DRAFT">
      </button>
      <button
        v-if="!$can('publishPost')"
        class="postPanel__btn"
        :disabled="isEmpty"
        @click="$_postPanel_submitHandler(config.active.PENDING)"
        v-text="wording.WORDING_POSTEDITOR_SAVE_PENDING">
      </button>
      <button
        v-if="$can('publishPost')"
        class="postPanel__btn"
        :disabled="isEmpty || (post.active === config.active.ACTIVE)"
        @click="$_postPanel_submitHandler(config.active.ACTIVE)"
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
    WORDING_POSTEDITOR_NOT_FOUND,
    WORDING_POSTEDITOR_OG_DESCRIPTION,
    WORDING_POSTEDITOR_OG_IMAGE,
    WORDING_POSTEDITOR_OG_TITLE,
    WORDING_POSTEDITOR_PUBLISH,
    WORDING_POSTEDITOR_PUBLISH_DATE,
    WORDING_POSTEDITOR_RETURN_TO_DRAFT,
    WORDING_POSTEDITOR_SAVE,
    WORDING_POSTEDITOR_SAVE_DRAFT,
    WORDING_POSTEDITOR_SAVE_PENDING,
    WORDING_POSTEDITOR_TAG,
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
  
  const MAXRESULT = 20
  const DEFAULT_PAGE = 1

  const getMeta = (store, url) => {
    return store.dispatch('GET_META', { url })
  }

  const getTags = (store, {
    max_result = MAXRESULT,
    page = DEFAULT_PAGE,
    sorting = '-update_at',
    keyword = '',
    stats = false
  }) => {
    return store.dispatch('GET_TAGS', {
      params: {
        max_result: max_result,
        page: page,
        sorting: sorting,
        keyword: keyword,
        stats: stats
      }
    })
  }

  const uploadImage = (store, file) => {
    return store.dispatch('UPLOAD_IMAGE', { file, type: 'post' })
  }

  export default {
    name: 'PostPanelB',
    components: {
      'alert-panel': AlertPanel,
      'base-light-box': BaseLightBox,
      'datepicker': Datepicker,
      'text-editor': TextEditor,
      'no-ssr': NoSSR
    },
    props: {
      post: {
        type: Object,
        default: {}
      },
      panelType: {
        type: String,
        required: true
      },
      postType: {
        type: Number,
        required: true
      }
    },
    data () {
      return {
        config: {
          active: POST_ACTIVE
        },
        dateFormat: 'yyyy/MM/d',
        metaChanged: false,
        wording: {
          WORDING_POSTEDITOR_DELETE,
          WORDING_POSTEDITOR_INPUT_TITLE,
          WORDING_POSTEDITOR_LINK,
          WORDING_POSTEDITOR_NOT_FOUND,
          WORDING_POSTEDITOR_OG_DESCRIPTION,
          WORDING_POSTEDITOR_OG_IMAGE,
          WORDING_POSTEDITOR_OG_TITLE,
          WORDING_POSTEDITOR_PUBLISH,
          WORDING_POSTEDITOR_PUBLISH_DATE,
          WORDING_POSTEDITOR_RETURN_TO_DRAFT,
          WORDING_POSTEDITOR_SAVE,
          WORDING_POSTEDITOR_SAVE_DRAFT,
          WORDING_POSTEDITOR_SAVE_PENDING,
          WORDING_POSTEDITOR_TAG,
          WORDING_POSTEDITOR_UPLOAD
        },
        tagInput: '',
        tagsSelected: []
      }
    },
    computed: {
      isEmpty () {
        return _.isEmpty(_.trim(_.get(this.post, [ 'link' ], '')))
          && _.isEmpty(_.trim(_.get(this.post, [ 'title' ], '')))
          && _.isEmpty(_.trim(_.replace(_.get(this.post, [ 'content' ], ''), /<[^>]*>/g, '')))
      },
      tags () {
        let tags = _.get(this.$store, [ 'state', 'tags' ], [])
        _.forEach(this.tagsSelected, (tag) => {
          tags = _.without(tags, tag)
        })
        return tags
      },
      tagsSelectedID () {
        const items = []
        _.forEach(this.tagsSelected, (item) => {
          items.push(Number(item.id))
        })
        return items
      }
    },
    watch: {
      post () {
        this.metaChanged = false
        this.tagInput = ''
        this.tagsSelected = []
        const tags = _.get(this.post, [ 'tags' ]) || []
        tags.forEach((tag) => {
          this.tagsSelected.push(tag)
        })
      }
    },
    beforeMount () {
      getTags(this.$store, { stats: true })
    },
    methods: {
      $_postPanel_addOgImage () {
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
      },
      $_postPanel_addTag (id) {
        this.$refs.tagsInput.focus()
        this.tagsSelected.push(_.find(this.tags, { id: id }))
        this.tagsSelected = _.uniq(this.tagsSelected)
        this.tagInput = ''
        this.$refs.tagsList.classList.add('hidden')
      },
      $_postPanel_closeTagList () {
        this.$refs.tagsList.classList.add('hidden')
      },
      $_postPanel_deleteOgImage () {
        this.post.ogImage = ''
      },
      $_postPanel_deletePost () {
        this.$emit('deletePost')
      },
      $_postPanel_deleteTag (id) {
        const tag = [ _.find(this.tagsSelected, { id: id }) ]
        this.tagsSelected = _.xor(this.tagsSelected, tag)
      },
      $_postPanel_getTags () {
        getTags(this.$store, { keyword: this.tagInput })
      },
      $_postPanel_metaChanged () {
        this.metaChanged = true
      },
      $_postPanel_showTagList () {
        this.$refs.tagsList.classList.remove('hidden')
      },
      $_postPanel_submit (active, params) {
        switch (this.panelType) {
          case 'add':
            params.active = active
            params.author = _.get(this.$store.state, [ 'profile', 'id' ])
            params.type = this.postType
            this.$emit('addPost', params)
            break
          case 'edit':
            let activeChanged = false
            
            params.author = _.get(this.post, [ 'author', 'id' ])
            params.tags = this.tagsSelectedID

            if (active) {
              params.active = active
              activeChanged = true
            }

            if (activeChanged) {
              switch (params.active) {
                case POST_ACTIVE.ACTIVE:
                  this.$emit('publishPost', params)
                  break
                default:
                  this.$emit('updatePost', params, activeChanged)
              }
            } else {
              this.$emit('updatePost', params, activeChanged)
            }
        }
      },
      $_postPanel_submitHandler (active) {
        const params = _.omit(
          _.mapKeys(Object.assign({}, this.post), (value, key) => _.snakeCase(key)),
          [ 'author', 'comment_amount', 'created_at', 'like_amount', 'tags', 'updated_at' ]
        )
        // params.og_title = _.get(this.post, [ 'ogTitle' ]) || _.get(this.post, [ 'title' ]) || ''
        params.updated_by = _.get(this.$store.state, [ 'profile', 'id' ])
        
        if (Date.parse(_.get(this.post, [ 'date' ]))) {
          params.published_at = _.get(this.post, [ 'date' ])
        }

        if (this.metaChanged) {
          const link = _.get(this.post, [ 'link' ])
          if (validator.isURL(link, { protocols: [ 'http','https' ] })) {
            getMeta(this.$store, link)
            .then((res) => {
              params.link_name = _.truncate(_.get(res, [ 'body', 'openGraph', 'siteName' ]), { 'length': 50 })
              params.link_title = _.get(res, [ 'body', 'openGraph', 'title' ])
              params.link_description = _.get(res, [ 'body', 'openGraph', 'description' ])
              params.link_image = _.get(res, [ 'body', 'openGraph', 'image', 'url' ])
              this.$_postPanel_submit(active, params)
            })
          }
        } else {
          this.$_postPanel_submit(active, params)
        }
      },
      $_postPanel_updateContent (content) {
        this.post.content = content
      },
      
      // $_postPanel_toggleTag () {
      //   this.toggleTagInput = !this.toggleTagInput
      // }
    }
  }
</script>
<style lang="stylus" scoped>

.postPanel
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
  &__tags
    flex 1
    display flex
    padding-left 10px
    border 1px solid rgba(128, 128, 128, .4)
    &-selected
      &-item
        display inline-block
        
        > p
          display inline-block
          height 25px
          margin 0
          color #4280a2
          font-size 14px
          line-height 25px
        > button
          display inline-block
          width 18px
          height 18px
          padding 0
          font-size 8px
          background-color transparent
          border 1px solid rgba(128, 128, 128, .4)
          border-radius 50%
          outline none
        &:not(:first-of-type)
          margin-left 10px
    &-input
      flex 1
      display flex
      position relative
      > input 
        width auto
        height 25px
        padding 0
        margin-left 10px
        border none
        outline none
      // &.hidden
      //   display none
    &-list
      position absolute
      top 25px
      left -1px
      width 100%
      background-color #fff
      border 1px solid rgba(128, 128, 128, .4)
      border-top 1px solid rgba(128, 128, 128, .2)
      &.hidden
        display none
      > button
        display block
        width 100%
        font-size 14px
        text-align left
        background-color transparent
        border none
        outline none
        &:hover
          background-color rgba(66, 128, 162, .3)
        &.noResult
          cursor default
          &:hover
            background-color transparent
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
      .postPanel__btn
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
  .postPanel
    width 900px
    padding 30px 100px
    &__submit
      &.advanced
        .postPanel__btn
          width 160px
    &__btn
      width 340px
      height 30px
</style>