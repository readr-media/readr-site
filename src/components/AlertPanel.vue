<template>
  <section class="alert" :class="{ isCompleted: isCompleted }">
    <template v-if="post">
      <p v-if="(active === 1 || active === 0) && !isCompleted" class="alert__title">
        <strong v-text="alertTitle"></strong>
      </p>
      <p><strong>作者：</strong><span v-text="postAuthor"></span></p>
      <p><strong>標題：</strong><span v-text="postTitle"></span></p>
      <div v-if="(active === 1 || active === 0) && !isCompleted" class="alert__control">
        <button class="alert__btn" @click="$_alertPanel_confirm">確定</button>
        <button class="alert__btn" @click="$_alertPanel_cancel">取消</button>
      </div>
      <p v-if="isCompleted" class="alert--message"><strong v-text="alertMessage"></strong></p>
    </template>
  </section>
</template>
<script>
  import _ from 'lodash'
  export default {
    name: 'AlertPanel',
    props: {
      action: {
        default: undefined
      },
      active: {
        type: Number
      },
      isCompleted: {
        type: Boolean,
        default: false
      },
      post: {
        type: Object
      },
      showLightBox: {
        default: false
      }
    },
    computed: {
      alertMessage () {
        if (this.isCompleted) {
          if (this.active === 0) {
            return `文章已刪除！`
          }
          if (this.active === 1) {
            return `文章已發布！`
          }
          if (this.action === 'add') {
            return `文章已儲存！`
          }
          if (this.action === 'edit' && this.active === 3) {
            return `文章草稿已更新！`
          }
          if (this.action === 'edit' && this.active === 2) {
            return `文章狀態已更新！`
          }
        }
        return ''
      },
      alertTitle () {
        if (this.active === 0) {
          return `你確定要刪除嗎`
        }
        if (this.active === 1) {
          return `你確定要發布嗎`
        }
        return ''
      },
      postAuthor () {
        if (this.action === 'add') {
          return _.get(this.$store.state, [ 'profile', 'nickname' ])
        }
        return _.get(this.post, [ 'author', 'nickname' ])
      },
      postTitle () {
        return _.get(this.post, [ 'title' ])
      }
    },
    watch: {
      showLightBox (val) {
        if (!val) {
          this.$emit('closeEditor')
        }
      }
    },
    methods: {
      $_alertPanel_cancel () {
        this.$emit('closeAlert', false)
      },
      $_alertPanel_confirm () {
        if (this.active === 0) {
          this.$emit('deletePost')
        }
        if (this.active === 1) {
          this.$emit('publishPost')
        }
      }
    }
  }
</script>
<style lang="stylus" scoped>

.alert
  width 325px
  color #000
  font-size 15px
  background #fff
  box-shadow: 1px 1px 2.5px 0 rgba(0, 0, 0, 0.5)
  > p
    margin .8em 25px
  &__control
    display flex
    justify-content space-between
    margin-top 30px
  &__title
    display block
    margin 15px 25px 0
    color #4280a2
  &__btn
    flex 1
    height 30px
    background transparent
    border .5px solid #d3d3d3
    border-collapse collapse
    outline none
    &:first-of-type
      border-right none
  &--message
    color #4280a2

.alert.isCompleted
  > p:first-of-type
    margin-top 15px
  > p:last-of-type
    margin-bottom 15px
</style>