<template>
  <BaseLightBox borderStyle="nonBorder" :showLightBox.sync="showDonate" @closeLightBox="closeDonate()">
    <div class="donate-panel">
      <div class="donate-panel__container">
        <div class="donate-panel__wrapper" ref="content">
          <template v-if="get(me, 'id')">
            <div class="donate-panel__content">
              <div class="appreciate"><span v-text="$t('point.DONATE.APPRECIATE')"></span></div>
              <div class="project-name"><span v-text="get(targetItem, 'title')"></span></div>
              <div class="amount">
                <span v-text="$t('point.DONATE.AMOUNT_PREFIX')"></span>
                <input class="amount-input" type="text" v-model="donateAmount">
                <span v-text="$t('point.DONATE.AMOUNT_POSTFIX')"></span>
              </div>
              <div class="alert">
                <span v-text="alertMsg"></span>
                <span v-show="alertMsg" v-text="$t('point.DONATE.GO_DEPOSIT')" class="deposit" @click="goDeposit"></span>
              </div>
              <DonateDetail :rest="currentPoints" :amount="isNaN(donateAmount) ? 0 : typeof(donateAmount) === Number ? donateAmount : Number(donateAmount)"></DonateDetail>
            </div>
            <div class="donate-panel__confirm" :class="{ block: alertMsg, }" @click="goDonate"><span v-text="$t('point.DONATE.CONFIRM')"></span></div>
          </template>
          <template v-else>
            <div class="donate-panel__content">
              <div class="appreciate"><span v-text="$t('point.DONATE.HAVE_TO_LOGIN')"></span></div>
            </div>
            <div class="donate-panel__confirm" @click="goLogin"><span v-text="$t('point.DONATE.LOG_IN')"></span></div>
          </template>
        </div>
        <div class="donate-panel__container__continue" :class="{ active: !isBottom, }" @click="goFurther"></div>
      </div>
    </div>
  </BaseLightBox>
</template>
<script>
  import BaseLightBox from 'src/components/BaseLightBox.vue'
  import DonateDetail from 'src/components/point/DonateDetail.vue'
  import { ROLE_MAP, } from 'src/constants'
  import { POINT_OBJECT_TYPE, DONATION_POINT_MIN_LINE, } from 'api/config'
  import { get, filter, } from 'lodash'

  const DEFAULT_DONATION_POINT_MIN_LINE = DONATION_POINT_MIN_LINE || -100
  const debug = require('debug')('CLIENT:Donate')
  const deductPoints = (store, { objectId, points, } = {}) => {
    const isPointNumeric = typeof(points) === 'number'
    return store.dispatch('ADD_REWARD_POINTS_TRANSACTIONS', {
      params: {
        object_type: POINT_OBJECT_TYPE.PROJECT,
        object_id: objectId,
        points: isPointNumeric ? points : Number(points) ,
      },
    })
  }    
  const switchOff = store => store.dispatch('SWITCH_OFF_DONATE_PANEL', {})
  export default {
    name: 'Donate',
    components: {
      BaseLightBox,
      DonateDetail,
    },
    computed: {
      currentPoints () {
        return get(this.$store, 'state.personalPoints.points', 0)
      },       
      defaultAmount () {
        return get(this.targetItem, 'memoPoints', 20)
      },
      isActive () {
        return get(this.$store, 'state.donateFlag.active', false)
      },
      targetItem () {
        return get(this.$store, 'state.donateFlag.item', {})
      },
      me () {
        return get(this.$store, 'state.profile', {})
      },
    },
    data () {
      return {
        alertMsg: '',
        donateAmount: 0,
        isBottom: false,
        showDonate: false,
      }
    },
    methods: {
      closeDonate () {
        // this.showDonate = false
        switchOff(this.$store).then(() => {
          this.$router.push(`/series/${get(this.$route, 'params.slug')}`)
        })
      },
      checkDonateAmount () {
        if (isNaN(this.donateAmount)) {
          this.alertMsg = this.$t('point.DONATE.NOT_NUM')
        } else if (this.currentPoints - this.donateAmount < DEFAULT_DONATION_POINT_MIN_LINE) {
          /** show alert */
          let message = `${this.$t('point.DONATE.NOT_ENOUGH')}`
          message += `${this.$t('point.DONATE.CURRENT_PREFIX')} `
          message += `${this.currentPoints} `
          message += `${this.$t('point.DONATE.CURRENT_POSTFIX')}`
          this.alertMsg = message
        } else if (this.donateAmount < this.defaultAmount) {
          let message = `${this.$t('point.DONATE.LIMIT_PREFIX')} `
          message += `${this.defaultAmount} `
          message += `${this.$t('point.DONATE.LIMIT_POSTFIX')}`
          this.alertMsg = message
        } else {
          this.alertMsg = ''
        }
      },
      get,
      goDonate () {
        if (this.alertMsg || !get(this.targetItem, 'id') || !(`${this.donateAmount}`).trim()) { return }
        deductPoints(this.$store, {
          objectId: get(this.targetItem, 'id'),
          points: this.donateAmount,
        }).then(() => {
          this.closeDonate()
        })
      },
      goDeposit () {
        switchOff(this.$store).then(() => {
          const memberCenter = get(filter(ROLE_MAP, { key: get(this.$store, 'state.profile.role'), }), '0.route', 'member')
          this.$router.push(`/${memberCenter}/records/point-manager`)
        })
      },
      goFurther () {
        // ToDo: Make it smoothy
        this.$refs.content.scrollTop = this.$refs.content.scrollTop + 30
      },
      goLogin () {
        this.$router.push('/login')
      },
    },
    beforeMount () {
      this.isActive && (this.showDonate = true)
    },
    mounted () {
      this.donateAmount = get(this.targetItem, 'memoPoints', 20)
      this.$refs.content.addEventListener('scroll', event => {
        this.isBottom = event.target.scrollHeight <= event.target.scrollTop + event.target.clientHeight + 20
      })
    },
    watch: {
      currentPoints () {
        this.checkDonateAmount()
      },
      defaultAmount () {
        this.donateAmount = get(this.targetItem, 'memoPoints', 20)
      },
      donateAmount () {
        debug('Mutation detected: donateAmount', this.donateAmount)
        debug('currentPoints', this.currentPoints)
        this.checkDonateAmount()
      },
      isActive () {
        this.showDonate = this.isActive
      },
    },
  }
</script>
<style lang="stylus" scoped>
  .donate-panel
    position relative
    width 500px
    height 400px
    border 5px solid #fff
    background-color #ddcf21
    padding 0 35px 0 157px
    background-image url(/public/icons/sponsor2.png)
    background-repeat no-repeat
    background-size auto 200px
    background-position 0 140px
    &__container
      display flex
      flex-direction column
      width 100%
      height 100%
      padding 50px 0
      overflow hidden
      position relative
      &__continue
        cursor pointer
        background linear-gradient(to top, #ddcf21 0%, rgba(255,255,255,0) 100%)
        position absolute
        bottom 45px
        left 0
        width 100%
        height 30px
        display none
        justify-content center
        &.active
          display flex
        &::after, &::before
          content ''
          display block
          width 30px
          height 30px
        &::before
          background-color #444746
          position absolute
          left 50%
          top 0
          margin-left -15px
          opacity 0.5
        &::after
          position relative
          background-image url(/public/icons/continue.png)
          background-position center center
          background-size contain
          background-repeat no-repeat
    &__wrapper
      width 100%
      height 100%
      overflow auto
      padding-bottom 30px
    &__content
      flex 1
      font-size 1.125rem
      line-height normal
      // .appreciate
      .project-name
        margin-top 5px
        margin-bottom 5px
        font-size 1.875rem
        font-weight 600
        line-height normal
        color #fff
      .amount
        margin-top 30px
        &-input
          margin 0 10px
          width 100px
          font-size 1.875rem
          color #fff
          vertical-align bottom
          background-color #ccbf26
          border 1px solid #ccbf26
          border-radius 5px
          text-align center
      .alert
        font-size 0.75rem
        margin-top 5px
        .deposit
          cursor pointer
          color #fff
          &:hover
            text-decoration underline

    &__confirm
      height 75px
      background-color #fff
      color #ddcf21
      cursor pointer
      display flex
      justify-content center
      align-items center
      box-shadow 0 0 15px rgba(0, 0, 0, 0.15)
      border-radius 5px
      &:hover
        box-shadow 0 0 15px rgba(255, 255, 255, 0.4)
      &.block
        cursor not-allowed
      span
        font-size 1.875rem
        font-weight 600
        line-height normal
</style>