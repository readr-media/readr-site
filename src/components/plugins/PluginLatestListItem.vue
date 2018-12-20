<template>
  <li class="list-item">
    <a class="list-item__wrapper wrapper" :href="href" target="_blank">
      <div :class="`wrapper__img-wrapper img-wrapper img-wrapper--${listItemType}`">
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
    listItemType: {
      type: String,
      default: 'editor',
    },
  },
  computed: {
    isEditorsProfile () {
      return this.listItemType === 'editor'
    },
    href () {
      return this.isEditorsProfile ? `${SITE_FULL}/profile/${get(this.item, 'id', '')}?rref=mmarticle` : `${SITE_FULL}/series/${get(this.item, 'slug', '')}?rref=mmarticle`
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
  height 0
  background-color #444746
  &--editor
    padding-bottom 100% /* 1 / 1 */
  &--project
    padding-bottom 52.5% /* 630 / 1200 */
  &__img
    position absolute
    top 0
    left 0
    width 100%
    height 100%
    object-fit cover
</style>