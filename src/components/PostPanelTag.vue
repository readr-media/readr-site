<template>
  <div ref="tagsContainer" class="post-panel-tag">
    <div class="post-panel-tag__list" :class="{ disabled: disabled }" @mousedown.prevent="$_postPanelTag_focusInput">
      <template>
        <div v-for="t in tagsSelected" :key="t.id" class="tag-selected">
          <p v-text="t.text"></p>
          <button :disabled="disabled" @click="$_postPanelTag_deselectTag(t.id)">&#x2715;</button>
        </div>
        <div v-for="t in tagsNeedAdd" :key="t" class="tag-selected">
          <p v-text="t"></p>
          <button :disabled="disabled" @click="$_postPanelTag_deselectNewTag(t)">&#x2715;</button>
        </div>
        <input
          ref="tagsInput"
          v-model="inputText"
          type="text"
          :disabled="disabled"
          @blur="$_postPanelTag_closeSearched"
          @focus="$_postPanelTag_showSearched"
          @keypress.enter="$_postPanelTag_inputHandler">
      </template>
    </div>
    <div ref="tagsSearched" class="post-panel-tag__searched hidden" :style="{ bottom: tagsSearchedDirection }">
      <button v-show="tags.length === 0" class="tag--not-found" :disabled="disabled" v-text="$t('POST_PANEL.NOT_FOUND')"></button>
      <button v-for="t in tags" :key="t.tagId" :disabled="disabled" @mousedown="$_postPanelTag_addToSelected(t.id)" v-text="t.text"></button>
    </div>
  </div>
</template>
<script>

  import { filter, find, get, includes, } from 'lodash'

  const MAXRESULT = 20
  const DEFAULT_PAGE = 1

  const getTags = (store, {
    max_result = MAXRESULT,
    page = DEFAULT_PAGE,
    sorting = '-update_at',
    keyword = '',
    stats = false,
  }) => {
    return store.dispatch('GET_TAGS', {
      params: {
        max_result: max_result,
        page: page,
        sorting: sorting,
        keyword: keyword,
        stats: stats,
      },
    })
  }

  export default {
    name: 'PostPanelTag',
    props: {
      disabled: {
        type: Boolean,
      },
      tagsNeedAdd: {
        type: Array,
        require: true,
      },
      tagsSelected: {
        type: Array,
        require: true,
      },
      tagsSelectedID: {
        type: Array,
        require: true,
      },
    },
    data () {
      return {
        inputText: '',
        isChanged: false,
        tagsSearchedDirection: '100%',
      }
    },
    computed: {
      tags () {
        let tags = get(this.$store, [ 'state', 'tags', ], []) || []
        return filter(tags, tag => !includes(this.tagsSelectedID, tag.id))
      },
    },
    watch: {
      inputText () {
        getTags(this.$store, { keyword: this.inputText, })
        .then(() => {
          this.$refs.tagsSearched.classList.remove('hidden')
        })
      },
      tagsNeedAdd () {
        this.tagsSearchedDirection = this.$_postPanelTag_calcTagsSearchedDirection() || '100%'
      },
      tagsSelected () {
        this.tagsSearchedDirection = this.$_postPanelTag_calcTagsSearchedDirection() || '100%'
      },
    },
    beforeMount () {
      getTags(this.$store, { stats: true, })
    },
    methods: {
      $_postPanelTag_addToSelected (id) {
        this.$emit('addToSelected', find(this.tags, { id: id, }))
        this.inputText = ''
        this.$refs.tagsSearched.classList.add('hidden')
      },
      $_postPanelTag_calcTagsSearchedDirection () {
        this.$nextTick(() => {
          const tagsContainer = this.$refs.tagsContainer
          const tagsContainerHeight = tagsContainer.offsetHeight || 0
          const tagBottom = document.querySelector('.input--tag').getBoundingClientRect().bottom || 0
          const actionTop = document.querySelector('.post-panel__action').getBoundingClientRect().top || 0
          const actionEleStyle = window.getComputedStyle ? getComputedStyle(document.querySelector('.post-panel__action'), null) : document.querySelector('.post-panel__action').currentStyle
          const marginTop = parseInt(actionEleStyle.marginTop) || 0
          return (actionTop - ( tagBottom + marginTop) > this.$refs.tagsSearched.offsetHeight) ? '-1px' : `${tagsContainerHeight}px`
        })
      },
      $_postPanelTag_closeSearched () {
        this.$refs.tagsSearched.classList.add('hidden')
      },
      $_postPanelTag_deselectNewTag (tag) {
        this.$emit('deselectNewTag', tag)
      },
      $_postPanelTag_deselectTag (id) {
        this.$emit('deselectTag', id)
      },
      $_postPanelTag_focusInput () {
        this.$refs.tagsInput.focus()
      },
      $_postPanelTag_inputHandler () {
        if (this.inputText) {
          const hasTag = find(this.tags, { 'text': this.inputText, })
          if (hasTag) {
            this.$_postPanelTag_addToSelected(hasTag.id)
          } else if (!includes(this.tagsNeedAdd, this.inputText)) {
            this.$emit('addToNeedAdd', this.inputText)
          }
          this.inputText = ''
          this.$refs.tagsSearched.classList.add('hidden')
        }
      },
      $_postPanelTag_showSearched () {
        this.tagsSearchedDirection = this.$_postPanelTag_calcTagsSearchedDirection() || '100%'
        this.$refs.tagsSearched.classList.remove('hidden')
      },
    },
  }
</script>
<style lang="stylus" scoped>

.post-panel-tag
  flex 1
  position relative
  border 1px solid #d3d3d3
  &__list
    padding .1em .5em
    transition background-color .5s linear
    > input
      width 100px
      padding .2em .5em
      border none
      outline none
      transition background-color .5s linear
      &:disabled
        background-color rgba(0, 0, 0, .01)
    &.disabled
      background-color rgba(0, 0, 0, .3)
  &__searched
    position absolute
    left -1px
    z-index 10
    width calc(100% + 2px)
    max-height 135px
    background-color #fff
    border 1px solid rgba(128, 128, 128, .4)
    border-top 1px solid rgba(128, 128, 128, .2)
    overflow-y scroll
    &.hidden
      visibility hidden
    button
      width 100%
      padding .2em .5em
      text-align left
      background-color transparent
      border none
      outline none

.tag
  &-selected
    display inline-flex
    align-items center
    margin .1em 0
    p
      display inline-block
      margin 0
      color #4280a2
      font-size .875rem
    button
      display inline-block
      width 20px
      height 20px
      padding 0
      margin 0 10px 0 2px
      font-size .75rem
      background-color transparent
      border 1px solid rgba(128, 128, 128, .4)
      border-radius 50%
      outline none
  &--not-found
    cursor default
    

</style>