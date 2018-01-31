<template>
  <section class="alert" :class="{ isCompleted: isCompleted }">
    <template v-if="post">
      <p v-if="(active === config.active.active || active === config.active.deactive) && !isCompleted" class="alert__title">
        <strong v-text="alertTitle"></strong>
      </p>
      <p><strong v-text="`${wording.WORDING_ALERTPANEL_AUTHOR}：`"></strong><span v-text="postAuthor"></span></p>
      <p><strong v-text="`${wording.WORDING_ALERTPANEL_TITLE}：`"></strong><span v-text="postTitle"></span></p>
      <div v-if="(active === config.active.active || active === config.active.deactive) && !isCompleted" class="alert__control">
        <button class="alert__btn" @click="$_alertPanel_confirm" v-text="wording.WORDING_ALERTPANEL_CONFIRM"></button>
        <button class="alert__btn" @click="$_alertPanel_cancel" v-text="wording.WORDING_ALERTPANEL_CANCEL"></button>
      </div>
      <p v-if="isCompleted" class="alert--message"><strong v-text="alertMessage"></strong></p>
    </template>
  </section>
</template>
<script>
  import { POST_ACTIVE } from '../../api/config'
  import {
    WORDING_ALERTPANEL_AUTHOR,
    WORDING_ALERTPANEL_CANCEL,
    WORDING_ALERTPANEL_CONFIRM,
    WORDING_ALERTPANEL_DELETE_CONFIRMATION,
    WORDING_ALERTPANEL_DELETE_SUCCESSFUL,
    WORDING_ALERTPANEL_DRAFT,
    WORDING_ALERTPANEL_POST,
    WORDING_ALERTPANEL_PUBLISH_CONFIRMATION,
    WORDING_ALERTPANEL_PUBLISH_SUCCESSFUL,
    WORDING_ALERTPANEL_SAVE_SUCCESSFUL,
    WORDING_ALERTPANEL_STATUS,
    WORDING_ALERTPANEL_TITLE,
    WORDING_ALERTPANEL_UPDATE_SUCCESSFUL
  } from '../constants'
  import _ from 'lodash'
  export default {
    name: 'AlertPanel',
    props: {
      action: {
        default: undefined
      },
      active: {
        type: Number
      },
      isCompleted: {
        type: Boolean,
        default: false
      },
      post: {
        type: Object
      },
      showLightBox: {
        default: false
      }
    },
    data () {
      return {
        config: {
          active: POST_ACTIVE,
        },
        wording: {
          WORDING_ALERTPANEL_AUTHOR,
          WORDING_ALERTPANEL_CANCEL,
          WORDING_ALERTPANEL_CONFIRM,
          WORDING_ALERTPANEL_DELETE_CONFIRMATION,
          WORDING_ALERTPANEL_DELETE_SUCCESSFUL,
          WORDING_ALERTPANEL_DRAFT,
          WORDING_ALERTPANEL_POST,
          WORDING_ALERTPANEL_PUBLISH_CONFIRMATION,
          WORDING_ALERTPANEL_PUBLISH_SUCCESSFUL,
          WORDING_ALERTPANEL_SAVE_SUCCESSFUL,
          WORDING_ALERTPANEL_STATUS,
          WORDING_ALERTPANEL_TITLE,
          WORDING_ALERTPANEL_UPDATE_SUCCESSFUL
        }
      }
    },
    computed: {
      alertMessage () {
        if (this.isCompleted) {
          if (this.active === POST_ACTIVE.deactive) {
            return `${this.wording.WORDING_ALERTPANEL_POST}${this.wording.WORDING_ALERTPANEL_DELETE_SUCCESSFUL}！`
          }
          if (this.active === POST_ACTIVE.active) {
            return `${this.wording.WORDING_ALERTPANEL_POST}${this.wording.WORDING_ALERTPANEL_PUBLISH_SUCCESSFUL}！`
          }
          if (this.action === 'add') {
            return `${this.wording.WORDING_ALERTPANEL_POST}${this.wording.WORDING_ALERTPANEL_SAVE_SUCCESSFUL}！`
          }
          if (this.action === 'edit' && this.active === POST_ACTIVE.draft) {
            return `${this.wording.WORDING_ALERTPANEL_POST}${this.wording.WORDING_ALERTPANEL_DRAFT}${this.wording.WORDING_ALERTPANEL_UPDATE_SUCCESSFUL}！`
          }
          if (this.action === 'edit' && this.active === POST_ACTIVE.pending) {
            return `${this.wording.WORDING_ALERTPANEL_POST}${this.wording.WORDING_ALERTPANEL_STATUS}${this.wording.WORDING_ALERTPANEL_UPDATE_SUCCESSFUL}！`
          }
        }
        return ''
      },
      alertTitle () {
        if (this.active === POST_ACTIVE.deactive) {
          return this.wording.WORDING_ALERTPANEL_DELETE_CONFIRMATION
        }
        if (this.active === POST_ACTIVE.active) {
          return this.wording.WORDING_ALERTPANEL_PUBLISH_CONFIRMATION
        }
        return ''
      },
      postAuthor () {
        if (this.action === 'add') {
          return _.get(this.$store.state, [ 'profile', 'nickname' ])
        }
        return _.get(this.post, [ 'author', 'nickname' ])
      },
      postTitle () {
        return _.get(this.post, [ 'title' ])
      }
    },
    watch: {
      isCompleted (val) {
        if (val && this.showLightBox) {
          setTimeout(() => {
            this.$emit('closeAlert', false)
          }, 5000)
        }
      },
      showLightBox (val) {
        if (!val) {
          this.$emit('closeEditor')
        }
      }
    },
    methods: {
      $_alertPanel_cancel () {
        this.$emit('closeAlert', false)
      },
      $_alertPanel_confirm () {
        if (this.active === POST_ACTIVE.deactive) {
          this.$emit('deletePost')
        }
        if (this.active === POST_ACTIVE.active) {
          this.$emit('publishPost')
        }
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
  &--message
    color #4280a2

.alert.isCompleted
  > p:first-of-type
    margin-top 15px
  > p:last-of-type
    margin-bottom 15px
</style>