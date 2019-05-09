<template>
  <router-link :to="href" :target="target" class="list-item app-list">
    <figure v-if="image">
      <img :src="image" :alt="title">
    </figure>
    <h1 v-if="title" v-text="title"></h1>
    <p v-if="date" class="date small" v-text="date"></p>
    <p v-if="description" class="description" v-text="description"></p>
  </router-link>
</template>
<script>
export default {
  name: 'ListItem',
  props: {
    date: {
      type: String
    },
    description: {
      type: String
    },
    href: {
      type: String,
      required: true
    },
    image: {
      type: String
    },
    target: {
      type: String,
      default: ''
    },
    title: {
      type: String
    }
  }
}
</script>
<style lang="stylus" scoped>
  .list-item
    figure
      position relative
      width 100%
      padding-top 56.25%
      img
        position absolute
        top 0
        left 0
        right 0
        bottom 0
        width 100%
        height 100%
        object-fit cover
        object-position center center
    h1, p
      overflow hidden
    .description
      text-align justify
</style>
