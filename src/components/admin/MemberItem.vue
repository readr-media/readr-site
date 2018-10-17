<template>
  <div class="item">
    <slot name="title"></slot>
    <template v-if="!hasTitleSlot">
      <div class="checkbox"><input type="checkbox" @click="toggleCheckboxItem" :ref="`checkboxItems`" :value="index"></div>
      <div class="nickname" v-text="get(member, 'nickname')"></div>
      <div class="email" v-text="get(member, 'mail')"></div>
      <div class="role" v-text="get(roles, get(member, 'role', 1), '-')"></div>
      <div class="actions">
        <div class="actions__guesteditor">
          <div class="ios-style-switch" v-if="canBeCustomEditor(member)">
            <input type='checkbox' class='ios-style-switch__checkbox'
              :id="`checkbox-${get(member, 'id')}`"
              :checked="get(member, 'customEditor')"
              @click="toogleCustomEditor(index, $event)">
            <label :for="`checkbox-${get(member, 'id')}`" class='ios-style-switch__label'></label>
          </div>
        </div>
        <div class="actions__update" v-if="$can('updateAccount')" v-text="$t('admin.WORDING_ADMIN_UPDATE')" @click="update(index)"></div>
        <div class="actions__delete" v-if="$can('deleteAccount')" v-text="$t('admin.WORDING_ADMIN_DELETE')" @click="del(index)"></div>
      </div>
    </template>
  </div>
</template>
<script>
  import { ROLE_MAP, } from 'src/constants'
  import { get, map, } from 'lodash'
  export default {
    name: 'MemberItem',
    computed: {
      hasTitleSlot () {
        return !!this.$slots[ 'title' ]
      },
      roles () {
        const roles = {}
        map(ROLE_MAP, role => {
          roles[ role.key ] = role.value
        })
        return roles
      },
    },
    methods: {
      canBeCustomEditor (m) {
        return get(this.roles, get(m, 'role', 1), '-') !== '會員' && this.get(this.roles, get(m, 'role', 1), '-') !== '-'
      },      
      get,
    },
    mounted () {},
    props: {
      toggleCheckboxItem: {
        type: Function,
        default: () => {},
      },
      toogleCustomEditor: {
        type: Function,
        default: () => {},
      },
      index: {
        type: Number,
      },
      value: {},
      member: {
        type: Object,
      },
      update: {
        type: Function,
        default: () => {},
      },
      del: {
        type: Function,
        default: () => {},
      },
    },
  }
</script>
<style lang="stylus" scoped>
  .item
    > div
      display inline-flex
      justify-content flex-start
      align-items center

      font-size 0.9375rem
      word-break break-all
      vertical-align top
      &.title
        font-size 1.125rem
        font-weight 600
        color #808080
        margin 10px 0
        height 25px
        cursor pointer
        > span
          position relative
          &::before
            content ''
            position absolute
            top 0
            left 100%
            width 15px
            height 100%
            background-position center center
            background-repeat no-repeat
            background-size 7px auto
            background-image url(/public/icons/double-triangle.png)
        &.actions
          > div
            height 100%
            color #fff
            background-color #808080
            border-radius 4px

      &:not(.title)
        padding 5px 10px 5px 0
      &.checkbox
        width 25px
        > input[type="checkbox"]
          vertical-align top
          width 15px
          height 15px
      &.nickname
        width 80px
      &.email
        width 275px
      &.role
        width 63px
      // &.guesteditor
      //   width 100px
      &.actions
        width 240px
        > div
          display inline-flex
          justify-content center
          align-items center
          padding 0 12px
          color #4280a2
          cursor pointer
          margin-right 6.5px
          &.actions__update
            width 60px
          &.actions__delete
            width 60px
          &.actions__guesteditor
            cursor initial
            position relative
            width 100px
            margin-right 0
            background-color transparent
            color #808080
            cursor pointer
            > span
              position relative
              &::before
                content ''
                position absolute
                top 0
                left 100%
                width 15px
                height 100%
                background-position center center
                background-repeat no-repeat
                background-size 7px auto
                background-image url(/public/icons/double-triangle.png)
      &.filter
        width 105px
        position relative
        padding 0
        border 1px solid #808080
        border-radius 4px
        overflow hidden
        background-color #fff
        cursor pointer
        
        &:hover
          padding 0
          border 1px solid rgba(128, 128, 128, 0.5)
          &::before
            opacity 0.5


        &::before
          content ''
          position absolute
          top 0
          right 0
          background-color #fff
          background-repeat no-repeat
          background-position center center
          background-size 7px auto
          background-image url(/public/icons/triangle-grey.png)
          display block
          width 15px
          height 100%
          border-left 1px solid #808080
          z-index 1

        > select
          color #808080
          padding 5px 15px 5px 8px
          width 130%
          border none
          box-shadow none
          background-color transparent
          background-image none
          appearance none
          outline none
          cursor pointer
          position relative
          z-index 2
  .ios-style-switch
    width 28px
    height 15px
    &__checkbox
      position absolute
      opacity 0
      &:checked
        & + .ios-style-switch__label:after
          margin-left 14px
        & + .ios-style-switch__label:before
          background #808080
    &__label
      cursor pointer
      &:before
        content ""
        position absolute
        display block
        top 0
        width 28px
        height 15px
        border-radius 16px
        background #fff
        border 1px solid #d9d9d9
        -webkit-transition all 0.3s
        transition all 0.3s
      &:after
        content ""
        position absolute
        display block
        top 0px
        width 15px
        height 15px
        border-radius 16px
        background #fff
        border 1px solid #d9d9d9
        -webkit-transition all 0.3s
        transition all 0.3s
      &:hover:after
        box-shadow 0 0 5px rgba(0, 0, 0, 0.3)
</style>