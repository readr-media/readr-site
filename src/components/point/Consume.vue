<template>
  <BaseLightBox borderStyle="nonBorder" :showLightBox.sync="showMemoDeduction" @closeLightBox="hideMemoDeduction()">
    <div class="project-memo-alert">
      <div class="project-memo-alert__content" :class="{ center: !currUser, }" ref="content">
        <template v-if="currUser">  
          <div class="content">
            <h2 v-text="$t('PROJECT.JOIN_CONTENT_1')"></h2>
            <h1 v-text="get(targetItem, 'project.title')"></h1>
            <h2>
              <span v-text="$t('PROJECT.JOIN_CONTENT_2')"></span>
              <strong v-text="pointsNeeded"></strong>
              <span v-text="$t('PROJECT.JOIN_CONTENT_POINT')"></span>
            </h2>
            <div v-if="isDepositNeeded" class="alert">
              <span v-text="$t('PROJECT.NOT_ENOUGH_PREFIX')"></span>
              <span v-text="DEFAULT_DONATION_POINT_MIN_LINE" class="value"></span>
              <span v-text="$t('PROJECT.NOT_ENOUGH_POSTFIX')"></span>
              <span v-text="$t('PROJECT.GO_CLEAR_UP_PREFIX')"></span>
              <span v-text="sum" class="value"></span>
              <span v-text="$t('PROJECT.GO_CLEAR_UP_POSTFIX')"></span>
            </div>
          </div>
          <DonateDetail
            theme="join"
            @resize="checkBottom"
            :rest="currentPoints"
            :amount="pointsNeeded"
            :type="alertType"></DonateDetail>  
          <button v-text="btnWording"
            :disabled="memoDeducting"
            @click="clickHandler">
          </button>
        </template>
        <template v-else>
          <div class="content"><span v-text="$t('PROJECT.HAVE_TO_LOGIN')"></span></div>
          <button v-text="$t('PROJECT.LOG_IN')" @click="goLogin"></button>
        </template>
      </div>
      <div class="project-memo-alert__continue" :class="{ active: !isBottom && currUser, }" @click="goFurther"></div>
    </div>
  </BaseLightBox>
</template>
<script>
  import BaseLightBox from 'src/components/BaseLightBox.vue'
  import DonateDetail from 'src/components/point/DonateDetail.vue'
  import { POINT_OBJECT_TYPE, DONATION_POINT_MIN_LINE, } from 'api/config'
  import { get, } from 'lodash'

  const DEFAULT_DONATION_POINT_MIN_LINE = DONATION_POINT_MIN_LINE || -100

  const debug = require('debug')('CLIENT:Consume')
  const deductPoints = (store, { objectId, memoPoints, } = {}) => {
    return store.dispatch('ADD_REWARD_POINTS_TRANSACTIONS', {
      params: {
        object_type: POINT_OBJECT_TYPE.PROJECT_MEMO,
        object_id: objectId,
        points: memoPoints,
      },
    })
  }  
  const fetchCurrPoints = store => store.dispatch('GET_POINT_CURRENT', { params: {}, })
  const switchOnTappay = (store, item) => store.dispatch('SWITCH_ON_TAPPAY_PANEL', { active: true, item, })
  const switchOffDeductionPanel = store => store.dispatch('SWITCH_OFF_CONSUME_PANEL', { active: false, })
  
  export default {
    name: 'Consume',
    components: {
      BaseLightBox,
      DonateDetail,
    },
    computed: {
      btnWording () {
        if (this.isDepositNeeded) {
          return this.$t('PROJECT.GO_CLEAR_UP')
        } else {
          return this.memoDeducting ? `${this.$t('PROJECT.DEDUCTING')} ...` : this.$t('PROJECT.JOIN_CONFIRM')
        }
      },
      currentPoints () {
        return get(this.$store, 'state.personalPoints.points', 0)
      },  
      currUser () {
        return get(this.$store, 'state.profile.id')
      },           
      extraPointsNeeded () {
        return Math.abs(this.currentPoints - this.pointsNeeded - DEFAULT_DONATION_POINT_MIN_LINE)
      },   
      isActive () {
        return get(this.$store, 'state.consumeFlag.active', false)
      },
      isDonationActive () {
        return get(this.$store, 'state.setting.DONATION_IS_DEPOSIT_ACTIVE', false)
      },      
      isMemoPaid () {
        return get(this.targetItem, 'project.paid')
      },
      isDepositNeeded () {
        debug('this.currentPoints', this.currentPoints)
        debug('DEFAULT_DONATION_POINT_MIN_LINE', DEFAULT_DONATION_POINT_MIN_LINE)
        return this.isDonationActive && this.currentPoints - this.pointsNeeded <= DEFAULT_DONATION_POINT_MIN_LINE
      },
      pointsNeeded () {
        return get(this.targetItem, 'project.memoPoints', 0) || 0
      },
      sum () {
        return Math.abs(this.currentPoints - this.pointsNeeded)
      },
      targetItem () {
        return get(this.$store, 'state.consumeFlag.item', {})
      },
    },
    data () {
      return {
        DEFAULT_DONATION_POINT_MIN_LINE,
        alertType: 1,
        isBottom: false,
        memoDeducting: false,
        showMemoDeduction: false,
      }
    },
    methods: {
      checkBottom () {
        this.isBottom = this.$refs.content.scrollHeight <= this.$refs.content.scrollTop + this.$refs.content.clientHeight + 20
      },
      get,
      goFurther () {
        this.$refs.content.scrollTop = this.$refs.content.scrollTop + 30
      },
      goLogin () {
        switchOffDeductionPanel(this.$store).then(() => {
          this.$router.push('/login')
        })
      },
      clickHandler () {
        debug('CLOSE COMSUME!')
        if (this.isDepositNeeded) {
          switchOnTappay(this.$store, {
            amount: this.sum,
            callback: () => {
              Promise.all([
                deductPoints(this.$store, {
                  objectId: get(this.targetItem, 'projectId'),
                  points: get(this.targetItem, 'project.memoPoints'),
                }),
                switchOffDeductionPanel(this.$store),
              ]).then(() => {
                // this.$router.push(`/series/${get(this.targetItem, 'project.slug')}`)
                location.replace(`/series/${get(this.targetItem, 'project.slug')}`)
              })
            },
          })
        } else {
          this.memoDeduct()
        }
      },
      memoDeduct () {
        this.memoDeducting = true
        deductPoints(this.$store, {
          objectId: get(this.targetItem, 'projectId'),
          memoPoints: get(this.targetItem, 'project.memoPoints'),
        }).then(() => {
          this.showMemoDeduction = false
          // location.reload()
          location.replace(`/series/${get(this.targetItem, 'project.slug')}`)
        })        
      },
      hideMemoDeduction () {
        this.showMemoDeduction = false
      },
    },
    mounted () {
      this.currUser && fetchCurrPoints(this.$store).then(() => {
        debug('GOT CURRENT POINT:', this.currentPoints)
      })
      this.$refs.content.addEventListener('scroll', this.checkBottom)      
      this.checkBottom()
    },
    watch: {
      isActive () {
        if (this.isActive) {
          this.showMemoDeduction = true
        } else {
          this.showMemoDeduction = false
        }
      },
      showMemoDeduction () {
        !this.showMemoDeduction && switchOffDeductionPanel(this.$store)
      },
    },
  }
</script>
<style lang="stylus" scoped>
  .project-memo-alert
    position relative
    min-width 500px
    min-height 400px
    background-color #11b8c9
    background-image url(/public/icons/join.png)
    background-position calc(100% - 20px) center
    background-size 185px auto
    background-repeat no-repeat
    border 5px solid #fff
    &__continue
      cursor pointer
      background linear-gradient(to top, #11b8c9 0%, rgba(255,255,255,0) 100%)
      position absolute
      bottom 40px
      left 30px
      width 290px
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
    &__content
      position absolute
      left 30px
      top 40px
      width 290px
      height calc(100% - 80px)
      line-height normal
      display flex
      flex-direction column
      overflow auto
      padding-bottom 40px
      .content
        flex 1
        .alert
          font-size 0.75rem
          margin 5px 0
          line-height normal
          .value
            margin 0 5px
      &.center
        .content
          display flex
          flex-direction column
          justify-content center
      > div
        width 100%

      h1
        max-width 290px
        margin 1em 0 10px
        color #fff
        font-size 1.875rem
        font-weight 400
        letter-spacing 1px
      h2
        margin 0
        font-size 1.125rem
        line-height normal
        strong
          color #fff
          font-size 1.875rem
          margin 0 .2em
      button
        min-height 64px
        height 64px
        width 290px
        margin-top 30px
        padding 15px 0
        color #11b8c9
        font-size 1.875rem
        background-color #fff
        border none
        transition color .5s
        &:disabled
          color rgba(17, 184, 201, .6)
</style>