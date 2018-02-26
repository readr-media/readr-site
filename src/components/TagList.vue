<template>
  <div class="tagList">
    <div class="tagList__control">
      <div class="tagList__add">
        <input v-model="addTag" type="text" :placeholder="wording.WORDING_TAGLIST_ADD_PLACEHOLDER">
        <button :disabled="!tagNameValidated" @click="$_tagList_addTag" v-text="wording.WORDING_TAGLIST_ADD"></button>
      </div>
      <pagination-nav :totalPages="totalPages"></pagination-nav>
    </div>
    <table>
      <thead>
        <tr>
          <th class="tagList__checkbox"><input type="checkbox" ref="checkboxSelectAll"  @click="$_tagList_toggleSelectAll"></th>
          <th class="tagList__text"><span v-text="wording.WORDING_TAGLIST_TAG"></span></th>
          <th><span v-text="wording.WORDING_TAGLIST_REVIEW_COUNT"></span></th>
          <th><span v-text="wording.WORDING_TAGLIST_NEWS_COUNT"></span></th>
          <th class="tagList__edit"></th>
          <th class="tagList__delete">
            <button class="tagList__btn tagList__btn--multiple" v-text="wording.WORDING_TAGLIST_DELETE" @click="$_postList_deleteTags"></button>
          </th>
          <th class="tagList__sort">
            <select name="" id="">
              <option value="-updated_at" v-text="wording.WORDING_TAGLIST_UPDATE_AT"></option>
              <option value="-created_at" v-text="wording.WORDING_TAGLIST_PUBLISH_AT"></option>
            </select>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="t in tags" :key="t.id">
          <td><input type="checkbox" ref="checkboxItems" @change="$_tagList_toggleHandler($event, t.id)"></td>
          <td ref="tagTextBlock" class="tagList__text">
            <span ref="originTagText" @click="$_tagList_editTag" v-text="t.text"></span>
            <input ref="inputTagText" type="text" :value="t.text">
            <button @click="$_tagList_confirmEdit($event, t.id)" v-text="wording.WORDING_TAGLIST_CONFIRM"></button>
            <button @click="$_tagList_cancel" v-text="wording.WORDING_TAGLIST_CANCEL"></button>
          </td>
          <td v-text="t.relatedReviews"></td>
          <td v-text="t.relatedNews"></td>
          <td class="tagList__edit"><button class="tagList__btn tagList__btn--single" @click="$_tagList_editTagBtn" v-text="wording.WORDING_TAGLIST_EDIT"></button></td>
          <td class="tagList__delete"><button class="tagList__btn tagList__btn--single" @click="$_tagList_deleteTag(t.id)" v-text="wording.WORDING_TAGLIST_DELETE"></button></td>
          <td></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
  import {
    WORDING_TAGLIST_ADD,
    WORDING_TAGLIST_ADD_PLACEHOLDER,
    WORDING_TAGLIST_CANCEL,
    WORDING_TAGLIST_CONFIRM,
    WORDING_TAGLIST_DELETE,
    WORDING_TAGLIST_EDIT,
    WORDING_TAGLIST_NEWS_COUNT,
    WORDING_TAGLIST_PUBLISH_AT,
    WORDING_TAGLIST_REVIEW_COUNT,
    WORDING_TAGLIST_TAG,
    WORDING_TAGLIST_UPDATE_AT
  } from '../constants'
  import _ from 'lodash'
  import PaginationNav from './PaginationNav.vue'

  const updateTags = (store, id, text) => {
    return store.dispatch('UPDATE_TAGS', {
      params: {
        id: id,
        text: text,
        updated_by: _.get(store, [ 'state', 'profile', 'id' ])
      }
    })
  }

  export default {
    name: 'TagList',
    components: {
      'pagination-nav': PaginationNav
    },
    props: {
      maxResult: {
        type: Number,
        required: true
      },
      tags: {
        type: Array,
        required: true
      }
    },
    data () {
      return {
        addTag: '',
        checkedIems: [],
        wording: {
          WORDING_TAGLIST_ADD,
          WORDING_TAGLIST_ADD_PLACEHOLDER,
          WORDING_TAGLIST_CANCEL,
          WORDING_TAGLIST_CONFIRM,
          WORDING_TAGLIST_DELETE,
          WORDING_TAGLIST_EDIT,
          WORDING_TAGLIST_NEWS_COUNT,
          WORDING_TAGLIST_PUBLISH_AT,
          WORDING_TAGLIST_REVIEW_COUNT,
          WORDING_TAGLIST_TAG,
          WORDING_TAGLIST_UPDATE_AT
        },
      }
    },
    computed: {
      tagNameValidated () {
        return this.addTag.trim()
      },
      totalPages () {
        return Math.ceil(_.get(this.$store, [ 'state', 'tagsCount' ], 0) / this.maxResult)
      }
    },
    watch: {
      tags () {
        this.addTag = ''
      }
    },
    methods: {
      $_tagList_addTag () {
        if (this.tagNameValidated) {
          this.$emit('addTag', this.addTag.trim())
        }
      },
      $_tagList_cancel (event) {
        event.target.parentNode.classList.toggle('modify')
      },
      $_tagList_confirmEdit (event, id) {
        const newText = event.target.parentNode.querySelector('input').value
        const originText = event.target.parentNode.querySelector('span').innerText
        if (newText === originText) {
          event.target.parentNode.classList.toggle('modify')
        } else {
          updateTags(this.$store, id, newText)
          .then(() => {
            event.target.parentNode.classList.toggle('modify')
            this.$emit('updateTagList')
          })
        }
      },
      $_tagList_deleteTag (id) {
        this.$emit('deleteTags', [ id ])
      },
      $_postList_deleteTags () {
        this.$emit('deleteTags', this.checkedIems)
      },
      $_tagList_editTag (event) {
        event.target.parentNode.classList.toggle('modify')
      },
      $_tagList_editTagBtn (event) {
        event.target.parentNode.parentNode.querySelector('.tagList__text').classList.toggle('modify')
      },
      $_tagList_toggleHandler (event, id) {
        if (event.target.checked) {
          this.checkedIems.push(id)
        } else {
          const index = this.checkedIems.indexOf(id)
          if (index > -1) {
            this.checkedIems.splice(index, 1)
          }
        }
      },
      $_tagList_toggleSelectAll () {
        this.checkedIems = []
        _.map(this.$refs.checkboxItems, (item) => {
          item.checked = this.$refs.checkboxSelectAll.checked
        })
        if (this.$refs.checkboxSelectAll.checked) {
          _.map(this.tags, (item) => {
            this.checkedIems.push(item.id)
          })
          this.checkedIems = _.uniq(this.checkedIems)
        }
      }
    }
  }
</script>
<style lang="stylus" scoped>
.tagList
  table
    width 100%
    text-align left
    border-collapse collapse
    thead
      color #808080
      font-size 18px
    th
      padding-bottom 5px
      border-bottom 2px solid #000
      span
        position relative
        cursor pointer
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
    tr
      &:first-of-type
        td
          padding-top 10px
    td
      padding-top 5px
      padding-bottom 5px
      border-bottom 1px solid #d3d3d3
    input[type="checkbox"]
      width 15px
      height 15px
  &__control
    display flex
    justify-content space-between
  &__add
    input
      width 250px
      height 25px
      padding 0 0 0 10px
      color #808080
      font-size 15px
      font-weight 300
      border 1px solid #d3d3d3
    button 
      width 60px
      height 25px
      margin 0 0 0 10px
      color #fff
      background-color #4280a2
      border none
      border-radius 4px
    button:disabled
      background-color #ccc
  &__checkbox
    width 15px
    padding-right 10px
    line-height 18px
    vertical-align baseline
  &__text
    position relative
    width 250px
    > span
      cursor pointer
    > input, > button
      display none
    &.modify
      > span
        display none
      > input
        display inline-block
        width 120px
        height 22px
        padding-left 5px
        margin-right 5px
      > button
        display inline-block
        height 22px
        margin 0 2px
        background transparent
        border-radius 4px
        outline none
  &__edit, &__delete
    width 70px
    padding-right 10px
    text-align center
  &__sort
    width 105px
    select
      height 25px
      line-height 25px
  &__btn
    background-color transparent
    border none
    outline none
    &--single
      color #4280a2
    &--multiple
      width 60px
      height 25px
      color #fff
      line-height 23px
      background-color #808080
      border-radius 4px
</style>
