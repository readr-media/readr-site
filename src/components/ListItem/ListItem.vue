<template>
  <router-link
    :to="href"
    :target="target"
    class="list-item app-list"
  >
    <figure v-if="image">
      <img
        :src="image"
        :alt="title"
      >
    </figure>
    <h1
      v-if="title"
      v-text="title"
    />
    <p
      v-if="date"
      class="date small"
      v-text="date"
    />
    <p
      v-if="description"
      class="description"
      v-text="description"
    />
  </router-link>
</template>
<script>
export default {
  name: 'ListItem',
  props: {
    date: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    href: {
      type: String,
      required: true
    },
    image: {
      type: String,
      default: ''
    },
    target: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
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

  .list-item.comm-narrow
    padding-bottom 1em
    background-color #fff
    h1, p
      width 90%
      margin-left auto
      margin-right auto
</style>
