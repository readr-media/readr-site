<template>
  <div :class="{ ending: ending, finished: finished, selected: selected, }" class="choice">
    <!-- <template v-if="choicesStyle === 'pk'">
      <div class="choice__button">
        <div class="button" @click="select(choice.id)"></div>
        <span v-text="choice.choice"></span>
      </div>
      <dir :style="{ width: `${showResult ? choice.totalVote / poll.totalVote * 370 : 185 }px` }" class="choice__progress">
        {{ showResult ? `${choice.totalVote ? Math.round(choice.totalVote / poll.totalVote * 100) : 0 } %` : '' }} 
      </dir>
    </template> -->
    <div :class="{ multiple: maxChoice > 1 }" class="choice__button">
      <div class="button" @click="select(choice.id)"></div>
    </div>
    <div class="choice__text" @click="select(choice.id)">
      <span v-text="choice.choice"></span>
      <div :style="[showResult ? { width: `${ratio}%` } : {}]" class="progress"></div>
    </div>
    <div class="choice__result">
      {{ showResult ? `${ratio} %` : '' }} 
    </div>
  </div>
</template>
<script>
import VueCookie from 'vue-cookie'
import { POLL_FREQUENCY, } from 'api/config'

export default {
  name: 'PollChoice',
  props: {
    choice: {
      type: Object,
    },
    // choicesStyle: {
    // },
    chosenChoices: {
      type: Array,
    },
    ending: {
      type: Boolean,
      default: false,
    },
    index: {
      type: Number,
    },
    locked: {
      type: Boolean,
    },
    poll: {
      type: Object,
    },
    showResult: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      selected: false,
    }
  },
  computed: {
    changeable () {
      return this.poll.changeable || 0
    },
    chosenChoice () {
      // if (this.choicesStyle === 'pk') {
      //   return this.chosenChoices[0]
      // }
      return this.chosenChoices.find(choice => choice.choiceId === this.choice.id)
    },
    endAt () {
      return new Date(this.poll.endAt) || null
    },
    finished () {
      return !this.changeable && (this.chosenChoices.length >= this.maxChoice)
    },
    frequency () {
      return this.poll.frequency || 0
    },
    maxChoice () {
      return this.poll.maxChoice || 0
    },
    ratio () {
      if (this.choice.totalVote > 0 && this.poll.totalVote > 0) {
        return Math.round(this.choice.totalVote / this.poll.totalVote * 100) > 100 ? 100 : Math.round(this.choice.totalVote / this.poll.totalVote * 100)
      }
      return 0
    },
    startAt () {
      return new Date(this.poll.startAt) || null
    },
  },
  watch: {
    chosenChoices (value) {
      this.selected = value.find(choice => choice.choiceId === this.choice.id)
    },
  },
  methods: {
    select (choiceId) {
      const isLogin = VueCookie.get('csrf')
      if (isLogin) {
        const now = new Date()
        if (now < this.endAt && now >= this.startAt) {
          
          if (!this.locked && this.chosenChoices.length === 1 && this.maxChoice === 1 && this.changeable && !this.selected) {
            this.$emit('voteAndUnvote', this.chosenChoices[0].id, this.chosenChoices[0].choiceId, choiceId)
          } else if (!this.locked && (this.chosenChoices.length < this.maxChoice) && !this.selected) {
            this.selected = true
            this.$emit('vote', choiceId)
          } else if (!this.locked && this.chosenChoice && this.chosenChoice.id && this.frequency === POLL_FREQUENCY.ONCE && this.changeable && this.selected) {
            this.selected = false
            this.$emit('unvote', this.chosenChoice.id, choiceId)
          }
          // else if (this.choicesStyle === 'pk' && this.changeable && !this.selected) {
          //   this.$emit('unvote', this.chosenChoice.id, this.chosenChoice.choiceId)
          //   this.selected = true
          //   this.$emit('vote', choiceId)
          // }
        } else if (now >= this.endAt && !this.showResult) {
          this.$emit('end')
        }
      } else {
        const dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : window.screenX
        const dualScreenTop = window.screenTop != undefined ? window.screenTop : window.screenY
        const width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
        const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;
        window.open('/login-panel', '', `left=${((width / 2) - 250) + dualScreenLeft}, top=${((height / 2) - 300) + dualScreenTop}, width=500, height=600, menubar=no, toolbar=no, location=no, resizable=no, scrollbars=no, status=no`)
      }
    },
  },
}
</script>
<style lang="stylus" scoped>
.choice
  display flex
  color #000
  font-size .8125rem
  & + .choice
    margin-top 10px
  &.selected
    .choice__text
      &::after
        content ''
        position absolute
        top 0
        left 0
        right 0
        bottom 0
        width 100%
        height 100%
        border 3px solid #ddcf21
  &.finished, &.ending
    .choice__text
      cursor default
    .choice__button
      .button
        cursor default
  &__button
    display none
  &__text
    flex 1
    display flex
    flex-wrap wrap
    position relative
    padding .2em .5em
    background-color #fff
    cursor pointer
    span
      display inline-block
      position relative
      z-index 10
      & + span
        flex 1
        margin-left 1em
  &__result
    display flex
    justify-content flex-end
    align-items center
    width 50px
    color #fff
    font-family Monaco, Consolas
    
// .choice.pk
//   &.selected
//     .choice__progress
//       background-color #d3d3d3
//   &.left
//     .choice__button
//       span
//         margin-left 10px
//     .choice__progress
//       border-right 1px solid #d3d3d3
//   &.right
//     .choice__button
//       order 1
//       margin 0 0 0 10px
//       span
//         order 0
//         margin-right 10px
//       .button
//         order 1
//     .choice__progress
//       order 0
//       border-left 1px solid #d3d3d3
//   & + .choice.pk
//     margin-top 0
//   .choice__button
//     justify-content flex-start
//     width 40px
//   .choice__progress
//     display flex
//     justify-content center
//     align-items center
//     width 185px
//     height 100%
//     margin 0
//     padding 0
//     background-color #fff
//     transition width 1s  
.progress
  position absolute
  top 0
  left 0
  width 0%
  height 100%
  background-color #d3d3d3
  transition width 1s 

@media (min-width 500px)
  .choice
    font-size .9375rem
    &.selected
      .choice__button
        &.multiple
          .button
            &::before
              top 3px
              left 3px
              width 9px
              height 9px
              border-radius 3px
        .button
          &::before
            content ''
            position absolute
            top 4px
            left 4px
            width 7px
            height 7px
            border-radius 7px
            background-color #11b8c9
    &__button
      display flex
      justify-content center
      align-items center
      margin-right 10px
      &.multiple
        .button
          border-radius 3px
      .button
        position relative
        width 15px
        height 15px
        background-color #fff
        border-radius 15px
        cursor pointer

</style>
