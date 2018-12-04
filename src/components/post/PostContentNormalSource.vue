<template>
  <a
    :class="[ 'source', { 'source--no-source': post.link && !hasSource } ]"
    :href="post.link"
    target="_blank"
  >
    <template v-if="hasSource">
      <div class="source__content content">
        <h1 class="content__title" v-text="linkTitleTrim"></h1>
        <div class="content__descriptions descriptions">
          <p class="descriptions__description" v-text="linkDescriptionTrim"></p>
          <p
            v-if="post.linkName"
            class="descriptions__cite"
          >
            {{ $t('homepage.WORDING_HOME_POST_SOURCE') }}{{ linkNameTrim }}
          </p>
        </div>
      </div>
      <img
        v-if="post.linkImage"
        class="source__link-image"
        :src="post.linkImage"
        @load="setOgImageOrientation(post.linkImage, $event)"
      >
    </template>
    <template v-else-if="post.link && !hasSource">
      {{ decodeURI(post.link) }}
    </template>
  </a>
</template>

<script>
import { get, } from 'lodash'
import { onImageLoaded, } from 'src/util/comm'

export default {
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
  computed: {
    hasSource () {
      return get(this.post, [ 'processed', 'hasSource', ], false)
    },
    linkTitleTrim () {
      return get(this.post, [ 'processed', 'linkTitleTrim', ], '')
    },
    linkDescriptionTrim () {
      return get(this.post, [ 'processed', 'linkDescriptionTrim', ], '')
    },
    linkNameTrim () {
      return get(this.post, [ 'processed', 'linkNameTrim', ], '')
    },
  },
  methods: {
    setOgImageOrientation (src, event) {
      onImageLoaded(src).then(({ width, height, }) => {
        width < height ? event.target.style.objectFit = 'contain' : event.target.style.objectFit = 'cover'
      }).catch(() => { event.target.style.objectFit = 'cover' })
    },
  },
}
</script>

<style lang="stylus" scoped>
.source
  height 102px
  border solid 0.5px #d3d3d3
  padding 8px 15px 5px 19.5px
  display flex
  justify-content space-between
  margin-bottom 15.5px
  &--no-source
    display block
    height auto
    border none
    padding 0
    color gray
    font-size 14px
    word-break break-all
  &__content
    width 300px
    min-width 300px
    max-width 300px
    position relative
    margin 0 20px 0 0
  &__link-image
    margin 0
    display flex
    align-self center
    width 150px
    height 78.5px
    background-color #444746

.content
  &__title
    font-size 14px
    font-weight 500
    color #808080
    margin 0

.descriptions
  &__description
    font-size 14px
    font-weight 300
    color #808080
    line-height 1.4
    margin 5px 0 0 0
    text-align justify
  &__cite
    font-size 14px
    font-weight 300
    color #808080
    align-self flex-end
    position absolute
    bottom 0
    margin 0
</style>


