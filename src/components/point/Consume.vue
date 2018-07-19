<template>
  <BaseLightBox borderStyle="nonBorder" :showLightBox.sync="showMemoDeduction" @closeLightBox="hideMemoDeduction()">
    <div class="project-memo-alert">
      <div class="project-memo-alert__content">
        <h2 v-text="$t('PROJECT.JOIN_CONTENT_1')"></h2>
        <h1 v-text="get(targetItem, 'project.title')"></h1>
        <h2>
          <span v-text="$t('PROJECT.JOIN_CONTENT_2')"></span>
          <strong v-text="get(targetItem, 'project.memoPoints', 0) || 0"></strong>
          <span v-text="$t('PROJECT.JOIN_CONTENT_POINT')"></span>
        </h2>
        <button v-text="memoDeducting ? `${$t('PROJECT.DEDUCTING')} ...` : $t('PROJECT.JOIN_CONFIRM')"
          :disabled="memoDeducting"
          @click="memoDeduct()">
        </button>
      </div>
    </div>
  </BaseLightBox>
</template>
<script>
  import BaseLightBox from 'src/components/BaseLightBox.vue'
  import { POINT_OBJECT_TYPE, } from 'api/config'
  import { get, } from 'lodash'

  const deductPoints = (store, { objectId, memoPoints, } = {}) => {
    return store.dispatch('ADD_REWARD_POINTS_TRANSACTIONS', {
      params: {
        member_id: get(store, [ 'state', 'profile', 'id', ]),
        object_type: POINT_OBJECT_TYPE.PROJECT_MEMO,
        object_id: objectId,
        points: memoPoints,
      },
    })
  }  
  const switchOffDeductionPanel = store => store.dispatch('SWITCH_OFF_CONSUME_PANEL', { active: false, })
  
  export default {
    name: 'Consume',
    components: {
      BaseLightBox,
    },
    computed: {
      isMemoPaid () {
        return get(this.targetItem, 'project.paid')
      },
      isActive () {
        return get(this.$store, 'state.consumeFlag.active', false)
      },
      targetItem () {
        return get(this.$store, 'state.consumeFlag.item', {})
      },
    },
    data () {
      return {
        memoDeducting: false,
        showMemoDeduction: false,
      }
    },
    methods: {
      get,
      memoDeduct () {
        this.memoDeducting = true
        deductPoints(this.$store, {
          objectId: get(this.targetItem, 'projectId'),
          memoPoints: get(this.targetItem, 'project.memoPoints') || 0,
        }).then(() => {
          this.showMemoDeduction = false
          location.reload()
        })        
      },
      hideMemoDeduction () {
        this.showMemoDeduction = false
      },
    },
    mounted () {},
    watch: {
      isActive () {
        this.isActive && (this.showMemoDeduction = true)
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
    &__content
      position absolute
      left 30px
      bottom 60px
      h1
        max-width 290px
        margin 1em 0 0
        color #fff
        font-size 1.875rem
        font-weight 400
        letter-spacing 1px
      h2
        margin 0
        font-size 1.125rem
        strong
          color #fff
          font-size 1.875rem
          margin 0 .2em
      button
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