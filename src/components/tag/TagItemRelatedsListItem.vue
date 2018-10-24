<template>
  <li class="list-item">
    <a :href="url" target="_blank" class="list-item__link">
      <figure class="figure">
        <img class="figure__img" :src="heroImage" alt="">
        <figcaption class="figure__figcaption">
          <p class="figure__figcaption-title" v-text="title"></p>
        </figcaption>
      </figure>
    </a>
  </li>
</template>

<script>
import { get, } from 'lodash'
import { getReportUrl, getFullUrl, } from 'src/util/comm'

export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  computed: {
    title () {
      return get(this.data, 'title', '')
    },
    heroImage () {
      return getFullUrl(get(this.data, 'heroImage', ''))
    },
    url () {
      return getReportUrl(get(this.data, 'slug', ''))
    },
  },
}
</script>

<style lang="stylus" scoped>
.list-item
  position relative
  padding 6px 0
  &__link
    color black

.figure
  display flex
  flex-direction row-reverse
  justify-content space-between
  margin 0
  &__figcaption
    font-size 10px
    padding 0 13.5px 0 0
  &__img
    d = 50px
    width d
    min-width d
    height d
    min-height d
    object-fit cover
  &__figcaption-title
    line-height 1.5
    margin 0
</style>
