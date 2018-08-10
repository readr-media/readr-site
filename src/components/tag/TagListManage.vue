<template>
  <div class="tagList">
    <div class="tagList__control">
      <div class="tagList__add">
        <input v-model="addTag" type="text" :placeholder="$t('TAG_LIST.ADD_PLACEHOLDER')">
        <button :disabled="!tagNameValidated" @click="$_tagList_addTag" v-text="$t('TAG_LIST.ADD')"></button>
      </div>
      <div class="tagList__search">
        <input v-model="searchVal" type="text">
        <button @click="$_tagList_search" v-text="$t('TAG_LIST.SEARCH')"></button>
      </div>
      <pagination-nav :totalPages="totalPages" :currPage.sync="currPage"></pagination-nav>
    </div>
    <table>
      <thead>
        <tr>
          <th class="tagList__checkbox"><input type="checkbox" ref="checkboxSelectAll"  @click="$_tagList_toggleSelectAll"></th>
          <th class="tagList__text"><span @click="$_tagList_orderBy('text')" v-text="$t('TAG_LIST.TAG')"></span></th>
          <th><span @click="$_tagList_orderBy('related_reviews')" v-text="$t('TAG_LIST.REVIEW_COUNT')"></span></th>
          <th><span @click="$_tagList_orderBy('related_news')" v-text="$t('TAG_LIST.NEWS_COUNT')"></span></th>
          <th class="tagList__edit"></th>
          <th class="tagList__delete">
            <button class="tagList__btn tagList__btn--multiple" v-text="$t('TAG_LIST.DELETE')" @click="$_postList_deleteTags"></button>
          </th>
          <th class="tagList__sort">
            <select name="" id="">
              <option value="-updated_at" v-text="$t('TAG_LIST.UPDATE_AT')"></option>
              <option value="-created_at" v-text="$t('TAG_LIST.PUBLISH_AT')"></option>
            </select>
          </th>
        </tr>
      </thead>
      <tbody>
        <template v-for="tag in tags">
          <tr :key="tag.id" class="tagList__row">
            <td><input type="checkbox" ref="checkboxItems" @change="$_tagList_toggleHandler($event, tag.id)"></td>
            <td ref="tagTextBlock" class="tagList__text">
              <span ref="originTagText" @click="$_tagList_editTag" v-text="tag.text"></span>
              <input ref="inputTagText" type="text" :value="tag.text">
              <button @click="$_tagList_confirmEdit($event, tag.id)" v-text="$t('TAG_LIST.CONFIRM')"></button>
              <button @click="$_tagList_cancel" v-text="$t('TAG_LIST.CANCEL')"></button>
            </td>
            <td v-text="tag.relatedReviews"></td>
            <td v-text="tag.relatedNews"></td>
            <td class="tagList__edit"><button class="tagList__btn tagList__btn--single" @click="$_tagList_editTagBtn" v-text="$t('TAG_LIST.EDIT')"></button></td>
            <td class="tagList__delete"><button class="tagList__btn tagList__btn--single" @click="$_tagList_deleteTag(tag.id)" v-text="$t('TAG_LIST.DELETE')"></button></td>
            <td></td>
          </tr>
          <template v-if="hasRelated(tag)">
            <tr :key="`${tag.id}-related`">
              <td colspan="7" class="tagList__related-btn" @click="toggleRelated(tag.id)" v-text="openRelatedList.includes(tag.id) ? $t('TAG_LIST.CLOSE_RELATED') : $t('TAG_LIST.OPEN_RELATED')"></td>
            </tr>
            <TagListManageItemRelated v-for="post in tag.taggedPosts" v-if="tag.taggedPosts" :key="`${tag.id}-${post.id}-tag`" :class="{ open: openRelatedList.includes(tag.id) }" :item="post" :type="post.type" class="tagList__related" />
            <TagListManageItemRelated v-for="project in tag.taggedProjects" v-if="tag.taggedProjects" :key="`${tag.id}-${project.id}-tag`" :class="{ open: openRelatedList.includes(tag.id) }" :item="project" :type="7" class="tagList__related" />
          </template>
        </template>
      </tbody>
    </table>
  </div>
</template>
<script>
  import _ from 'lodash'
  import PaginationNav from '../PaginationNav.vue'
  import TagListManageItemRelated from './TagListManageItemRelated.vue'

  const updateTags = (store, id, text) => {
    return store.dispatch('UPDATE_TAGS', {
      params: {
        id: id,
        text: text,
        updated_by: _.get(store, [ 'state', 'profile', 'id', ]),
      },
    })
  }

  export default {
    name: 'TagListManage',
    components: {
      'pagination-nav': PaginationNav,
      TagListManageItemRelated,
    },
    props: {
      maxResult: {
        type: Number,
        required: true,
      },
      sort: {
        type: String,
        required: true,
      },
      tags: {
        type: Array,
        required: true,
      },
    },
    data () {
      return {
        addTag: '',
        currPage: 1,
        checkedIems: [],
        searchVal: '',
        openRelatedList: [],
      }
    },
    computed: {
      tagNameValidated () {
        return this.addTag.trim()
      },
      totalPages () {
        return Math.ceil(_.get(this.$store, [ 'state', 'tagsCount', ], 0) / this.maxResult)
      },
    },
    watch: {
      currPage () {
        this.$emit('filterChanged', { page: this.currPage, })
      },
      tags () {
        this.addTag = ''
      },
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
        this.$emit('deleteTags', [ id, ])
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
      $_tagList_orderBy (field) {
        let order
        if (this.sort === field || this.sort === `-${field}`) {
          order = this.sort.indexOf('-') === 0 ? field : `-${field}`
        } else {
          order = field
        }
        this.$emit('filterChanged', { sort: order, keyword: this.searchVal, })
      },
      $_tagList_search () {
        this.$emit('filterChanged', { sort: this.sort, keyword: this.searchVal, })
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
      },
      hasRelated (tag) {
        return tag.taggedPosts || tag.taggedProjects
      },
      toggleRelated (id) {
        if (this.openRelatedList.includes(id)) {
          const index = this.openRelatedList.indexOf(id)
          this.openRelatedList.splice(index, 1)
        } else {
          this.openRelatedList.push(id)
        }
      },
    },
  }
</script>
<style lang="stylus" scoped>
.tagList
  table
    width 100%
    margin-top 20px
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
    input[type="checkbox"]
      width 15px
      height 15px
  &__row
    border-top 1px solid #d3d3d3
  &__control
    display flex
    justify-content flex-start
    align-items center
  &__add, &__search
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
  &__search
    margin-left 50px
    input
      width 150px
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
  &__related
    display none
    &.open
      display table-row
  &__related-btn
    font-size .875rem
    cursor pointer
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
