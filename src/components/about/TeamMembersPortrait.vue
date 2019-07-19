<template>
  <figure class="figure">
    <img
      :src="`/public/2.0/about/team-members/${name}.png`"
      :alt="name"
    >
    <figcaption
      v-text="title"
    />
  </figure>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="stylus" scoped>
.figure
  background-color transparent
  width 100px
  position relative
  img
    width 100%
    position relative
    bottom 20px
  figcaption
    text-align center
    background-color #69CAD3
    height 50px
    line-height 50px
    position absolute
    bottom 0
    width 100%
</style>
