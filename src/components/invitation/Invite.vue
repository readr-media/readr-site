<template>
  <div class="invite">
    <div class="invite__container" :class="{ sent: isSent }">
      <template v-if="!isSent">
        <div class="invite__title" v-text="$t('INVITATION.TITLE')"></div>
        <div class="invite__form">
          <div class="item title" v-text="$t('INVITATION.EMAIL_ADDRESS')"></div>
          <TextItem class="item input" v-for="i in 5"
            :height="'25px'"
            :border="'solid 1px #d3d3d3'"
            :fontSize="'0.75rem'"
            :placeHolder="$t('INVITATION.EMAIL_EXAMPLE')"
            :key="`email${i}`"></TextItem>
        </div>
        <div class="invite__btn__container">
          <div class="invite__btn" v-text="$t('INVITATION.BTN_CANCEL')"></div>
          <div class="invite__btn" v-text="$t('INVITATION.BTN_SUBMIT')"></div>
        </div>      
      </template>
      <template v-else>
        <div class="invite__sent">
          <span v-text="$t('INVITATION.SENT')"></span>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
  import TextItem from 'src/components/form/TextItem.vue'

  export default {
    name: 'Invite',
    components: {
      TextItem,
    },
    data () {
      return {
        isSent: false,
      }
    },
    methods: {},
    mounted () {},
  }
</script>
<style lang="stylus" scoped>
  .invite
    background-color #fff
    margin-bottom 40px
    display flex
    &__container
      padding 30px 75px 50px
      width 100%
      &.sent
        padding 30px 75px
    &__title
      font-size 1.5rem
      text-align center
    &__form
      margin 35px auto
      .title
        font-family PingFangTC
        font-size 0.9375rem
        font-weight 500
        font-style normal
        font-stretch normal
        line-height normal
        letter-spacing normal
        text-align left
        color #000000
      .input
        margin 15px 0
    &__btn
      background-color #ddcf21
      width 47%
      text-align center
      padding 2px
      color #fff
      cursor pointer
      font-size 0.9375rem
      &:hover
        background-color #b2b093
      &__container
        display flex
        justify-content space-between
    &__sent
      font-family PingFangTC
      font-size 1.5rem
      font-weight 300
      font-style normal
      font-stretch normal
      line-height normal
      letter-spacing normal
      text-align center
      color #000000
</style>