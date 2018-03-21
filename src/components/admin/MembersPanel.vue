<template>
  <div class="member-panel">
    <div class="member-panel__pagination">
      <PaginationNav :totalPages="10" @pageChanged="pageChanged"></PaginationNav>
    </div>
    <div class="member-panel__items">
      <div class="member-panel__items__item">
        <div class="checkbox select-all title">
          <input type="checkbox" @click="toggoleSelectAll" ref="selectAll">
        </div>
        <div class="nickname title"><span v-text="wording.WORDING_ADMIN_NICKNAME" @click="orderBy('nickname')"></span></div>
        <div class="email title"><span v-text="wording.WORDING_ADMIN_EMAIL" @click="orderBy('mail')"></span></div>
        <div class="role title"><span v-text="wording.WORDING_ADMIN_ROLE" @click="orderBy('role')"></span></div>
        <!-- <div class="guesteditor title"><span v-text="wording.WORDING_ADMIN_GUESTEDITOR" @click="orderBy('role')"></span></div> -->
        <div class="actions title">
          <!-- <div class="actions__guesteditor" v-text="wording.WORDING_ADMIN_GUESTEDITOR"></div> -->
          <div class="actions__guesteditor"><span v-text="wording.WORDING_ADMIN_GUESTEDITOR" @click="orderBy('custom_editor')"></span></div>
          <div class="actions__update" v-if="$can('updateAccount')" v-text="wording.WORDING_ADMIN_UPDATE"></div>
          <div class="actions__delete" v-if="$can('deleteAccount')" v-text="wording.WORDING_ADMIN_DELETE" @click="delMultiple"></div>
        </div>
        <div class="filter title">
          <select @change="filterChanged">
            <option v-for="opt in filterOpts" v-text="opt.title" :value="opt.key"></option>
          </select>
        </div>
      </div>
      <div class="member-panel__items__item" v-for="(m, k) in members">
        <div class="checkbox">
          <input type="checkbox" @click="toggleCheckboxItem" :ref="`checkboxItems`" :value="k">
        </div>
        <div class="nickname" v-text="getValue(m, [ 'nickname' ])"></div>
        <div class="email" v-text="getValue(m, [ 'mail' ])"></div>
        <div class="role" v-text="getValue(roles, [ getValue(m, [ 'role' ], 1) ], '-')"></div>
        <div class="actions">
          <!-- <div class="actions__guesteditor" v-if="m.customEditor" v-text="wording.WORDING_ADMIN_GUESTEDITOR" @click="cancelCustomEditor(k)"></div> -->
          <!-- <div class="actions__guesteditor" v-else="!m.customEditor" v-text="wording.WORDING_ADMIN_GUESTEDITOR" @click="cancelCustomEditor(k)"></div> -->
          <div class="actions__guesteditor">
            <div class="ios-style-switch" v-if="canBeCustomEditor(m)">
              <input type='checkbox' class='ios-style-switch__checkbox' :id='`checkbox-${m.id}`' :checked="m.customEditor"  @click="toogleCustomEditor(k, $event)">
              <label :for="`checkbox-${m.id}`" class='ios-style-switch__label'></label>
            </div>
          </div>
          <div class="actions__update" v-if="$can('updateAccount')" v-text="wording.WORDING_ADMIN_UPDATE" @click="update(k)"></div>
          <div class="actions__delete" v-if="$can('deleteAccount')" v-text="wording.WORDING_ADMIN_DELETE" @click="del(k)"></div>
        </div>
      </div>
      <BaseLightBox :showLightBox.sync="showLightBox" borderStyle="nonBorder" :isConversation="true">
        <MemberAccountEditor @updated="updated" @closeLightBox="closeLightBox" :title="editorTitle" :members="targMember" :action="action"></MemberAccountEditor>
      </BaseLightBox>
    </div>
  </div>
</template>
<script>
  import _ from 'lodash'
  import { WORDING_ADMIN_ACCOUNT, WORDING_ADMIN_EMAIL, WORDING_ADMIN_ROLE, WORDING_ADMIN_UPDATE, WORDING_ADMIN_DELETE } from '../../constants'
  import { WORDING_ADMIN_MEMBER_EDITOR_REVISE_MEMBER, WORDING_ADMIN_MEMBER_EDITOR_DELETE_CONFIRMATION, WORDING_ADMIN_NICKNAME, WORDING_ADMIN_GUESTEDITOR } from '../../constants'
  import { WORDING_ADMIN_MEMBER_EDITOR_SET_CONFIRMATION_CUSTOMEDITOR, WORDING_ADMIN_MEMBER_EDITOR_DELETE_CONFIRMATION_CUSTOMEDITOR } from '../../constants'
  import { CUSTOM_EDITOR_LIMIT } from '../../constants'
  import { FILTER } from '../../constants/admin'
  import { ROLE_MAP } from '../../constants'
  import { getValue } from '../../util/comm'
  import BaseLightBox from '../BaseLightBox.vue'
  import MemberAccountEditor from './MemberAccountEditor.vue'
  import PaginationNav from '../PaginationNav.vue'

  const getCustomEditors = (store) => {
    return store.dispatch('GET_MEMBERS', {
      params: {
        custom_editor: true
      }
    })
  }
  const updateMember = (store, profile, type = '') => {
    return store.dispatch('UPDATE_MEMBER', {
      params: profile,
      type
    })
  }

  export default {
    components: {
      BaseLightBox,
      MemberAccountEditor,
      PaginationNav
    },
    computed: {
      members () {
        return _.get(this.$store, [ 'state', 'members', 'items' ], [])
      },
      filterOpts () {
        return FILTER
      },
      roles () {
        const roles = {}
        _.map(ROLE_MAP, (role) => {
          roles[ role.key ] = role.value
        })
        return roles
      },
      title () {}
    },
    data () {
      return {
        action: 'update',
        currOrder: '',
        isAllSelected: false,
        editorTitle: '',
        showLightBox: false,
        targMember: null,
        wording: {
          WORDING_ADMIN_ACCOUNT,
          WORDING_ADMIN_EMAIL,
          WORDING_ADMIN_ROLE,
          WORDING_ADMIN_UPDATE,
          WORDING_ADMIN_DELETE,
          WORDING_ADMIN_MEMBER_EDITOR_REVISE_MEMBER,
          WORDING_ADMIN_MEMBER_EDITOR_DELETE_CONFIRMATION,
          WORDING_ADMIN_MEMBER_EDITOR_DELETE_CONFIRMATION_CUSTOMEDITOR,
          WORDING_ADMIN_MEMBER_EDITOR_SET_CONFIRMATION_CUSTOMEDITOR,
          WORDING_ADMIN_NICKNAME,
          WORDING_ADMIN_GUESTEDITOR
        }
      }
    },
    name: 'member-panel',
    methods: {
      closeLightBox () {
        this.showLightBox = false
      },
      canBeCustomEditor (m) {
        return this.getValue(this.roles, [ this.getValue(m, [ 'role' ], 1) ], '-') !== '會員' && this.getValue(this.roles, [ this.getValue(m, [ 'role' ], 1) ], '-') !== '-'
      },
      del (index) {
        this.action = 'delete'
        this.showLightBox = true
        this.targMember = [ this.members[ index ] ]
        this.editorTitle = this.wording.WORDING_ADMIN_MEMBER_EDITOR_DELETE_CONFIRMATION
      },
      delMultiple () {
        this.action = 'delete'
        this.showLightBox = true
        this.targMember = _.map(_.filter(this.$refs[ 'checkboxItems' ], (checkbox) => (checkbox.checked)), (checkbox) => (this.members[ checkbox.value ]))
        this.editorTitle = this.wording.WORDING_ADMIN_MEMBER_EDITOR_DELETE_CONFIRMATION
      },
      filterChanged (event) {
        this.$refs[ 'selectAll' ].checked = false
        this.toggoleSelectAll()
        this.$emit('filterChanged', { sort: event.target.value })
      },
      getValue,
      pageChanged (index) {
        this.$refs[ 'selectAll' ].checked = false
        this.toggoleSelectAll()
        this.$emit('filterChanged', { page: index })
      },
      toogleCustomEditor (index, event) {
        const exceedMaxCustomEditor = () => {
          return (this.$store.state.customEditors.items ? this.$store.state.customEditors.items.length : 0) + 1 > CUSTOM_EDITOR_LIMIT
        }
        if (!event.target.checked) {
          this.targMember = this.members[ index ]
          updateMember(this.$store, {
            id: this.targMember.id,
            custom_editor: false
          }).then(() => {
            event.target.checked = false
            this.updated()
            getCustomEditors(this.$store)
          })
        } else if (exceedMaxCustomEditor()) {
          this.action = 'customEditor_exceedError'
          this.showLightBox = true
        } else if (event.target.checked) {
          this.targMember = this.members[ index ]
          updateMember(this.$store, {
            id: this.targMember.id,
            custom_editor: true
          }).then(() => {
            event.target.checked = true
            this.updated()
            getCustomEditors(this.$store)
          })
        }
      },
      toggleCheckboxItem (e) {
        if (!e.target.checked) {
          this.$refs[ 'selectAll' ].checked = false
        }
      },
      toggoleSelectAll () {
        this.isAllSelected = this.$refs[ 'selectAll' ].checked
        _.map(this.$refs[ 'checkboxItems' ], (checkbox) => {
          checkbox.checked = this.$refs[ 'selectAll' ].checked
        })
      },
      orderBy (field) {
        if (this.currOrder === field || this.currOrder === `-${field}`) {
          this.currOrder = this.currOrder.indexOf('-') === 0 ? field : `-${field}`
          this.$emit('filterChanged', { sort: this.currOrder })
        } else {
          this.currOrder = field
          this.$emit('filterChanged', { sort: field })
        }
      },
      update (index) {
        this.action = 'update'
        this.showLightBox = true
        this.targMember = [ this.members[ index ] ]
        this.editorTitle = this.wording.WORDING_ADMIN_MEMBER_EDITOR_REVISE_MEMBER
      },
      updated () {
        this.$emit('filterChanged')
      }
    },
    mounted () {
      getCustomEditors(this.$store)
    }
  }
</script>
<style lang="stylus" scoped>
  .member-panel
    width 100%
    margin 30px auto
    border solid 5px #d8ca21
    padding 23.5px 75px 45px
    background-color white
    &__pagination
      height 20px
      top 36px
      width 100%
      text-align right
    &__items
      width 100%
      margin 25px auto 0
      &__item
        // padding 0 85px
        &:first-child
          border-bottom 2px solid #808080
          margin-bottom 8px
        &:not(:first-child):not(:nth-child(2))
          border-top 1px solid #d3d3d3
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

  @media (min-width 800px)
    .member-panel
      &__items, &__pagination
        max-width 800px
  @media (min-width 950px)
    .member-panel
      max-width 950px
</style>