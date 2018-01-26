<template>
  <section class="controlBar">
    <div class="controlBar__btnBox">
      <button class="controlBar--btn" v-text="wording.WORDING_CONTROLBAR_ADD_POST"></button>
      <button class="controlBar--subBtn first" @click="$_baseControlBar_addPost" v-text="wording.WORDING_CONTROLBAR_ADD_POST_DIRECTLY"></button>
      <button class="controlBar--subBtn second" @click="$_baseControlBar_editDraft" v-text="wording.WORDING_CONTROLBAR_EDIT_DRAFT"></button>
    </div>
    <button v-if="$can('editOtherPost')" class="controlBar--btn" @click="$_baseControlBar_openPanel('posts')" v-text="wording.WORDING_CONTROLBAR_POST_MANAGE"></button>
    <button v-if="$can('editVideo')" class="controlBar--btn" @click="$_baseControlBar_openPanel('video')" v-text="wording.WORDING_CONTROLBAR_VIDEO_MANAGE"></button>
    <button class="controlBar--btn" @click="$_baseControlBar_openPanel('record')" v-text="wording.WORDING_CONTROLBAR_RECORD_MANAGE"></button>
    <button v-if="$can('addAccount')" class="controlBar--btn" @click="$_baseControlBar_addAccount" v-text="wording.WORDING_CONTROLBAR_ADD_ACCOUNT"></button>
    <button v-if="$can('memberManage')" class="controlBar--btn" @click="$_baseControlBar_openPanel('accounts')" v-text="wording.WORDING_CONTROLBAR_ACCOUNT_MANAGE"></button>
  </section>
</template>
<script>
  import {
    WORDING_CONTROLBAR_ACCOUNT_MANAGE,
    WORDING_CONTROLBAR_ADD_ACCOUNT,
    WORDING_CONTROLBAR_ADD_POST,
    WORDING_CONTROLBAR_ADD_POST_DIRECTLY,
    WORDING_CONTROLBAR_EDIT_DRAFT,
    WORDING_CONTROLBAR_POST_MANAGE,
    WORDING_CONTROLBAR_RECORD_MANAGE,
    WORDING_CONTROLBAR_VIDEO_MANAGE,
  } from '../constants'

  export default {
    name: 'TheBaseControlBar',
    data () {
      return {
        wording: {
          WORDING_CONTROLBAR_ACCOUNT_MANAGE,
          WORDING_CONTROLBAR_ADD_ACCOUNT,
          WORDING_CONTROLBAR_ADD_POST,
          WORDING_CONTROLBAR_ADD_POST_DIRECTLY,
          WORDING_CONTROLBAR_EDIT_DRAFT,
          WORDING_CONTROLBAR_POST_MANAGE,
          WORDING_CONTROLBAR_RECORD_MANAGE,
          WORDING_CONTROLBAR_VIDEO_MANAGE
        }
      }
    },
    methods: {
      $_baseControlBar_addPost () {
        this.$emit('addPost')
      },
      $_baseControlBar_addAccount () {
        this.$emit('addAccount')
      },
      $_baseControlBar_editDraft () {
        this.$emit('editDraft')
      },
      $_baseControlBar_openPanel (panel) {
        this.$emit('openPanel', panel)
      }
    }
  }
</script>
<style lang="stylus" scoped>
.controlBar
  display flex
  margin-bottom 32px

  button
    outline none

  &__btnBox
    display flex
    position relative
    width 100px
    margin-right 10px
    cursor pointer
    transition width .5s ease-in-out
    &:hover
      .controlBar--btn
        color #fff
        background-color #808080
      .controlBar--subBtn
        z-index auto
        transition-timing-function ease-in-out
        &.first
          transition-duration .3s
          transform translate3d(0, 30px, 0)
        &.second
          transition-duration .3s
          transform translate3d(0, 60px, 0)
    .controlBar--btn
      margin 0

  &--btn
    width 100px
    height 30px
    margin 0 5px
    font-size 18px
    background-color #fff
    border 1px solid #d3d3d3
    cursor pointer
    transition all .5s ease-in-out
    &:first-of-type
      margin-left 0
    &:last-of-type
      margin-right 0
  
  &--subBtn
    position absolute
    top 0
    left 0
    z-index -1
    width 100px
    height 30px
    font-size 18px
    background-color #fff
    border 1px solid #d3d3d3
    cursor pointer
    &:nth-of-type(2)
      border-top none
    &:last-of-type
      border-top none
    
      
</style>
