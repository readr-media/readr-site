<template>
  <div class="gdpr">
    <div class="gdpr__info">
      <span>{{ $t('GDPR.MESSAGE') }}<br><router-link to="/agreement">{{ $t('GDPR.LEARN_MORE') }}</router-link></span>
    </div>
    <button @click="setGDPRCookie" v-text="$t('GDPR.ACCEPT')"></button>
  </div>
</template>
<script>
import VueCookie from 'vue-cookie'

export default {
  name: 'AlertGDPR',
  methods: {
    setGDPRCookie () {
      VueCookie.set('gdpr-accept-cookie', 'Y', { expires: '1Y', })
      this.$emit('closeAlertGDPR')
    },
  },
}
</script>
<style lang="stylus" scoped>
  .gdpr
    display flex
    align-items center
    position fixed
    bottom 0
    left 0
    right 0
    z-index 9999
    width 100%
    color #fff
    font-size .875rem
    background-color #444746
    overflow hidden
    > button
      align-self stretch
      padding 1em 1em
      margin 0 0 0 auto
      color #444746
      background-color #ddcf21
      border none
      outline none
      white-space nowrap
      &:hover
        color #1b1c1c
    &__info
      padding 1em 1em
      text-align justify
      line-height 1.67
      a
        color #ddcf21
        font-size .75rem
        cursor pointer

  @media (min-width 800px)
    .gdpr
      font-size 1rem
      > button
        padding 1em 2em
      &__info
        br
          display none
        a
          margin-left 1em
          font-size .875rem
</style>
