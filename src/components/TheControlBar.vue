<template>
  <section class="controlBar">
    <control-bar-button-box
      v-if="$can('addPost')"
      class="controlBar__btnBox"
      :amount="3"
      :style="[ viewport <= 767 ? { width: `calc((100% - (${(amountBtn - 1) * 5}px))/ ${amountBtn})` } : {} ]"
      @changeBtnAmount="$_baseControlBar_btnAmountHandler">
      <button slot="0" class="controlBar--btn edit" @click="$_baseControlBar_toggleBtnBox" v-text="wordingBtnReview"></button>
      <button slot="1" class="controlBar--subBtn" @click="$_baseControlBar_clickHandler('addReview')" v-text="wording.WORDING_CONTROLBAR_ADD_DIRECTLY"></button>
      <button slot="2" class="controlBar--subBtn" @click="$_baseControlBar_clickHandler('editReview')" v-text="wording.WORDING_CONTROLBAR_EDIT_DRAFT"></button>
    </control-bar-button-box>
    <control-bar-button-box
      v-if="$can('addPost')"
      class="controlBar__btnBox"
      :amount="3"
      :style="[ viewport <= 767 ? { width: `calc((100% - (${(amountBtn - 1) * 5}px))/ ${amountBtn})` } : {} ]"
      @changeBtnAmount="$_baseControlBar_btnAmountHandler">
      <button slot="0" class="controlBar--btn edit" @click="$_baseControlBar_toggleBtnBox" v-text="wordingBtnNews"></button>
      <button slot="1" class="controlBar--subBtn" @click="$_baseControlBar_clickHandler('addNews')" v-text="wording.WORDING_CONTROLBAR_ADD_DIRECTLY"></button>
      <button slot="2" class="controlBar--subBtn" @click="$_baseControlBar_clickHandler('editNews')" v-text="wording.WORDING_CONTROLBAR_EDIT_DRAFT"></button>
    </control-bar-button-box>
    <control-bar-button-box
      v-if="viewport <= 767"
      class="controlBar__btnBox"
      :amount="5"
      :style="[ viewport <= 767 ? { width: `calc((100% - (${(amountBtn - 1) * 5}px))/ ${amountBtn})` } : {} ]"
      @changeBtnAmount="$_baseControlBar_btnAmountHandler">
      <button slot="0" class="controlBar--btn" @click="$_baseControlBar_toggleBtnBox" v-text="wording.WORDING_CONTROLBAR_MANAGE"></button>
      <button slot="1" class="controlBar--subBtn" :class="[ activePanel === 'record' ? 'active' : '' ]" v-text="wording.WORDING_CONTROLBAR_RECORD" @click="$_baseControlBar_openPanel($event, 'records')"></button>
      <button slot="2" class="controlBar--subBtn" :class="[ activePanel === 'posts' ? 'active' : '' ]" v-text="wording.WORDING_CONTROLBAR_POST" @click="$_baseControlBar_openPanel($event, 'posts')"></button>
      <button slot="3" class="controlBar--subBtn" :class="[ activePanel === 'video' ? 'active' : '' ]" v-text="wording.WORDING_CONTROLBAR_VIDEO" @click="$_baseControlBar_openPanel($event, 'videos')"></button>
      <button slot="4" class="controlBar--subBtn" :class="[ activePanel === 'tag' ? 'active' : '' ]" v-text="wording.WORDING_CONTROLBAR_TAG" @click="$_baseControlBar_openPanel($event, 'tags')"></button>
    </control-bar-button-box>
    <control-bar-button-box
      v-if="$can('addAccount') && $can('memberManage') && viewport <= 767"
      class="controlBar__btnBox"
      :amount="3"
      :style="[ viewport <= 767 ? { width: `calc((100% - (${(amountBtn - 1) * 5}px))/ ${amountBtn})` } : {} ]"
      @changeBtnAmount="$_baseControlBar_btnAmountHandler">
      <button slot="0" class="controlBar--btn" @click="$_baseControlBar_toggleBtnBox" v-text="wording.WORDING_CONTROLBAR_ACCOUNT"></button>
      <button slot="1" class="controlBar--subBtn" v-text="wording.WORDING_CONTROLBAR_ADD_DIRECTLY" @click="$_baseControlBar_clickHandler('addAccount')"></button>
      <button slot="2" class="controlBar--subBtn" v-text="wording.WORDING_CONTROLBAR_ACCOUNT_LIST" @click="$_baseControlBar_openPanel($event, 'accounts')"></button>
    </control-bar-button-box>
    <control-bar-button
      v-if="viewport > 767"
      class="controlBar--btn"
      @changeBtnAmount="$_baseControlBar_btnAmountHandler"
      @click="$_baseControlBar_openPanel($event, 'records')"
      :text="`${wording.WORDING_CONTROLBAR_RECORD}${wording.WORDING_CONTROLBAR_MANAGE}`">
    </control-bar-button>
    <control-bar-button
      v-if="$can('editOtherPost') && viewport > 767"
      class="controlBar--btn"
      @changeBtnAmount="$_baseControlBar_btnAmountHandler"
      @click="$_baseControlBar_openPanel($event, 'posts')"
      :text="`${wording.WORDING_CONTROLBAR_POST}${wording.WORDING_CONTROLBAR_MANAGE}`">
    </control-bar-button>
    <control-bar-button
      v-if="$can('editTag') && viewport > 767"
      class="controlBar--btn"
      @changeBtnAmount="$_baseControlBar_btnAmountHandler"
      @click="$_baseControlBar_openPanel($event, 'tags')"
      :text="`${wording.WORDING_CONTROLBAR_TAG}${wording.WORDING_CONTROLBAR_MANAGE}`">
    </control-bar-button>
    <control-bar-button-box
      v-if="viewport > 767"
      class="controlBar__btnBox"
      :amount="2">
      <button slot="0" class="controlBar--btn" @click="$_baseControlBar_openPanel($event, 'videos')" v-text="`${wording.WORDING_CONTROLBAR_VIDEO}${wording.WORDING_CONTROLBAR_MANAGE}`"></button>
      <button slot="1" class="controlBar--subBtn" v-text="wording.WORDING_CONTROLBAR_ADD_VIDEO" @click="$_baseControlBar_clickHandler('addVideo')"></button>
    </control-bar-button-box>
    <control-bar-button
      v-if="$can('addAccount') && viewport > 767"
      class="controlBar--btn"
      @changeBtnAmount="$_baseControlBar_btnAmountHandler"
      @click="$_baseControlBar_clickHandler('addAccount')"
      :text="wording.WORDING_CONTROLBAR_ADD_ACCOUNT">
    </control-bar-button>
    <control-bar-button
      v-if="$can('memberManage') && viewport > 767"
      class="controlBar--btn"
      @changeBtnAmount="$_baseControlBar_btnAmountHandler"
      @click="$_baseControlBar_openPanel($event, 'accounts')"
      :text="`${wording.WORDING_CONTROLBAR_ACCOUNT}${wording.WORDING_CONTROLBAR_MANAGE}`">
    </control-bar-button>
  </section>
</template>
<script>
  import {
    WORDING_CONTROLBAR_ACCOUNT,
    WORDING_CONTROLBAR_ACCOUNT_LIST,
    WORDING_CONTROLBAR_ADD_ACCOUNT,
    WORDING_CONTROLBAR_ADD_DIRECTLY,
    WORDING_CONTROLBAR_ADD_NEWS,
    WORDING_CONTROLBAR_ADD_REVIEW,
    WORDING_CONTROLBAR_ADD_VIDEO,
    WORDING_CONTROLBAR_EDIT_DRAFT,
    WORDING_CONTROLBAR_MANAGE,
    WORDING_CONTROLBAR_NEWS,
    WORDING_CONTROLBAR_POST,
    WORDING_CONTROLBAR_RECORD,
    WORDING_CONTROLBAR_REVIEW,
    WORDING_CONTROLBAR_TAG,
    WORDING_CONTROLBAR_VIDEO
  } from '../constants'
  import ControlBarButton from './ControlBarButton.vue'
  import ControlBarButtonBox from './ControlBarButtonBox.vue'

  export default {
    name: 'TheControlBar',
    components: {
      'control-bar-button': ControlBarButton,
      'control-bar-button-box': ControlBarButtonBox
    },
    data () {
      return {
        activePanel: 'record',
        amountBtn: 0,
        viewport: 0,
        wording: {
          WORDING_CONTROLBAR_ACCOUNT,
          WORDING_CONTROLBAR_ACCOUNT_LIST,
          WORDING_CONTROLBAR_ADD_ACCOUNT,
          WORDING_CONTROLBAR_ADD_DIRECTLY,
          WORDING_CONTROLBAR_ADD_NEWS,
          WORDING_CONTROLBAR_ADD_REVIEW,
          WORDING_CONTROLBAR_ADD_VIDEO,
          WORDING_CONTROLBAR_EDIT_DRAFT,
          WORDING_CONTROLBAR_MANAGE,
          WORDING_CONTROLBAR_NEWS,
          WORDING_CONTROLBAR_POST,
          WORDING_CONTROLBAR_RECORD,
          WORDING_CONTROLBAR_REVIEW,
          WORDING_CONTROLBAR_TAG,
          WORDING_CONTROLBAR_VIDEO,
        }
      }
    },
    computed: {
      wordingBtnNews () {
        return this.viewport <= 767 ? this.wording.WORDING_CONTROLBAR_NEWS : this.wording.WORDING_CONTROLBAR_ADD_NEWS
      },
      wordingBtnReview () {
        return this.viewport <= 767 ? this.wording.WORDING_CONTROLBAR_REVIEW : this.wording.WORDING_CONTROLBAR_ADD_REVIEW
      }
    },
    mounted () {
      this.$_baseControlBar_getViewport()
      window.addEventListener('resize', this.$_baseControlBar_getViewport)
    },
    destroyed () {
      window.removeEventListener('resize', this.$_baseControlBar_getViewport)
    },
    methods: {
      $_baseControlBar_btnAmountHandler (isMounted) {
        if (isMounted) {
          this.amountBtn += 1
        } else {
          this.amountBtn -= 1
        }
      },
      $_baseControlBar_clickHandler (eventName) {
        this.$emit(eventName)
      },
      $_baseControlBar_getViewport () {
        this.viewport = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
      },
      $_baseControlBar_openPanel (event, panel) {
        this.activePanel = panel
        this.$emit('openPanel', panel)
        if (this.viewport < 950) {
          event.target.parentNode.classList.remove('active')
        }
      },
      $_baseControlBar_toggleBtnBox (e) {
        if (this.viewport < 950 && _.includes(e.target.parentNode.classList, 'active')) {
          e.target.parentNode.classList.remove('active')
        } else {
          e.target.parentNode.classList.add('active')
        }
      }
    }
  }
</script>
<style lang="stylus" scoped>
.controlBar
  display flex
  margin-bottom 30px

  button
    outline none

  &__btnBox
    display flex
    position relative
    width 90px
    margin-right 5px
    cursor pointer
    transition width .5s ease-in-out
    > button:first-of-type
      z-index 10
    .controlBar--btn
      width 100%
      margin 0
    .controlBar--subBtn
      width calc(100% - 2px)

  &--btn
    width 90px
    height 30px
    padding 0
    margin-right 5px
    color #808080
    font-size 15px
    background-color #fff
    border 1px solid #d3d3d3
    cursor pointer
    transition all .5s ease-in-out
    &:first-of-type
      margin-left 0
  
  &--subBtn
    box-sizing content-box
    position absolute
    top 0
    left 0
    z-index -1
    width 88px
    height 30px
    padding 0
    color #808080
    font-size 12px
    background-color #fff
    border 1px solid #d3d3d3
    cursor pointer
    transition-timing-function ease-in-out
    transition-duration .3s
    &:nth-of-type(2)
      border-top none

@media (max-width 949px)
  .controlBar
    &__btnBox
      &.active
        > button
          &:nth-of-type(2)
            transform translate3d(0, 30px, 0)
          &:nth-of-type(3)
            transform translate3d(0, 60px, 0)
          &:nth-of-type(4)
            transform translate3d(0, 90px, 0)
          &:nth-of-type(5)
            transform translate3d(0, 120px, 0)
        .controlBar--btn.edit
          color #fff 
          background-color #808080 
        .controlBar--subBtn
          z-index 10
    &--subBtn
      &.active
        color #fff
        background-color #808080


@media (min-width 950px)
  .controlBar
    &__btnBox
      width 100px
      &:hover
        .controlBar--btn
          color #fff
          background-color #808080
        .controlBar--subBtn
          z-index auto
          transition-timing-function ease-in-out
        > button
          &:nth-of-type(2)
            transform translate3d(0, 30px, 0)
          &:nth-of-type(3)
            transform translate3d(0, 60px, 0)
          &:nth-of-type(4)
            transform translate3d(0, 90px, 0)
    &--btn
      width 100px
      font-size 18px
    &--subBtn
      width 98px
      font-size 18px
      
</style>
