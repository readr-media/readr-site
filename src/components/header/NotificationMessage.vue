<template>
  <div>
    <template v-if="get(item, 'event_type') === 'comment_comment'">
      <span class="comment--commenter" v-text="get(item, 'nickname')"></span>
      <span class="comment--action" v-text="$t('NOTIFICATION.REPLY_AS_WELL')"></span>
      <span class="comment--owner" v-text="get(item, 'object_name')"></span>
      <span class="comment--string" v-text="$t('NOTIFICATION.WHOS')"></span>
      <span class="comment--post-type" v-text="postType"></span>    
    </template>
    <template v-else-if="get(item, 'event_type') === 'comment_reply'">
      <span class="comment--commenter" v-text="get(item, 'nickname')"></span>
      <span class="comment--action" v-text="$t('NOTIFICATION.REPLY_TO_YOU')"></span>
      <span class="comment--string" v-text="$t('NOTIFICATION.AT')"></span>
      <span class="comment--owner" v-text="get(item, 'object_name')"></span>
      <span class="comment--post-type" v-text="postType"></span>    
      <span class="comment--string" v-text="$t('NOTIFICATION.WHOS_COMMENT')"></span>
    </template>
    <template v-else-if="get(item, 'event_type') === 'comment_reply_author'">
      <span class="comment--owner" v-text="get(item, 'object_name')"></span>
      <span class="comment--action" v-text="$t('NOTIFICATION.REPLY_TO_YOU')"></span>
      <span class="comment--string" v-text="$t('NOTIFICATION.AT_WHOS')"></span>
      <span class="comment--post-type" v-text="postType"></span>    
      <span class="comment--string" v-text="$t('NOTIFICATION.WHOS_COMMENT')"></span>
    </template>
    <template v-else-if="get(item, 'event_type') === 'follow_member_reply' || get(item, 'event_type') === 'follow_post_reply'">
      <span class="comment--commenter" v-text="get(item, 'nickname')"></span>
      <span class="comment--action" v-text="$t('NOTIFICATION.REPLY')"></span>
      <span class="comment--owner" v-text="get(item, 'object_name')"></span>
      <span class="comment--string" v-text="$t('NOTIFICATION.WHOS')"></span>
      <span class="comment--post-type" v-text="postType"></span>    
    </template>
    <template v-else-if="get(item, 'event_type') === 'follow_project_reply'">
      <span class="comment--commenter" v-text="get(item, 'nickname')"></span>
      <span class="comment--action" v-text="$t('NOTIFICATION.REPLY')"></span>
      <span class="comment--owner" v-text="get(item, 'object_name')"></span>
    </template>
    <template v-else-if="get(item, 'event_type') === 'follow_memo_reply'">
      <span class="comment--commenter" v-text="get(item, 'nickname')"></span>
      <span class="comment--action" v-text="$t('NOTIFICATION.REPLY')"></span>
      <span class="comment--owner" v-text="get(item, 'object_name')"></span>
      <span class="comment--string" v-text="$t('NOTIFICATION.WHOS')"></span>
      <span class="comment--string" v-text="$t('NOTIFICATION.MEMO')"></span>
    </template>
    <template v-else-if="get(item, 'event_type') === 'follow_project_post'">
      <span class="comment--commenter" v-text="get(item, 'nickname')"></span>
      <span class="comment--string" v-text="$t('NOTIFICATION.AT')"></span>
      <span class="comment--owner" v-text="get(item, 'object_name')"></span>
      <span class="comment--action" v-text="$t('NOTIFICATION.PUBLISH')"></span>
      <span class="comment--post-type" v-text="postType"></span>    
    </template>
    <template v-else-if="get(item, 'event_type') === 'post_reply'">
      <span class="comment--commenter" v-text="get(item, 'nickname')"></span>
      <span class="comment--string" v-text="$t('NOTIFICATION.GIVE_FEEDBACK_TO_YOUR_PUBLISH')"></span>   
      <span class="comment--post-type" v-text="postType"></span>  
    </template>
  </div>
</template>
<script>
  import { get, } from 'lodash'
  export default {
    name: 'NotificationMessage',
    computed: {
      postType () {
        switch (get(this.item, 'object_type')) {
          case 'post':
            return this.$t(`NOTIFICATION.POST_TYPE.${get(this.item, 'post_type')}`)
          default:
            return this.$t(`NOTIFICATION.OBJECT_TYPE.${get(this.item, 'object_type', '').toUpperCase()}`)
        }
      },
    },
    methods: {
      get,
    },
    mounted () {},
    props: {
      item: {
        type: Object,
        default: {},
      },
    },
  }
</script>
<style lang="stylus" scoped>
  .comment
    &--commenter, &--owner, &--post-type
      font-weight bold
</style>