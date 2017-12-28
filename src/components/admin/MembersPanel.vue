<template>
  <div class="member-panel">
    <div class="member-panel__items">
      <div class="member-panel__items__item">
        <div class="id title" v-text="wording.WORDING_ADMIN_ACCOUNT"></div>
        <div class="email title" v-text="wording.WORDING_ADMIN_EMAIL"></div>
        <div class="role title" v-text="wording.WORDING_ADMIN_ROLE"></div>
        <div class="actions title"></div>
      </div>
      <div class="member-panel__items__item" v-for="(m, k) in members">
        <div class="id" v-text="getValue(m, [ 'id' ])"></div>
        <div class="email" v-text="getValue(m, [ 'mail' ])"></div>
        <div class="role" v-text="getValue(m, [ 'role' ])"></div>
        <div class="actions">
          <div class="actions__update" v-text="wording.WORDING_ADMIN_UPDATE"></div>
          <div class="actions__delete" v-text="wording.WORDING_ADMIN_DELETE"></div>
        </div>      
      </div>
      <MemberAccountEditor :shouldShow="shouldShowEditor" @close="closeEditor"></MemberAccountEditor>
    </div>
  </div>
</template>
<script>
  import _ from 'lodash'
  import { WORDING_ADMIN_ACCOUNT, WORDING_ADMIN_EMAIL, WORDING_ADMIN_ROLE, WORDING_ADMIN_UPDATE, WORDING_ADMIN_DELETE } from '../../constants'
  import { getValue } from '../../util/comm'
  import MemberAccountEditor from './MemberAccountEditor.vue'

  const getMembers = (store) => {
    return store.dispatch('GET_MEMBERS', {})
  }

  export default {
    components: {
      MemberAccountEditor
    },
    computed: {
      members () {
        return _.get(this.$store, [ 'state', 'members' ], [])
      }
    },
    data () {
      return {
        shouldShowEditor: false,
        wording: {
          WORDING_ADMIN_ACCOUNT,
          WORDING_ADMIN_EMAIL,
          WORDING_ADMIN_ROLE,
          WORDING_ADMIN_UPDATE,
          WORDING_ADMIN_DELETE
        }
      }
    },
    name: 'member-panel',
    methods: {
      closeEditor () {},
      getValue
    },
    mounted () {},
    beforeMount () {
      Promise.all([
        getMembers(this.$store)
      ])
    }
  }
</script>
<style lang="stylus" scoped>
  .member-panel
    width 100%
    margin 30px auto
    border solid 2.5px #d8ca21
    padding 23.5px 0
    &__items
      width 100%
      margin 0 auto
      &__item
        padding 0 85px
        &:not(:first-child)
          border-top 1px solid #d3d3d3
        > div
          display inline-block
          font-size 0.625rem
          word-break break-all
          vertical-align top
          &.title
            font-size 0.9375rem
            margin 10px 0
          &:not(.title)
            padding 5px 5px 5px 0
          &.id
            width 80px
          &.email
            width 165px
          &.role
            width 80px
          &.actions
            width 70px
            > div
              display inline-block
              color #4280a2
              cursor pointer
              margin-right 6.5px

  @media (min-width 550px)
    .member-panel
      &__items
        max-width 570px    
  @media (min-width 720px)
    .member-panel
      max-width 720px
</style>