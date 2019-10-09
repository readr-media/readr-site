<template>
  <section class="about">
    <Intro />
    <CoreValues />
    <TeamMembers class="about__team-members" />
    <Timeline />
  </section>
</template>

<script>
import Intro from 'src/components/about/Intro.vue'
import CoreValues from 'src/components/about/CoreValues.vue'
import TeamMembers from 'src/components/about/TeamMembers.vue'
import Timeline from 'src/components/about/Timeline.vue'

export default {
  components: {
    Intro,
    CoreValues,
    TeamMembers,
    Timeline
  },
  metaInfo: {
    title: '關於我們'
  }
}
</script>

<style lang="stylus" scoped>
.about
  background-color white
  &__team-members
    margin 50px 0 0 0
</style>
