<template>
  <section class="alert">
    <p v-if="needConfirm" class="alert__title"><strong v-text="alertTitle"></strong></p>
    <div v-if="needList" class="alert__list" :class="{ multiple: isMultiple }">
      <template v-if="type === 'post'">
        <div v-for="i in items" :key="i.id" class="alert__item">
          <p><strong v-text="`${wording.WORDING_ALERTPANEL_AUTHOR}：`"></strong><span v-text="$_alertPanel_getPostAuthor(i)"></span></p>
          <p><strong v-text="`${wording.WORDING_ALERTPANEL_TITLE}：`"></strong><span v-text="i.title"></span></p>
        </div>
      </template>
      <template v-if="type === 'tag'">
        <div v-for="i in items" :key="i.id" class="alert__item">
          <p><strong v-text="`${wording.WORDING_ALERTPANEL_TAG}：`"></strong><span v-text="i.text"></span></p>
        </div>
      </template>
    </div>
    <div v-if="needConfirm" class="alert__control" :class="{ multiple: isMultiple }">
      <button class="alert__btn" @click="$_alertPanel_confirm" v-text="wording.WORDING_ALERTPANEL_CONFIRM"></button>
      <button class="alert__btn" @click="$_alertPanel_cancel" v-text="wording.WORDING_ALERTPANEL_CANCEL"></button>
    </div>
    <p v-if="!needConfirm" class="alert--message"><strong v-text="alertMessage"></strong></p>
  </section>
</template>
<script>
  import { POST_ACTIVE, TAG_ACTIVE } from '../../api/config'
  import {
    WORDING_ALERTPANEL_ADD_SUCCESSFUL,
    WORDING_ALERTPANEL_AUTHOR,
    WORDING_ALERTPANEL_CANCEL,
    WORDING_ALERTPANEL_CONFIRM,
    WORDING_ALERTPANEL_DELETE_CONFIRMATION,
    WORDING_ALERTPANEL_DELETE_SUCCESSFUL,
    WORDING_ALERTPANEL_DRAFT,
    WORDING_ALERTPANEL_POST,
    WORDING_ALERTPANEL_PUBLISH_CONFIRMATION,
    WORDING_ALERTPANEL_PUBLISH_SUCCESSFUL,
    WORDING_ALERTPANEL_STATUS,
    WORDING_ALERTPANEL_TAG,
    WORDING_ALERTPANEL_TITLE,
    WORDING_ALERTPANEL_UPDATE_SUCCESSFUL
  } from '../constants'
  import _ from 'lodash'
  export default {
    name: 'AlertPanel',
    props: {
      // action: {
      //   type: String,
      //   required: true
      // },
      active: {
        type: Number
      },
      items: {
        type: Array,
        required: true
      },
      needConfirm: {
        type: Boolean,
        required: true
      },
      showLightBox: {
        type: Boolean,
        required: true
      },
      type: {
        type: String,
        required: true
      }
    },
    data () {
      return {
        config: {
          post: POST_ACTIVE,
          tag: TAG_ACTIVE
        },
        wording: {
          WORDING_ALERTPANEL_ADD_SUCCESSFUL,
          WORDING_ALERTPANEL_AUTHOR,
          WORDING_ALERTPANEL_CANCEL,
          WORDING_ALERTPANEL_CONFIRM,
          WORDING_ALERTPANEL_DELETE_CONFIRMATION,
          WORDING_ALERTPANEL_DELETE_SUCCESSFUL,
          WORDING_ALERTPANEL_DRAFT,
          WORDING_ALERTPANEL_POST,
          WORDING_ALERTPANEL_PUBLISH_CONFIRMATION,
          WORDING_ALERTPANEL_PUBLISH_SUCCESSFUL,
          WORDING_ALERTPANEL_STATUS,
          WORDING_ALERTPANEL_TAG,
          WORDING_ALERTPANEL_TITLE,
          WORDING_ALERTPANEL_UPDATE_SUCCESSFUL
        }
      }
    },
    computed: {
      alertMessage () {
        switch (this.type) {
          case 'post':
            switch (this.active) {
              case POST_ACTIVE.ACTIVE:
                return `${this.wording.WORDING_ALERTPANEL_POST}${this.wording.WORDING_ALERTPANEL_PUBLISH_SUCCESSFUL}！`
              case POST_ACTIVE.DEACTIVE:
                return `${this.wording.WORDING_ALERTPANEL_POST}${this.wording.WORDING_ALERTPANEL_DELETE_SUCCESSFUL}！`
            }
          case 'tag':
            switch (this.active) {
              case TAG_ACTIVE.ACTIVE:
                return `${this.wording.WORDING_ALERTPANEL_TAG}${this.wording.WORDING_ALERTPANEL_ADD_SUCCESSFUL}！` 
              case TAG_ACTIVE.DEACTIVE:
                return `${this.wording.WORDING_ALERTPANEL_TAG}${this.wording.WORDING_ALERTPANEL_DELETE_SUCCESSFUL}！`
            }
        }
      },
      alertTitle () {
        switch (this.type) {
          case 'post':
            switch (this.active) {
              case POST_ACTIVE.ACTIVE:
                return this.wording.WORDING_ALERTPANEL_PUBLISH_CONFIRMATION
              case POST_ACTIVE.DEACTIVE:
                return this.wording.WORDING_ALERTPANEL_DELETE_CONFIRMATION
            }
          case 'tag':
            return this.wording.WORDING_ALERTPANEL_DELETE_CONFIRMATION
        }
      },
      isMultiple () {
        return this.items.length > 1
      },
      needList () {
        switch (this.type) {
          case 'post':
            return true
            // return this.active !== POST_ACTIVE.ACTIVE
          case 'tag':
            return this.active !== TAG_ACTIVE.ACTIVE
          default:
            return false
        }
      }
    },
    watch: {
      needConfirm (val) {
        if (!val && this.showLightBox) {
          setTimeout(() => {
            this.$emit('closeAlert')
          }, 5000)
        }
      }
    },
    methods: {
      $_alertPanel_cancel () {
        this.$emit('closeAlert')
      },
      $_alertPanel_confirm () {
        switch (this.type) {
          case 'post':
            switch (this.active) {
              case POST_ACTIVE.ACTIVE:
                this.$emit('publishPosts')
                break
              case POST_ACTIVE.DEACTIVE:
                this.$emit('deletePosts')
                break
            }
          case 'tag':
            this.$emit('deleteTags')
            break
        }
      },
      $_alertPanel_getPostAuthor (post) {
        return _.get(post, [ 'author', 'nickname' ])
      }
    }
  }
</script>
<style lang="stylus" scoped>

.alert
  width 325px
  color #000
  font-size 15px
  background #fff
  box-shadow: 1px 1px 2.5px 0 rgba(0, 0, 0, 0.5)
  > p
    margin .8em 25px
  &__title
    display block
    margin 15px 25px 0
    color #4280a2
  &__list
    margin 0 25px
    &.multiple
      .alert__item
        border-bottom 1px solid #d3d3d3
        > p
          margin .8em 0
        &:last-of-type
          border-bottom none
  &__control
    display flex
    justify-content space-between
    margin-top 30px
    &.multiple
      margin-top 15px
  &__btn
    flex 1
    height 30px
    background transparent
    border .5px solid #d3d3d3
    border-collapse collapse
    outline none
    &:first-of-type
      border-right none
  &--message
    color #4280a2
</style>