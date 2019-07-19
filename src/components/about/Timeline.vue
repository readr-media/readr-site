<template>
  <section class="timeline">
    <ol class="timeline__events-list events-list">
      <li>
        <div class="events-list__title">
          大事記
        </div>
      </li>
      <li
        v-for="i in 10"
        :key="i"
      >
        <TimelineEvent :order="i" />
      </li>
    </ol>
    <footer />
  </section>
</template>

<script>
import TimelineEvent from './TimelineEvent.vue'

export default {
  components: {
    TimelineEvent
  }
}
</script>

<style lang="stylus" scoped>
.timeline
  footer
    height 200px
    background-color #363C5C

.events-list
  max-width 1000px
  height 2590px
  list-style none
  margin 0 auto
  padding 0
  // position relative
  &__title
    width 180px
    height 180px
    border-radius 100%
    background-color #363C5C
    display flex
    justify-content center
    align-items center
    font-size 32px
    font-weight bold
    color white
  li
    width max-content
    position relative
    &:nth-child(1)
      top 50px
      left 200px
      z-index 2
    &:nth-child(2)
      top -30px
    &:nth-child(3)
      top -140px
      left 200px
    &:nth-child(4)
      top -300px
    &:nth-child(5)
      top -500px
      left 200px
    &:nth-child(6)
      top -700px
      left 400px
    &:nth-child(7)
      top -900px
      left 300px
    &:nth-child(8)
      top -900px
      left 0px
    &:nth-child(9)
      top -1000px
      left 200px
    &:nth-child(10)
      top -1200px
      left 600px
    &:nth-child(11)
      top -1300px
      left 500px
</style>
