<template>
  <li
    :class="[
      'list-item',
      { 'list-item--narrow': theme === 'narrow' }
    ]"
  >
    <router-link
      class="list-item__link link"
      :to="link"
    >
      <div
        :class="[
          'link__img-wrapper',
          'img-wrapper',
          { 'img-wrapper--narrow': theme === 'narrow' }
        ]"
      >
        <img
          class="img-wrapper__img"
          v-lazy="img"
          alt=""
        >
      </div>
      <div
        :class="[
          'link__content',
          'content',
          { 'content--narrow': theme === 'narrow' }
        ]"
      >
        <h1 class="content__title">
          {{ title }}
        </h1>
        <p class="content__date">
          {{ date }}
        </p>
        <p class="content__description">
          {{ description }}
        </p>
      </div>
    </router-link>
  </li>
</template>

<script>
import { get, truncate, } from 'lodash'
import moment from 'moment'

export default {
  props: {
    item: {
      type: Object,
      default: () => {},
    },
    theme: {
      type: String,
      default: 'normal',
    },
  },
  data () {
    return {
      descriptionLimit: {
        normal: 70,
        narrow: 50,
      },
    }
  },
  computed: {
    link () {
      return '/'
    },
    img () {
      return get(this.item, 'heroImage', '')
    },
    title () {
      return get(this.item, 'title', '')
    },
    date () {
      const date = get(this.item, 'updatedAt', '')
      return moment(date).format('YYYY-MM-DD')
    },
    description () {
      return truncate(get(this.item, 'description', ''), { length: this.descriptionLimit[this.theme], })
    },
  },
}
</script>

<style lang="stylus" scoped>
.list-item
  width 440px
  &--narrow
    width 320px
    background-color white

.content
  color black
  &--narrow
    padding 0 20px 20px 20px
  &__title
    margin 20px 0 10px 0
    font-size 24px
    line-height 1.5
    font-weight 400
  &__date
    margin 10px 0
    font-size 14px
    color #979797
  &__description
    font-size 16px
    line-height 1.5
    text-align justify
    margin 0

.img-wrapper
  width 440px
  height 251px
  background-color black
  &--narrow
    width 320px
    height 184px
  &__img
    width 100%
    height 100%
    object-fit cover
</style>
