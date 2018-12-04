<template>
  <PostContentWrapper :post="post">
    <template slot-scope="slotProps">
      <PostContentNormal
        v-if="isPostType('normal', slotProps.postInstance)"
        :post="slotProps.postInstance"
      />
      <PostContentNews
        v-else-if="isPostType('news', slotProps.postInstance)"
        :post="slotProps.postInstance"
      />
      <PostContentReport
        v-else-if="isPostType('report', slotProps.postInstance)"
        :post="slotProps.postInstance"
      />
      <PostContentMemo
        v-else-if="isPostType('memo', slotProps.postInstance)"
        :post="slotProps.postInstance"
      />
    </template>
  </PostContentWrapper>
</template>

<script>
import { get, } from 'lodash'
import PostContentWrapper from './PostContentWrapper.vue'
import PostContentNormal from './PostContentNormal.vue'
import PostContentNews from './PostContentNews.vue'
import PostContentReport from './PostContentReport.vue'
import PostContentMemo from './PostContentMemo.vue'

export default {
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
  components: {
    PostContentWrapper,
    PostContentNormal,
    PostContentNews,
    PostContentReport,
    PostContentMemo,
  },
  methods: {
    isPostType (type = '', postInstance) {
      return get(postInstance, [ 'processed', 'postType', ], '') === type
    },
  },
}
</script>

<style lang="stylus" scoped>

</style>

