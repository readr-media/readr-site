<template>
  <div class="content content--report">
    <template v-if="isClientSide">
      <a
        v-if="getReportHeroImageUrl(post)"
        class="content__img"
        :href="getReportLink(post)"
      >
        <img :src="getReportHeroImage(post)" alt="">
      </a>
    </template>
    <h1 class="content__title">
      <a
        :href="getReportLink(post)"
        target="_blank"
        v-text="post.title"
      >
      </a>
    </h1>
    <p class="content__descr">
      <a
        :href="getReportLink(post)"
        target="_blank"
        v-text="getReportContent(post)"
      >
      </a>
    </p>
  </div>
</template>

<script>
import {
  isClientSide,
} from 'src/util/comm'

import {
  getReportContent,
  getReportLink,
  getReportHeroImage,
  getReportHeroImageUrl,
} from 'src/util/post/report'

export default {
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
  computed: {
    isClientSide,
  },
  methods: {
    getReportContent,
    getReportLink,
    getReportHeroImage,
    getReportHeroImageUrl,
  },
}
</script>

<style lang="stylus" scoped>
.content
  a
    color black
  &__title
    font-size 1.125rem
    margin-top 1em
  &__img
    display block
    img
      width 100%
  &__descr
    margin 1.5em 0
    font-size .9375rem
    line-height 1.5
</style>


