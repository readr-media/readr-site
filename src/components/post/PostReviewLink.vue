<template>
  <section class="post-review-link">
    <figure v-if="image">
      <img
        :src="image"
        :alt="title"
      >
    </figure>
    <div>
      <a
        :href="link"
        target="_blank"
      >
        <h3 v-text="title || link" />
      </a>
      <a
        v-if="description"
        :href="link"
        target="_blank"
      >
        <p v-text="truncate(description, { length: DEFAULT_DESCRIPTION_LENGTH })" />
      </a>
      <a
        v-if="sourceName"
        :href="link"
        target="_blank"
      >
        <p>{{ `出處：${sourceName}` }}</p>
      </a>
    </div>
  </section>
</template>
<script>
import { truncate } from 'lodash'

const DEFAULT_DESCRIPTION_LENGTH = 50

export default {
  name: 'PostReviewLink',
  props: {
    description: {
      type: String,
      default: ''
    },
    image: {
      type: String,
      default: ''
    },
    link: {
      type: String,
      required: true
    },
    sourceName: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      DEFAULT_DESCRIPTION_LENGTH
    }
  },
  methods: {
    truncate
  }
}
</script>
<style lang="stylus" scoped>
.post-review-link
  position relative
  padding 1em
  background-color #ded120
  &::after
    content ''
    position absolute
    top -17px
    left 50%
    transform translateX(-50%)
    width 0
    height 0
    border-style solid
    border-width 0 10px 17.3px 10px
    border-color transparent transparent #ded120 transparent
  h3, p
    text-align justify
  h3
    font-size 1rem
    font-weight 500
    line-height 1.43
  p
    font-weight 300
    line-height 1.43
  a
    display block
    & + a
      margin-top .5em
  figure
    position relative
    width 100%
    padding-top 56.25%
    & + div
      margin-top .5em
    img
      position absolute
      top 0
      left 0
      right 0
      bottom 0
      width 100%
      height 100%
      object-fit cover
      object-position center

@media (min-width: 1024px)
  .post-review-link
    display flex
    figure
      width 33%
      padding-top calc(33% * 0.5625)
      & + div
        flex 1
        margin 0 0 0 30px
</style>
