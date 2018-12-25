<template>
  <div class="poll">
    <template v-if="poll">
      <!-- <img v-if="poll.image" src="" :alt="poll.title"> -->
      <h1 v-text="poll.title"></h1>
      <p v-text="poll.description"></p>
      <p v-if="poll.createdBy.nickname" class="small" v-text="`${$t('POLL.CREATED_BY')}：${poll.createdBy.nickname}`"></p>
      <p class="small" v-text="`${moment(poll.startAt).format('YYYY/MM/DD HH:mm')} ${$t('POLL.START_AT')}`"></p>
      <!-- <p class="small">#</p> -->
      <div v-if="choices.length > 0" class="poll__choices">
        <PollChoice
          v-for="(choice, index) in choices"
          :key="`${choice.pollId}-${choice.id}`"
          :choice="choice"
          :chosenChoices="chosenChoices"
          :ending="ending"
          :index="index"
          :poll="poll"
          :showResult="showResult"
          @end="end"
          @unvote="unvote"
          @vote="vote" />
      </div>
      <div class="poll__end">
        <p class="small">{{ `${moment(poll.endAt).format('YYYY/MM/DD HH:mm')} ${$t('POLL.END_AT')}` }}</p>
        <p class="small">{{ `${poll.totalVote} ${$t('POLL.VOTES')}` }}</p>
      </div>
      <div :class="{ open: openShare }" class="poll__share">
        <button @click="openShare = !openShare" v-text="$t('POLL.SHARE')"></button>
        <input type="text" v-model="iframeCode" readonly @click="selectAll">
      </div>
    </template>
  </div>
</template>
<script>
import PollChoice from './PollChoice.vue'
import moment from 'moment'
import { POLL_FREQUENCY, } from 'api/config'
import { SITE_DOMAIN, SITE_DOMAIN_DEV, } from 'src/constants'
import { currEnv, } from 'src/util/comm'

const fetchChosenChoices = (store, params) => store.dispatch('FETCH_CHOSEN_CHOICES', params)

const vote = (store, {
  choiceId,
  pollId,
} = {}) => {
  return store.dispatch('VOTE', {
    action: 'add',
    active: true,
    choiceId: choiceId,
    memberId: store.state.profile.id,
    pollId: pollId,
  })
}

const unvote = (store, {
  id,
  choiceId,
  pollId,
} = {}) => {
  return store.dispatch('UNVOTE', {
    action: 'minus',
    active: false,
    choiceId: choiceId,
    id: id,
    memberId: store.state.profile.id,
    pollId: pollId,
  })
}

export default {
  name: 'PollContainer',
  components: {
    PollChoice,
  },
  props: {
    initialPoll: {
      type: Object,
    },
  },
  data () {
    return {
      ending: false,
      openShare: false,
      poll: this.initialPoll,
      showResult: false,
    }
  },
  computed: {
    choices () {
      return (this.poll ? this.poll.choices : []) || []
    },
    choicesStyle () {
      const hasImage = this.choices.find(choice => choice.image)
      if (hasImage) {
        return 'image'
      }
      // else if (!hasImage && this.choices.length === 2) {
      //   return 'pk'
      // }
      return ''
    },
    chosenChoices () {
      return this.$store.state.chosenChoices || []
    },
    frequencyStartTime () {
      if (this.poll.frequency === POLL_FREQUENCY.WEEKLY) {
        return moment().startOf('week').toISOString().replace('.000', '')
      } else if (this.poll.frequency === POLL_FREQUENCY.DAILY) {
        return moment().startOf('day').toISOString().replace('.000', '')
      }
      return
    },
    frequencyEndTime () {
      if (this.poll.frequency === POLL_FREQUENCY.WEEKLY) {
        return moment().endOf('week').toISOString().replace('.999', '')
      } else if (this.poll.frequency === POLL_FREQUENCY.DAILY) {
        return moment().endOf('day').toISOString().replace('.999', '')
      }
      return
    },
    iframeCode () {
      const domain = currEnv() === 'dev' ? `http://${SITE_DOMAIN_DEV}` : `https://${SITE_DOMAIN}`
      return `<iframe width="540" height="400" src="${domain}/embed/poll/${this.poll.id}" frameborder="0"></iframe>`
    },
  },
  watch: {
    chosenChoices (value) {
      // correct poll's total vote amount 
      if (this.poll.totalVote < value.length) {
        this.poll.totalVote = value.length
      }
      if (value.length > 0) {
        value.map(chosenChoice => {
          const choiceInfoFromPoll = this.poll.choices.find(choice => choice.id === chosenChoice.choiceId)
          if (choiceInfoFromPoll.totalVote < 1) {
            choiceInfoFromPoll.totalVote += 1
          }
        })
        this.showResult = true
      } 
    },
  },
  beforeMount () {
    const now = new Date()
    const end = new Date(this.poll.endAt)
    if (now >= end) {
      this.ending = true
      this.showResult = true
    }
    if (this.$store.state.profile.id) {
      fetchChosenChoices(this.$store, this.buildChosenChoicesParams())
    }
  },
  methods: {
    moment,
    buildChosenChoicesParams () {
      const params = {
        active: 1,
        memberId: this.$store.state.profile.id,
        pollId: `in:[${this.poll.id}]`,
      }
      if (this.poll.frequency !== POLL_FREQUENCY.ONCE) {
        params.createdAt = `gte:${this.frequencyStartTime},lt:${this.frequencyEndTime}`
      }
      return params
    },
    end () {
      this.showResult = true
      this.ending = true
    },
    selectAll (e) {
      e.target.select()
    },
    unvote (id, choiceId) {
      unvote(this.$store, { id: id, choiceId: choiceId, pollId: this.poll.id, })
      .then(() => {
        setTimeout(() => {
          fetchChosenChoices(this.$store, this.buildChosenChoicesParams())
        }, 1000)
      })
    },
    vote (choiceId) {
      vote(this.$store, { choiceId: choiceId, pollId: this.poll.id, })
      .then(() => {
        this.showResult = true
        setTimeout(() => {
          fetchChosenChoices(this.$store, this.buildChosenChoicesParams())
        }, 1000)
      })
    },
  },
}
</script>
<style lang="stylus" scoped>
template-color = #11b8c9

.poll
  width 100%
  height 100%
  padding 20px 15px
  color #fff
  text-align justify
  line-height 1.67
  background-color template-color
  > img
    margin-bottom 30px
  > h1
    margin 0 0 15px
    font-size .9375rem
    font-weight 500
  p
    margin 0
    font-size .8125rem
    & + p
      margin-top 1em
    &.small
      font-size .75rem
      line-height 1
      font-family Monaco, Consolas
      + p
        margin-top .5em
  &__choices
    margin-top 25px
    // &.pk
    //   display flex
  &__end
    display flex
    justify-content space-between
    margin-top 15px
    p.small
      & + p
        margin-top 0
  &__share
    display flex
    justify-content center
    flex-wrap wrap
    margin-top 50px
    &.open
      button
        color #11b8c9
        background-color #fff
      input
        display inline-block
    button
      padding .5em 1em
      color #fff
      font-size .75rem
      letter-spacing 1px
      background-color transparent
      border 1px solid #fff
      outline none
    input
      display none
      width 100%
      padding .2em
      margin-top 20px
      color #9b9b9b
      text-align left
      font-size .5625rem
      background-color #fff
      cursor pointer
      outline none

@media (min-width 500px)
  .poll
    width 500px
    margin 0 auto
    > h1
      font-size 1.125rem
    p
      font-size 1rem
</style>
