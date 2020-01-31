<template>
  <section class="about">
    <Intro />
    <CoreValues />
    <TeamMembers class="about__team-members" />
    <Timeline />
  </section>
</template>

<script>
import { SITE_NAME } from 'src/constants'
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
    title: '關於我們',
    meta: [
      { vmid: 'og:title', property: 'og:title', content: `關於我們 - ${SITE_NAME}` },
      { vmid: 'og:type', property: 'og:type', content: 'article' }
    ]
  }
}
</script>

<style lang="stylus" scoped>
.about
  background-color white
  &__team-members
    margin 50px 0 0 0
</style>
