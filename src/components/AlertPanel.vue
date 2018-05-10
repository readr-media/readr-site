<template>
  <section class="alert" :class="{ error: type === 'error' }">
    <p v-if="needConfirm" class="alert__title"><strong v-text="alertTitle"></strong></p>
    <div v-if="needList" class="alert__list" :class="{ multiple: isMultiple }">
      <template v-if="type === 'post' || type === 'video'">
        <div v-for="i in items" :key="i.id" class="alert__item">
          <p><strong v-text="`${$t('ALERT.AUTHOR')}：`"></strong><span v-text="$_alertPanel_getPostAuthor(i)"></span></p>
          <p><strong v-text="`${$t('ALERT.TITLE')}：`"></strong><span v-text="i.title"></span></p>
          <p v-if="status === config.post.SCHEDULING || status === config.post.PUBLISHED"><strong v-text="`${$t('ALERT.PUBLISH_DATE')}：`"></strong><span v-text="moment(i.published_at).format('YYYY-MM-DD HH:MM')"></span></p>
        </div>
      </template>
      <template v-if="type === 'tag'">
        <div v-for="i in items" :key="i.id" class="alert__item">
          <p><strong v-text="`${$t('ALERT.TAG')}：`"></strong><span v-text="i.text"></span></p>
        </div>
      </template>
    </div>
    <div v-if="needConfirm" class="alert__control" :class="{ multiple: isMultiple }">
      <button class="alert__btn" @click="$_alertPanel_confirm" v-text="$t('ALERT.CONFIRM')"></button>
      <button class="alert__btn" @click="$_alertPanel_cancel" v-text="$t('ALERT.CANCEL')"></button>
    </div>
    <img v-if="type === 'error'" class="alert__error-img" src="/public/icons/exclamation.png" alt="">
    <p v-if="!needConfirm" class="alert--message"><strong v-text="alertMessage"></strong></p>
  </section>
</template>
<script>
  import { POST_PUBLISH_STATUS, TAG_ACTIVE, } from '../../api/config'
  import { get, } from 'lodash'
  import moment from 'moment'

  export default {
    name: 'AlertPanel',
    props: {
      status: {
        type: Number,
      },
      statusChanged: {
        type: Boolean,
        default: false,
      },
      isReturnToDraft: {
        type: Boolean,
        default: false,
      },
      items: {
        type: Array,
        required: true,
      },
      needConfirm: {
        type: Boolean,
        required: true,
      },
      showLightBox: {
        type: Boolean,
        required: true,
      },
      type: {
        type: String,
        required: true,
      },
    },
    data () {
      return {
        config: {
          post: POST_PUBLISH_STATUS,
          tag: TAG_ACTIVE,
        },
      }
    },
    computed: {
      alertMessage () {
        switch (this.type) {
          case 'post':
            if (!this.statusChanged) {
              return `${this.$t('ALERT.POST')}${this.$t('ALERT.UPDATE_SUCCESSFUL')}！`
            } else {
              switch (this.status) {
                case POST_PUBLISH_STATUS.PUBLISHED:
                  return `${this.$t('ALERT.POST')}${this.$t('ALERT.PUBLISH_SUCCESSFUL')}！`
                case POST_PUBLISH_STATUS.UNPUBLISHED:
                  return `${this.$t('ALERT.POST')}${this.$t('ALERT.UNPUBLISHED')}！`
                case POST_PUBLISH_STATUS.DELETED:
                  return `${this.$t('ALERT.POST')}${this.$t('ALERT.DELETE_SUCCESSFUL')}！`
                case POST_PUBLISH_STATUS.DRAFT:
                  if (this.isReturnToDraft) {
                    return `${this.$t('ALERT.POST')}${this.$t('ALERT.RETURNED')}！`
                  }
                  if (!get(this.items, [ 0, 'id', ])) {
                    return `${this.$t('ALERT.POST')}${this.$t('ALERT.ADD_SUCCESSFUL')}！`
                  }
                  return `${this.$t('ALERT.POST')}${this.$t('ALERT.UPDATE_SUCCESSFUL')}！`
                case POST_PUBLISH_STATUS.PENDING:
                  return `${this.$t('ALERT.POST')}${this.$t('ALERT.PENDING')}！`
                case POST_PUBLISH_STATUS.SCHEDULING:
                  return `${this.$t('ALERT.POST')}${this.$t('ALERT.SCHEDULED')}！`
              }
              break
            }
          case 'tag':
            switch (this.status) {
              case TAG_ACTIVE.ACTIVE:
                return `${this.$t('ALERT.TAG')}${this.$t('ALERT.ADD_SUCCESSFUL')}！` 
              case TAG_ACTIVE.DEACTIVE:
                return `${this.$t('ALERT.TAG')}${this.$t('ALERT.DELETE_SUCCESSFUL')}！`
            }
            break
          case 'error':
            return this.$t('ALERT.ERROR')
        }
      },
      alertTitle () {
        switch (this.type) {
          case 'post':
          case 'video':
            switch (this.status) {
              case POST_PUBLISH_STATUS.PUBLISHED:
                return this.$t('ALERT.PUBLISH_CONFIRMATION')
              case POST_PUBLISH_STATUS.UNPUBLISHED:
                return this.$t('ALERT.UNPUBLISH_CONFIRMATION')
              case POST_PUBLISH_STATUS.DELETED:
                return this.$t('ALERT.DELETE_CONFIRMATION')
              case POST_PUBLISH_STATUS.DRAFT:
                return this.$t('ALERT.RETURN_DRAFT_CONFIRMATION')
            }
            break
          case 'tag':
            return this.$t('ALERT.DELETE_CONFIRMATION')
        }
      },
      isMultiple () {
        return this.items.length > 1
      },
      needList () {
        switch (this.type) {
          case 'tag':
            return this.status !== TAG_ACTIVE.ACTIVE
          default:
            return true
        }
      },
    },
    watch: {
      needConfirm (val) {
        if (!val && this.showLightBox) {
          setTimeout(() => {
            this.$emit('closeAlert')
          }, 5000)
        }
      },
    },
    methods: {
      $_alertPanel_cancel () {
        this.$emit('closeAlert')
      },
      $_alertPanel_confirm () {
        switch (this.type) {
          case 'post':
          case 'video':
            switch (this.status) {
              case POST_PUBLISH_STATUS.SCHEDULING:
              case POST_PUBLISH_STATUS.PUBLISHED:
                this.$emit('publishPosts')
                break
              case POST_PUBLISH_STATUS.UNPUBLISHED:
                this.$emit('unpublishPosts', POST_PUBLISH_STATUS.UNPUBLISHED)
                break
              case POST_PUBLISH_STATUS.DELETED:
                this.$emit('deletePosts')
                break
              case POST_PUBLISH_STATUS.DRAFT:
                this.$emit('returnToDraftPosts', POST_PUBLISH_STATUS.DRAFT)
                break
            }
            break
          case 'tag':
            this.$emit('deleteTags')
            break
        }
      },
      $_alertPanel_getPostAuthor (post) {
        return get(post, [ 'author', 'nickname', ]) || get(this.$store, [ 'state', 'profile', 'nickname', ])
      },
      moment,
    },
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
  &.error
    text-align center
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
  &__error
    &-img
      width 50px
      height 50px
      margin 40px 0 20px
  &--message
    color #4280a2
</style>