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
          <th class="tagList__checkbox"><input type="checkbox" ref="checkboxSelectAll"></th>
          <th class="tagList__text"><span v-text="wording.WORDING_TAGLIST_TAG"></span></th>
          <th><span v-text="wording.WORDING_TAGLIST_REVIEW_COUNT"></span></th>
          <th><span v-text="wording.WORDING_TAGLIST_NEWS_COUNT"></span></th>
          <th class="tagList__edit"></th>
          <th class="tagList__delete">
            <button class="tagList__btn tagList__btn--multiple" v-text="wording.WORDING_TAGLIST_DELETE"></button>
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
          <td><input type="checkbox" ref="checkboxItems"></td>
          <td v-text="t.text"></td>
          <td v-text="t.relatedReviews"></td>
          <td v-text="t.relatedNews"></td>
          <td><button class="tagList__btn tagList__btn--single" v-text="wording.WORDING_TAGLIST_EDIT"></button></td>
          <td><button class="tagList__btn tagList__btn--single" v-text="wording.WORDING_TAGLIST_DELETE"></button></td>
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

  const MAXRESULT = 20

  export default {
    name: 'TagList',
    components: {
      'pagination-nav': PaginationNav
    },
    props: {
      tags: {
        type: Array,
        required: true
      }
    },
    data () {
      return {
        addTag: '',
        wording: {
          WORDING_TAGLIST_ADD,
          WORDING_TAGLIST_ADD_PLACEHOLDER,
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
        return Math.ceil(_.get(this.$store, [ 'state', 'tagsCount' ], 0) / MAXRESULT)
      }
    },
    methods: {
      $_tagList_addTag () {
        this.$emit('addTag', 'add', this.addTag.trim())
      },
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
    width 200px
  &__edit, &__delete
    width 70px
    padding-right 10px
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
