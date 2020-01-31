<template>
  <div class="comment">
    <template v-if="get(item, 'event_type') === NOTIFICATION_TYPE.COMMENT_COMMENT">
      <span
        class="comment--commenter"
        v-text="get(item, 'nickname')"
      />
      <span
        class="comment--action"
        v-text="$t('NOTIFICATION.REPLY_AS_WELL')"
      />
      <span
        class="comment--owner"
        v-text="get(item, 'object_name')"
      />
      <span
        class="comment--string"
        v-text="$t('NOTIFICATION.WHOS')"
      />
      <span
        class="comment--post-type"
        v-text="postType"
      />
    </template>
    <template v-else-if="get(item, 'event_type') === NOTIFICATION_TYPE.COMMENT_REPLY">
      <span
        class="comment--commenter"
        v-text="get(item, 'nickname')"
      />
      <span
        class="comment--action"
        v-text="$t('NOTIFICATION.REPLY_TO_YOU')"
      />
      <span
        class="comment--string"
        v-text="$t('NOTIFICATION.AT')"
      />
      <span
        class="comment--owner"
        v-text="get(item, 'object_name')"
      />
      <span
        class="comment--post-type"
        v-text="postType"
      />
      <span
        class="comment--string"
        v-text="$t('NOTIFICATION.WHOS_COMMENT')"
      />
    </template>
    <template v-else-if="get(item, 'event_type') === NOTIFICATION_TYPE.COMMENT_REPLY_AUTHOR">
      <span
        class="comment--owner"
        v-text="get(item, 'object_name')"
      />
      <span
        class="comment--action"
        v-text="$t('NOTIFICATION.REPLY_TO_YOU')"
      />
      <span
        class="comment--string"
        v-text="$t('NOTIFICATION.AT_WHOS')"
      />
      <span
        class="comment--post-type"
        v-text="postType"
      />
      <span
        class="comment--string"
        v-text="$t('NOTIFICATION.WHOS_COMMENT')"
      />
    </template>
    <template v-else-if="get(item, 'event_type') === NOTIFICATION_TYPE.FOLLOW_MEMBER_REPLY || get(item, 'event_type') === NOTIFICATION_TYPE.FOLLOW_POST_REPLY">
      <span
        class="comment--commenter"
        v-text="get(item, 'nickname')"
      />
      <span
        class="comment--action"
        v-text="$t('NOTIFICATION.REPLY')"
      />
      <span
        class="comment--owner"
        v-text="get(item, 'object_name')"
      />
      <span
        class="comment--string"
        v-text="$t('NOTIFICATION.WHOS')"
      />
      <span
        class="comment--post-type"
        v-text="postType"
      />
    </template>
    <template v-else-if="get(item, 'event_type') === NOTIFICATION_TYPE.FOLLOW_PROJECT_REPLY">
      <span
        class="comment--commenter"
        v-text="get(item, 'nickname')"
      />
      <span
        class="comment--action"
        v-text="$t('NOTIFICATION.REPLY')"
      />
      <span
        class="comment--owner"
        v-text="get(item, 'object_name')"
      />
    </template>
    <template v-else-if="get(item, 'event_type') === NOTIFICATION_TYPE.FOLLOW_MEMO_REPLY">
      <span
        class="comment--commenter"
        v-text="get(item, 'nickname')"
      />
      <span
        class="comment--action"
        v-text="$t('NOTIFICATION.REPLY')"
      />
      <span
        class="comment--owner"
        v-text="get(item, 'object_name')"
      />
      <span
        class="comment--string"
        v-text="$t('NOTIFICATION.WHOS')"
      />
      <span
        class="comment--string"
        v-text="$t('NOTIFICATION.MEMO')"
      />
    </template>
    <template v-else-if="get(item, 'event_type') === NOTIFICATION_TYPE.FOLLOW_PROJECT_REPORT">
      <span
        class="comment--commenter"
        v-text="get(item, 'nickname')"
      />
      <span
        class="comment--action"
        v-text="$t('NOTIFICATION.PUBLISH')"
      />
      <span
        class="comment--post-type normal"
        v-text="postType"
      />
      <span
        class="comment--owner"
        v-text="get(item, 'object_name')"
      />
    </template>
    <template v-else-if="get(item, 'event_type') === NOTIFICATION_TYPE.FOLLOW_PROJECT_MEMO">
      <span
        class="comment--commenter"
        v-text="get(item, 'nickname')"
      />
      <span
        class="comment--string"
        v-text="$t('NOTIFICATION.WHOS')"
      />
      <span
        class="comment--post-type normal"
        v-text="postType"
      />
      <span
        class="comment--owner"
        v-text="get(item, 'object_name')"
      />
      <span
        class="comment--action"
        v-text="$t('NOTIFICATION.UPDATE')"
      />
    </template>
    <template v-else-if="get(item, 'event_type') === NOTIFICATION_TYPE.POST_REPLY">
      <span
        class="comment--commenter"
        v-text="get(item, 'nickname')"
      />
      <span
        class="comment--string"
        v-text="$t('NOTIFICATION.GIVE_FEEDBACK_TO_YOUR_PUBLISH')"
      />
      <span
        class="comment--post-type"
        v-text="postType"
      />
    </template>
    <template v-else-if="get(item, 'event_type') === NOTIFICATION_TYPE.FOLLOW_MEMBER_POST">
      <span
        class="comment--commenter"
        v-text="get(item, 'nickname')"
      />
      <span
        class="comment--action"
        v-text="$t('NOTIFICATION.PUBLISH')"
      />
      <span
        class="comment--post-type"
        v-text="postType"
      />
    </template>
    <template v-else-if="get(item, 'event_type') === NOTIFICATION_TYPE.FOLLOW_PROJECT_STATUS">
      <span
        class="comment--commenter"
        v-text="get(item, 'nickname')"
      />
      <span
        class="comment--action"
        v-text="$t('NOTIFICATION.UPDATE')"
      />
    </template>
    <template v-else-if="get(item, 'event_type') === NOTIFICATION_TYPE.FOLLOW_TAG_PROJECT_STATUS">
      <span
        class="comment--owner"
        v-text="get(item, 'object_name')"
      />
      <span
        class="comment--string"
        v-text="$t('NOTIFICATION.WHOS')"
      />
      <span
        class="comment--commenter"
        v-text="get(item, 'nickname')"
      />
      <span
        class="comment--string"
        v-text="$t('NOTIFICATION.TAGS.SERIES_DONE')"
      />
    </template>
    <template v-else-if="get(item, 'event_type') === NOTIFICATION_TYPE.FOLLOW_TAG_PROJECT_PROGRESS">
      <span
        class="comment--owner"
        v-text="get(item, 'object_name')"
      />
      <span
        class="comment--string"
        v-text="$t('NOTIFICATION.WHOS')"
      />
      <span
        class="comment--commenter"
        v-text="get(item, 'nickname')"
      />
      <span
        class="comment--string"
        v-text="$t('NOTIFICATION.TAGS.SERIES_PROGRESS')"
      />
    </template>
    <template v-else-if="get(item, 'event_type') === NOTIFICATION_TYPE.FOLLOW_TAG_REPORT">
      <span
        class="comment--owner"
        v-text="get(item, 'object_name')"
      />
      <span
        class="comment--string"
        v-text="$t('NOTIFICATION.TAGS.NEW_REPORT')"
      />
      <span
        class="comment--commenter"
        v-text="get(item, 'nickname')"
      />
      <span
        class="comment--string"
        v-text="$t('NOTIFICATION.TAGS.COME')"
      />
    </template>
    <template v-else-if="get(item, 'event_type') === NOTIFICATION_TYPE.FOLLOW_TAG_MEMO">
      <span
        class="comment--owner"
        v-text="get(item, 'object_name')"
      />
      <span
        class="comment--string"
        v-text="$t('NOTIFICATION.TAGS.NEW_MEMO')"
      />
      <span
        class="comment--commenter"
        v-text="get(item, 'nickname')"
      />
      <span
        class="comment--string"
        v-text="$t('NOTIFICATION.TAGS.COME')"
      />
    </template>
    <template v-else-if="get(item, 'event_type') === NOTIFICATION_TYPE.FOLLOW_TAG_POST">
      <span
        class="comment--owner"
        v-text="get(item, 'object_name')"
      />
      <span
        class="comment--string"
        v-text="$t('NOTIFICATION.TAGS.NEW_POST')"
      />
      <span
        class="comment--commenter"
        v-text="get(item, 'nickname')"
      />
      <span
        class="comment--string"
        v-text="$t('NOTIFICATION.TAGS.COME')"
      />
    </template>
  </div>
</template>
<script>
import { NOTIFICATION_TYPE } from 'src/constants'
import { get } from 'lodash'

export default {
  name: 'NotificationMessage',
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      NOTIFICATION_TYPE: NOTIFICATION_TYPE || {}
    }
  },
  computed: {
    postType () {
      switch (get(this.item, 'object_type')) {
        case 'post':
          return this.$t(`NOTIFICATION.POST_TYPE.${get(this.item, 'post_type')}`)
        default:
          return this.$t(`NOTIFICATION.OBJECT_TYPE.${get(this.item, 'object_type', '').toUpperCase()}`)
      }
    }
  },
  methods: {
    get
  }
}
</script>
<style lang="stylus" scoped>
  .comment
    // white-space nowrap
    overflow hidden
    // text-overflow ellipsis
    text-overflow justify
    word-break break-all
    word-wrap break-word
    &--commenter, &--owner, &--post-type
      font-weight bold
    &--commenter, &--owner
      margin-left 2px
      margin-right 2px
    &--post-type
      &.normal
        font-weight 300
</style>
