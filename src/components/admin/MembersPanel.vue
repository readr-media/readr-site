<template>
  <div class="member-panel">
    <div class="member-panel__controlbar">
      <div class="member-panel__filter" @keyup.enter="goSearch">
        <TextItem
          :placeHolder="$t('admin.SEARCH')"
          :value.sync="filter"></TextItem>
        <div class="filter__search" @click="goSearch"></div>
      </div>    
      <div class="member-panel__pagination">
        <PaginationNav :totalPages="totalPages" :currPage.sync="curr_page"></PaginationNav>
      </div>    
    </div>
    <div class="member-panel__items">
      <MemberItem class="member-panel__items__item">
        <template slot="title">
          <div class="checkbox select-all title"><input type="checkbox" @click="toggoleSelectAll" ref="selectAll"></div>
          <div class="nickname title"><span v-text="$t('admin.WORDING_ADMIN_NICKNAME')" @click="orderBy('nickname')"></span></div>
          <div class="email title"><span v-text="$t('admin.WORDING_ADMIN_EMAIL')" @click="orderBy('mail')"></span></div>
          <div class="role title"><span v-text="$t('admin.WORDING_ADMIN_ROLE')" @click="orderBy('role')"></span></div>
          <div class="actions title">
            <div class="actions__guesteditor"><span v-text="$t('admin.WORDING_ADMIN_GUESTEDITOR')" @click="orderBy('custom_editor')"></span></div>
            <div class="actions__update" v-if="$can('updateAccount')" v-text="$t('admin.WORDING_ADMIN_UPDATE')"></div>
            <div class="actions__delete" v-if="$can('deleteAccount')" v-text="$t('admin.WORDING_ADMIN_DELETE')" @click="delMultiple"></div>
          </div>
          <div class="filter title">
            <select @change="filterChanged">
              <option v-for="opt in filterOpts" v-text="opt.title" :value="opt.key"></option>
            </select>
          </div>
        </template>
      </MemberItem>
      <MemberItem class="member-panel__items__item" v-for="(m, k) in members" :key="k"
        :toggleCheckboxItem="toggleCheckboxItem"
        :toogleCustomEditor="toogleCustomEditor"
        :update="update"
        :del="del"
        :index="k"
        :member="m"></MemberItem>
      <BaseLightBox :showLightBox.sync="showLightBox" borderStyle="nonBorder" :isConversation="true">
        <MemberAccountEditor @updated="updated" @closeLightBox="closeLightBox" :title="editorTitle" :members="targMember" :action="action"></MemberAccountEditor>
      </BaseLightBox>
    </div>
  </div>
</template>
<script>
  import { CUSTOM_EDITOR_LIMIT, } from 'src/constants'
  import { FILTER, } from 'src/constants/admin'
  import { filter, get, map, } from 'lodash'
  import BaseLightBox from 'src/components/BaseLightBox.vue'
  import TextItem from 'src/components/form/TextItem.vue'
  import MemberAccountEditor from 'src/components/admin/MemberAccountEditor.vue'
  import MemberItem from 'src/components/admin/MemberItem.vue'
  import PaginationNav from 'src/components/PaginationNav.vue'

  const MAXRESULT = 20
  const debug = require('debug')('CLIENT:MembersPanel')
  const getCustomEditors = store => store.dispatch('GET_MEMBERS', {
    params: {
      custom_editor: true,
    },
  })
  const updateMember = (store, profile, type = '') => store.dispatch('UPDATE_MEMBER', {
    params: profile,
    type,
  })

  export default {
    name: 'MembersPanel',
    components: {
      BaseLightBox,
      TextItem,
      MemberAccountEditor,
      MemberItem,
      PaginationNav,
    },
    computed: {
      members () {
        return get(this.$store, 'state.members.items', [])
      },
      filterOpts () {
        return FILTER
      },
      totalPages () {
        return (Math.floor(get(this.$store, 'state.membersCount') / MAXRESULT)) + 1
      },
    },
    data () {
      return {
        action: 'update',
        currOrder: '',
        curr_page: 1,
        editorTitle: '',
        filter: '',
        isAllSelected: false,
        showLightBox: false,
        targMember: null,
      }
    },
    methods: {
      closeLightBox () {
        this.showLightBox = false
      },
      del (index) {
        this.action = 'delete'
        this.showLightBox = true
        this.targMember = [ this.members[ index ], ]
        this.editorTitle = this.$t('admin.WORDING_ADMIN_MEMBER_EDITOR_DELETE_CONFIRMATION')
      },
      delMultiple () {
        this.action = 'delete'
        this.showLightBox = true
        this.targMember = map(filter(this.$refs[ 'checkboxItems' ], (checkbox) => (checkbox.checked)), (checkbox) => (this.members[ checkbox.value ]))
        this.editorTitle = this.$t('admin.WORDING_ADMIN_MEMBER_EDITOR_DELETE_CONFIRMATION')
      },
      filterChanged (event) {
        this.$refs[ 'selectAll' ].checked = false
        this.toggoleSelectAll()
        this.$emit('filterChanged', { sort: event.target.value, })
      },
      goSearch () {
        debug(this.filter)
        this.$emit('filterChanged', { keyword: this.filter, })
      },
      toogleCustomEditor (index, event) {
        const exceedMaxCustomEditor = () => {
          return (this.$store.state.customEditors.items ? this.$store.state.customEditors.items.length : 0) + 1 > CUSTOM_EDITOR_LIMIT
        }
        if (!event.target.checked) {
          this.targMember = this.members[ index ]
          updateMember(this.$store, {
            id: this.targMember.id,
            custom_editor: false,
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
            custom_editor: true,
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
        map(this.$refs[ 'checkboxItems' ], (checkbox) => {
          checkbox.checked = this.$refs[ 'selectAll' ].checked
        })
      },
      orderBy (field) {
        if (this.currOrder === field || this.currOrder === `-${field}`) {
          this.currOrder = this.currOrder.indexOf('-') === 0 ? field : `-${field}`
          this.$emit('filterChanged', { sort: this.currOrder, })
        } else {
          this.currOrder = field
          this.$emit('filterChanged', { sort: field, })
        }
      },
      update (index) {
        this.action = 'update'
        this.showLightBox = true
        this.targMember = [ this.members[ index ], ]
        this.editorTitle = this.$t('admin.WORDING_ADMIN_MEMBER_EDITOR_REVISE_MEMBER')
      },
      updated () {
        this.$emit('filterChanged')
      },
    },
    mounted () {
      getCustomEditors(this.$store)
    },
    watch: {
      curr_page () {
        debug('Mutation detected: currPage', this.curr_page)
        this.$refs[ 'selectAll' ].checked = false
        this.toggoleSelectAll()
        this.$emit('filterChanged', { page: this.curr_page, })        
      },
    },
  }
</script>
<style lang="stylus" scoped>
  .member-panel
    width 100%
    margin 10px auto
    border solid 5px #d8ca21
    padding 23.5px 75px 45px
    background-color white
    &__controlbar
      width 100%
      display flex
      justify-content space-between
    &__filter
      border 1px solid #d3d3d3
      position relative
      padding-right 20px
      > .text-item
        & >>> input
          height 20px
          font-size 14px
      > .filter__search
        cursor pointer
        position absolute
        top 0
        right 0
        background-size 80% 80%
        background-repeat no-repeat
        background-position center center
        background-image url(/public/icons/search-grey.png)
        height 20px
        width 20px
    &__pagination
      height 20px
      top 36px
      flex 1
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

  @media (min-width 800px)
    .member-panel
      &__items, &__pagination
        max-width 800px
  @media (min-width 950px)
    .member-panel
      max-width 950px
</style>