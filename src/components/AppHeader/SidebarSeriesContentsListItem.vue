<template>
  <li class="list-item-wrapper">
    <router-link
      :to="`/post/${id}`"
      class="list-item"
    >
      <div class="list-item__img-wrapper img-wrapper">
        <img
          :key="image"
          v-lazy="image"
          alt=""
        >
      </div>
      <div class="list-item__content-wrapper content-wrapper">
        <h1>
          {{ title }}
        </h1>
        <p>
          {{ description }}
        </p>
      </div>
    </router-link>
  </li>
</template>

<script>
import _ from 'lodash'

import { createPost } from 'src/util/post'

export default {
  props: {
    item: {
      type: Object,
      default: () => {},
      required: true
    }
  },
  computed: {
    post () {
      return createPost(this.item)
    },
    id () {
      return _.get(this.post, 'id', '')
    },
    image () {
      return _.get(this.post, [ 'processed', 'ogImgUrl' ], '')
    },
    title () {
      return _.get(this.item, 'ogTitle', '') || _.get(this.item, 'title', '')
    },
    description () {
      return _.get(this.post, 'ogDescription', '')
    }
  }
}
</script>

<style lang="stylus" scoped>
.list-item
  display flex

.img-wrapper
  img
    width 200px
    height 112px
    object-fit cover
    background-color black

.content-wrapper
  margin 0 0 0 20px
  h1
    margin 0
    font-size 24px
    font-weight 400
    line-height 1.3
    color black
  p
    margin 14px 0 0 0
    font-size 16px
    line-height 1.3
    color black
</style>
