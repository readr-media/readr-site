<template>
  <section class="controlBar">
    <div class="controlBar__btnBox" :class="{ open: openBtnBox }">
      <button class="controlBar--btn" @click="$_baseControlBar_btnBoxToggle">新增評論</button>
      <button class="controlBar--subBtn first" @click="$_baseControlBar_addPost">直接新增</button>
      <button class="controlBar--subBtn second">編輯草稿</button>
    </div>
    <button class="controlBar--btn">文章管理</button>
    <button class="controlBar--btn">記錄管理</button>
    <button class="controlBar--btn" @click="$_baseControlBar_addAccount" v-if="$can('addAccount')">新增帳號</button>
    <button class="controlBar--btn" @click="$_baseControlBar_manageAccount" v-if="$can('memberManage')">帳號管理</button>
  </section>
</template>
<script>
  export default {
    name: 'TheBaseControlBar',
    data () {
      return {
        openBtnBox: false
      }
    },
    methods: {
      $_baseControlBar_addPost () {
        this.$emit('addPost')
      },
      $_baseControlBar_addAccount () {
        this.$emit('addAccount')
      },
      $_baseControlBar_manageAccount () {
        this.$emit('manageAccount')
      },
      $_baseControlBar_btnBoxToggle () {
        this.openBtnBox = !this.openBtnBox
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
    &.open
      width 300px
      .controlBar--btn
        color #fff
        background-color #808080
      .controlBar--subBtn
        z-index auto
        transition-timing-function ease-in-out
        &.first
          transition-duration .7s
          transform translate3d(100px, 0, 0)
        &.second
          transition-duration .7s
          transform translate3d(200px, 0, 0)
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
      border-left none
    &:last-of-type
      border-left none
    
      
</style>
