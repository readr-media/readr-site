<template>
  <section class="container app-content-area">
    <img
      :src="`/public/2.0/icons/${$route.name}.svg`"
      :alt="metaTitle[$route.name]"
    >
    <article v-html="content" />
  </section>
</template>
<script>
import { AGREEMENT_CONTENT, IPR_CONTENT, PRIVACY_CONTENT } from '../constants/agreement'

const metaTitle = {
  agreement: '服務條款',
  'privacy-rule': '隱私政策',
  'service-rule': '智財政策'
}

const contenStrategies = {
  agreement: AGREEMENT_CONTENT,
  'privacy-rule': PRIVACY_CONTENT,
  'service-rule': IPR_CONTENT
}

export default {
  name: 'AppAgreement',
  metaInfo () {
    return {
      title: metaTitle[this.$route.name]
    }
  },
  data () {
    return {
      metaTitle
    }
  },
  computed: {
    content () {
      return contenStrategies[this.$route.name]
    }
  }
}
</script>
<style lang="stylus" scoped>
.container
  padding 60px 0
  img
    max-width 600px
  article
    margin-top 30px
    >>> h3
      font-size 1.25rem
      & + p
        margin-top .5em
    >>> p, >>> ul, >>> ol
      font-size .875rem
      text-align justify
      line-height 1.86
      word-break break-all
      & + *
        margin-top 1.5em
      & + ul, & + ol
        margin-top .5em
    >>> ul, >>> ol
      padding-left 2em
</style>
