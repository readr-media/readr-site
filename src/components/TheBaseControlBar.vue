<template>
  <section class="controlBar">
    <control-bar-button-box
      v-if="$can('addPost')"
      class="controlBar__btnBox"
      :amount="3"
      :style="[ viewport <= 767 ? { width: `calc((100% - (${(amountBtn - 1) * 5}px))/ ${amountBtn})` } : {} ]"
      @changeBtnAmount="$_baseControlBar_btnAmountHandler">
      <button slot="0" class="controlBar--btn" @click="$_baseControlBar_toggleBtnBox" v-text="wordingBtnReview"></button>
      <button slot="1" class="controlBar--subBtn" @click="$_baseControlBar_clickHandler('addReview')" v-text="wording.WORDING_CONTROLBAR_ADD_DIRECTLY"></button>
      <button slot="2" class="controlBar--subBtn" @click="$_baseControlBar_clickHandler('editReview')" v-text="wording.WORDING_CONTROLBAR_EDIT_DRAFT"></button>
    </control-bar-button-box>
    <control-bar-button-box
      v-if="$can('addPost')"
      class="controlBar__btnBox"
      :amount="3"
      :style="[ viewport <= 767 ? { width: `calc((100% - (${(amountBtn - 1) * 5}px))/ ${amountBtn})` } : {} ]"
      @changeBtnAmount="$_baseControlBar_btnAmountHandler">
      <button slot="0" class="controlBar--btn" @click="$_baseControlBar_toggleBtnBox" v-text="wordingBtnNews"></button>
      <button slot="1" class="controlBar--subBtn" @click="$_baseControlBar_clickHandler('addNews')" v-text="wording.WORDING_CONTROLBAR_ADD_DIRECTLY"></button>
      <button slot="2" class="controlBar--subBtn" @click="$_baseControlBar_clickHandler('editNews')" v-text="wording.WORDING_CONTROLBAR_EDIT_DRAFT"></button>
    </control-bar-button-box>
    <control-bar-button-box
      v-if="viewport <= 767"
      class="controlBar__btnBox"
      :amount="4"
      :style="[ viewport <= 767 ? { width: `calc((100% - (${(amountBtn - 1) * 5}px))/ ${amountBtn})` } : {} ]"
      @changeBtnAmount="$_baseControlBar_btnAmountHandler">
      <button slot="0" class="controlBar--btn" @click="$_baseControlBar_toggleBtnBox" v-text="wording.WORDING_CONTROLBAR_MANAGE"></button>
      <button slot="1" class="controlBar--subBtn" v-text="wording.WORDING_CONTROLBAR_POST" @click="$_baseControlBar_openPanel('posts')"></button>
      <button slot="2" class="controlBar--subBtn" v-text="wording.WORDING_CONTROLBAR_VIDEO" @click="$_baseControlBar_openPanel('video')"></button>
      <button slot="3" class="controlBar--subBtn" v-text="wording.WORDING_CONTROLBAR_TAG" @click="$_baseControlBar_openPanel('tag')"></button>
    </control-bar-button-box>
    <control-bar-button-box
      v-if="$can('addAccount') && $can('memberManage') && viewport <= 767"
      class="controlBar__btnBox"
      :amount="3"
      :style="[ viewport <= 767 ? { width: `calc((100% - (${(amountBtn - 1) * 5}px))/ ${amountBtn})` } : {} ]"
      @changeBtnAmount="$_baseControlBar_btnAmountHandler">
      <button slot="0" class="controlBar--btn" @click="$_baseControlBar_toggleBtnBox" v-text="wording.WORDING_CONTROLBAR_ACCOUNT"></button>
      <button slot="1" class="controlBar--subBtn" v-text="wording.WORDING_CONTROLBAR_ADD_DIRECTLY" @click="$_baseControlBar_clickHandler('addAccount')"></button>
      <button slot="2" class="controlBar--subBtn" v-text="wording.WORDING_CONTROLBAR_ACCOUNT_LIST" @click="$_baseControlBar_openPanel('accounts')"></button>
    </control-bar-button-box>
    <control-bar-button
      v-if="$can('editOtherPost') && viewport > 767"
      @changeBtnAmount="$_baseControlBar_btnAmountHandler"
      @click="$_baseControlBar_openPanel('posts')"
      :text="wording.WORDING_CONTROLBAR_POST_MANAGE">
    </control-bar-button>
    <control-bar-button
      v-if="$can('editVideo') && viewport > 767"
      @changeBtnAmount="$_baseControlBar_btnAmountHandler"
      @click="$_baseControlBar_openPanel('video')"
      :text="wording.WORDING_CONTROLBAR_VIDEO_MANAGE">
    </control-bar-button>
    <control-bar-button
      v-if="viewport > 767"
      @changeBtnAmount="$_baseControlBar_btnAmountHandler"
      @click="$_baseControlBar_openPanel('record')"
      :text="wording.WORDING_CONTROLBAR_RECORD_MANAGE">
    </control-bar-button>
    <control-bar-button
      v-if="$can('addAccount') && viewport > 767"
      @changeBtnAmount="$_baseControlBar_btnAmountHandler"
      @click="$_baseControlBar_clickHandler('addAccount')"
      :text="wording.WORDING_CONTROLBAR_ADD_ACCOUNT">
    </control-bar-button>
    <control-bar-button
      v-if="$can('memberManage') && viewport > 767"
      @changeBtnAmount="$_baseControlBar_btnAmountHandler"
      @click="$_baseControlBar_openPanel('accounts')"
      :text="wording.WORDING_CONTROLBAR_ACCOUNT_MANAGE">
    </control-bar-button>
  </section>
</template>
<script>
  import {
    WORDING_CONTROLBAR_ACCOUNT,
    WORDING_CONTROLBAR_ACCOUNT_LIST,
    WORDING_CONTROLBAR_ACCOUNT_MANAGE,
    WORDING_CONTROLBAR_ADD_ACCOUNT,
    WORDING_CONTROLBAR_ADD_DIRECTLY,
    WORDING_CONTROLBAR_ADD_NEWS,
    WORDING_CONTROLBAR_ADD_REVIEW,
    WORDING_CONTROLBAR_EDIT_DRAFT,
    WORDING_CONTROLBAR_MANAGE,
    WORDING_CONTROLBAR_NEWS,
    WORDING_CONTROLBAR_POST,
    WORDING_CONTROLBAR_POST_MANAGE,
    WORDING_CONTROLBAR_RECORD_MANAGE,
    WORDING_CONTROLBAR_REVIEW,
    WORDING_CONTROLBAR_TAG,
    WORDING_CONTROLBAR_VIDEO,
    WORDING_CONTROLBAR_VIDEO_MANAGE
  } from '../constants'
  import ControlBarButton from './ControlBarButton.vue'
  import ControlBarButtonBox from './ControlBarButtonBox.vue'

  export default {
    name: 'TheBaseControlBar',
    components: {
      'control-bar-button': ControlBarButton,
      'control-bar-button-box': ControlBarButtonBox
    },
    data () {
      return {
        amountBtn: 0,
        viewport: 0,
        wording: {
          WORDING_CONTROLBAR_ACCOUNT,
          WORDING_CONTROLBAR_ACCOUNT_LIST,
          WORDING_CONTROLBAR_ACCOUNT_MANAGE,
          WORDING_CONTROLBAR_ADD_ACCOUNT,
          WORDING_CONTROLBAR_ADD_DIRECTLY,
          WORDING_CONTROLBAR_ADD_NEWS,
          WORDING_CONTROLBAR_ADD_REVIEW,
          WORDING_CONTROLBAR_EDIT_DRAFT,
          WORDING_CONTROLBAR_MANAGE,
          WORDING_CONTROLBAR_NEWS,
          WORDING_CONTROLBAR_POST,
          WORDING_CONTROLBAR_POST_MANAGE,
          WORDING_CONTROLBAR_RECORD_MANAGE,
          WORDING_CONTROLBAR_REVIEW,
          WORDING_CONTROLBAR_TAG,
          WORDING_CONTROLBAR_VIDEO,
          WORDING_CONTROLBAR_VIDEO_MANAGE
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
      $_baseControlBar_openPanel (panel) {
        this.$emit('openPanel', panel)
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
    margin 0 2.5px
    font-size 15px
    background-color #fff
    border 1px solid #d3d3d3
    cursor pointer
    transition all .5s ease-in-out
    &:first-of-type
      margin-left 0
    &:last-of-type
      margin-right 0
  
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
        .controlBar--btn
          color #fff
          background-color #808080
        .controlBar--subBtn
          z-index 10


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
