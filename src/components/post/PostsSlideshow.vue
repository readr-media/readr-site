<template>
  <div class="posts-slideshow">
    <PostList
      :items="chunkPosts[currentIndex]"
      ga-event-label="article"
    />
    <div class="control-bar">
      <div
        v-if="currentIndex !== 0"
        class="control-bar__action prev"
        @click="currentIndex -= 1"
      >
        <img
          :alt="`上 ${chunkSize} 則`"
          src="/public/2.0/icons/arrow.svg"
        >
        <span>上 {{ chunkSize }} 則</span>
      </div>
      <div
        v-if="hasMore || currentIndex < chunkPosts.length - 1"
        class="control-bar__action next"
        @click="nextChunk()"
      >
        <span>下 {{ chunkSize }} 則</span>
        <img
          :alt="`下 ${chunkSize} 則`"
          src="/public/2.0/icons/arrow.svg"
        >
      </div>
    </div>
  </div>
</template>
<script>
import { chunk } from 'lodash'
import { sendGaEvent } from 'src/util/comm'

import PostList from 'src/components/post/PostList.vue'

export default {
  name: 'PostsSlideshow',
  components: {
    PostList
  },
  props: {
    chunkSize: {
      type: Number,
      default: 3
    },
    hasMore: {
      type: Boolean,
      default: false
    },
    posts: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      currentIndex: 0
    }
  },
  computed: {
    chunkPosts () {
      return chunk(this.posts, this.chunkSize)
    }
  },
  watch: {
    currentIndex (value) {
      if (value === this.chunkPosts.length - 1) {
        this.$emit('toFinalChunk')
      }
    }
  },
  methods: {
    nextChunk () {
      this.currentIndex += 1
      sendGaEvent('click', `${this.$route.name}_readr`, 'article more')
    }
  }
}
</script>
<style lang="stylus" scoped>
.posts-slideshow
  .control-bar
    display flex
    justify-content space-between
    margin-top .5em
    &__action
      display flex
      align-items center
      cursor pointer
      &.prev
        img
          transform rotate(-180deg)
      &.next
        margin 0 0 0 auto
      img
        width 30px
        & + span
          margin-left .5em
      span
        color #11b8c9
        & + img
          margin-left .5em
</style>
