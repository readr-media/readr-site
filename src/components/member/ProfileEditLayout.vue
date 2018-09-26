<template>
  <div class="profile-config">
    <div class="profile-config__wrapper">
      <div class="profile-config__aside"><slot name="aside"></slot></div>
      <div class="profile-config__main"><slot name="main"></slot></div>
    </div>
    <div class="profile-config__other"><slot></slot></div>
  </div>
</template>
<script>
  export default {
    name: 'ProfileEditLayout',
    methods: {},
    mounted () {},
  }
</script>
<style lang="stylus" scoped>
  $plus-sign
    content ''
    background-color white
    position absolute
    top 0
    bottom 0
    left 0
    right 0
    margin auto
  .profile-config
    padding 45px 55px
    background-color #fff
    max-width 920px
    max-height 100vh
    width 80vw
    overflow auto
    &__wrapper
      display flex
      width 100%
    &__main
      flex 1
      .form
        width 100%
        &__wrapper
          & + .form__wrapper
            margin-top 30px
        &__item
          display flex
          align-items center
          width 100%
          &, &--subtitle
            & + .form__item
              margin-top 10px
          &.switcher
            & + .form__item, & + .form__item--subtitle
              margin-top 13px
              border-top 1px solid #d3d3d3
              padding-top 13px
          &--title
            & + .form__item
              margin-top 20px
            background-color #ddcf21
            padding 3px
            display flex
            justify-content center
            align-items center
            // margin-bottom 20px
            font-size 1.125rem
            font-weight 500
            line-height normal
          &--subtitle
            font-size 0.9375rem
            font-weight normal
          
        &__name
          margin-right 15px
          font-size 0.9375rem
          &.sub
            color #808080
            font-weight 300
            font-size 0.875rem
        &__input
          flex 1
          height 25px
          &:not(.text)
            border 1px solid #d3d3d3
            font-size 0.75rem
            color #808080
            outline none
            padding 3px 7px
            line-height normal
          &:focus
            border 1px solid #ddcf21
          &.text
            width 100%
            &.alert
              margin 0 !important
            & >>> input
              font-size 0.75rem
              color #808080
              outline none
              padding 3px 7px
              line-height normal
              height auto
          &.textarea
            resize none
            height 65px
        &__switcher
          width 100%
          & >>> .title, & >>> .desc
            font-size 0.9375rem
            font-weight normal
            line-height normal
          & >>> .desc
            color #808080
            font-weight 300

    &__aside
      width 125px
      margin-right 35px
      .portrait
        &__container
          position relative
          cursor pointer
        &__thumbnail
          width 125px
          height 125px
          border-radius 50%
          overflow hidden
          object-fit cover
          object-position center center
        &__upload
          r = 38px
          position absolute
          bottom 0
          right 0
          width r
          height r
          background-color #808080
          border-radius r
          box-shadow 0 1px 2px 0 rgba(0, 0, 0, 0.5)
          // CSS based plus sign
          &:before
            @extends $plus-sign
            width 24px
            height 4px
          &:after
            @extends $plus-sign
            width 4px
            height 24px  
    &__other
      width 100%
      margin-top 90px
    .button
      width 100%
      font-size 0.9375rem
      &.save
        padding 7px
        background-color #11b8c9
        border-radius 2px
        color #fff
        outline none
        &:hover
          background-color #45bdc9
    .password_alert
      position fixed
      top 0
      left 0
      width 100vw
      height 100vh
      background-color rgba(0, 0, 0, 0.5)
      z-index 99999
      display flex
      justify-content center
      align-items center
      > .container
        padding 10px
        width 300px
        height 100px
        background-color #e3e3e3
        border-radius 2px
        display flex
        justify-content center
        align-items center
        flex-direction column
        font-size 0.875rem
        line-height normal
        .confirm
          margin-top 10px
          padding 2px 10px
          cursor pointer
          background-color #4280a2
          border-radius 2px
          color #fff
        .message
          padding 0 10px

</style>