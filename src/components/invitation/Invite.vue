<template>
  <div class="invite" :class="{ off: !isOn }">
    <div class="invite__container" :class="{ sent: isSent }">
      <template v-if="isOn">
        <div class="invite__icon"></div>
        <div class="invite__title" v-text="$t('INVITATION.TITLE')"></div>
        <div class="invite__form">
          <div class="item title" v-text="$t('INVITATION.EMAIL_ADDRESS')"></div>
          <TextItem class="item input" v-for="i in 5"
            :height="'25px'"
            :border="'solid 1px #d3d3d3'"
            :disabled="isSent || isProcessing"
            :backgroundColor="inputBackgroundColor(i)"
            :fontSize="'0.75rem'"
            :placeHolder="$t('INVITATION.EMAIL_EXAMPLE')"
            :value.sync="emails[ i ]"
            :key="`email${i}`"></TextItem>
        </div>
        <div class="invite__btn__container">
          <div class="invite__btn" @click="switchOffInvite" :class="{ disabled: isProcessing }">
            <span v-show="!isProcessing" v-text="$t('INVITATION.BTN_CANCEL')"></span>
            <Spinner :show="isProcessing" height="22px"></Spinner>
          </div>
          <div class="invite__btn" @click="goInvite" :class="{ disabled: isProcessing }">
            <span v-show="!isProcessing" v-text="$t('INVITATION.BTN_SUBMIT')"></span>
            <Spinner :show="isProcessing" height="22px"></Spinner>
          </div>
        </div>      
      </template>
      <template v-else>
        <div class="invite__sent">
          <div class="invite__icon"></div>
          <span v-text="$t('INVITATION.SENT')" v-if="isSent"></span>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
  import Spinner from 'src/components/Spinner.vue'
  import TextItem from 'src/components/form/TextItem.vue'
  import { get, map, } from 'lodash'

  const debug = require('debug')('CLIENT:Invite')
  const turnOffInvitation = (store, { params, }) => {
    return store.dispatch('INVITATION_SWITCH_OFF', {
      params,
    })
  }

  export default {
    name: 'Invite',
    components: {
      Spinner,
      TextItem,
    },
    computed: {
      isOn () {
        return get(this.$store, 'state.invitation_switch_status')
      },
    },
    data () {
      return {
        isSent: false,
        isProcessing: false,
        emails: {},
        emailsStatus: {},
      }
    },
    methods: {
      goInvite () {
        debug('Go invite and create inviting process.')
        this.isProcessing = true
        this.emailsStatus[ 0 ] = {}
        this.emailsStatus[ 0 ].status = 1
        map(this.emails, (item, index) => {
          this.emailsStatus[ index ] = {}
          debug('this.emailsStatus', this.emailsStatus, index)
          return new Promise(resolve => {
            setTimeout(() => {
              this.emailsStatus[ index ].status = 2
              this.emailsStatus[ index + 1 ] && (this.emailsStatus[ index + 1 ].status = 1)
              this.$forceUpdate()
              resolve()
            }, 2000 * index)
          })
        })
      },
      inputBackgroundColor (index) {
        debug(index, get(this.emailsStatus, [ index, 'status', ], 0))
        return get(this.emailsStatus, [ index, 'status', ], 0) !== 0
                ? get(this.emailsStatus, [ index, 'status', ], 0) === 1
                ? '#faf4a5'
                : '#caeec7'
                : undefined
      },
      switchOffInvite () {
        turnOffInvitation(this.$store, {})
      },
    },
    mounted () {},
  }
</script>
<style lang="stylus" scoped>
  .invite
    background-color #fff
    margin-bottom 40px
    display flex
    transition all 0.5s
    height 450px
    overflow hidden
    &.off
      height 90px

    &__icon
      height 35px
      background-image url(/public/icons/invitation.png)
      background-position center center
      background-size contain
      background-repeat no-repeat
      margin-bottom 10px
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
      height 22px
      &:hover
        background-color #b2b093
      &.disabled
        background-color #cecece
        
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