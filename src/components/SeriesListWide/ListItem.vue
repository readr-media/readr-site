<template>
  <li class="list-item">
    <router-link
      :to="link"
      class="list-item__link link"
    >
      <div class="link__img-wrapper img-wrapper">
        <img
          v-lazy="img"
          class="img-wrapper__img"
          alt=""
        >
      </div>
      <h1 class="link__title">
        {{ title }}
      </h1>
      <p class="link__date">
        {{ date }}
      </p>
      <p class="link__description">
        {{ description }}
      </p>
    </router-link>
  </li>
</template>

<script>
import { get, } from 'lodash'
import moment from 'moment'

export default {
  props: {
    item: {
      type: Object,
      default: () => {},
    },
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
      return get(this.item, 'description', '')
    },
  },
}
</script>

<style lang="stylus" scoped>
.list-item
  width 900px

.link
  color black
  &__title
    margin 20px 0 10px 0
    font-size 24px
    line-height 1.5
    font-weight 400
    text-align center
  &__date
    margin 10px 0
    font-size 14px
    color #979797
    text-align center
  &__description
    font-size 16px
    line-height 1.5
    text-align center

.img-wrapper
  width 100%
  height 472px
  background-color black
  position: relative
  &__img
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
    object-fit cover
</style>
