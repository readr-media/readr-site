<template>
  <li class="list-item">
    <a class="list-item__wrapper wrapper" :href="href" target="_blank">
      <div class="wrapper__img-wrapper img-wrapper">
        <img :src="img" class="img-wrapper__img">
      </div>
      <p class="wrapper__title" v-text="title"></p>
    </a>
  </li>
</template>

<script>
import { get, } from 'lodash'
import { getArticleAuthorNickname, getArticleAuthorThumbnailImg, } from 'src/util/comm'
import { SITE_FULL, } from 'src/constants'

export default {
  props: {
    item: {
      type: Object,
      default () {
        return {}
      },
    },
  },
  computed: {
    isEditorsProfile () {
      return get(this.item, 'nickname', '') !== ''
    },
    href () {
      return this.isEditorsProfile ? `${SITE_FULL}/profile/${get(this.item, 'id', '')}` : `${SITE_FULL}/series/${get(this.item, 'slug', '')}`
    },
    title () {
      const title = get(this.item, 'title', '')
      const nickname = getArticleAuthorNickname(this.item)
      return this.isEditorsProfile ? nickname : title
    },
    img () {
      return this.isEditorsProfile ? getArticleAuthorThumbnailImg(this.item) : this.item.heroImage
    },
  },
}
</script>

<style lang="stylus" scoped>
.wrapper
  &__title
    font-size 16px
    line-height 1.5
    text-align center
    color #000000
    margin 5px 0

.img-wrapper
  position relative
  padding-bottom 67.25% /* 57.5 / 85.5 */
  height 0
  background-color #444746
  &__img
    position absolute
    top 0
    left 0
    width 100%
    height 100%
    object-fit contain
</style>