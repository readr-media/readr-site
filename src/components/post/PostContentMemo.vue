<template>
  <div>
    <div class="post-content__hint">
      <img class="lock" src="/public/icons/lock.png">
      <span v-text="$t('homepage.EDITOR_ROOMMATE_ONLY')"></span>
    </div>
    <h1 class="post-content__title" v-text="post.title"></h1>
    <div class="editor-writing">
      <div class="editor-writing__container" @click="goMemo">
        <template v-for="(p, i) in postContentProcessed">
          <!-- post content for initial display -->
          <p class="editor-writing__paragraph--visible" v-if="i <= shouldContentStopAtIndex" :key="`${post.id}-${i}`">
            <span v-if="isImg(p)" class="figure">
              <img v-if="isClientSide" :src="getImgSrc(p)" alt="post-content-img" @load="setContentImageOrientation(getImgSrc(p), $event)" @click="clickImg(p, $event)">
            </span>
            <span v-else :class="{ 'yt-iframe-container': isElementContentYoutube(p) }" v-html="p"></span>
            <span v-if="isMemoPaid === false && !isProjectPublished && i === shouldContentStopAtIndex">
              <span :style="{ marginTop: '20px', display: 'inline-block' }">...... </span>
              <span class="editor-writing__more" @click.prevent="memoDeductMach" v-text="$t('homepage.WORDING_HOME_POST_MORE')"></span>
            </span>
            <!-- read more button appeared in Home -->
            <span v-else-if="hasSource">
              <span :style="{ marginTop: '20px', display: 'inline-block' }">...... </span>
              <span class="editor-writing__more" v-text="$t('homepage.WORDING_HOME_POST_MORE')"></span>
            </span>
            <span v-else-if="shouldShowReadMoreButton(i)">
              <span class="editor-writing__more" @click.prevent="toogleReadmore" v-text="$t('homepage.WORDING_HOME_POST_MORE')"></span>
            </span>
          </p>
          <!-- rest of the post content -->
          <p v-else v-html="p"
            :class="`editor-writing__paragraph--${isReadMoreClicked ? 'visible' : 'invisible'}`" 
            :key="`${post.id}-${i}`"></p>
        </template>
      </div>    
    </div>
  </div>
</template>
<script>
  import { PROJECT_STATUS, } from 'api/config'
  import { get, } from 'lodash'

  const switchOnDeductionPanel = (store, item) => store.dispatch('SWITCH_ON_CONSUME_PANEL', { active: true, item, })

  export default {
    name: 'PostContentMemo',
    computed: {
      isMemoPaid () {
        return get(this.post, 'project.paid')
      },
      isProjectPublished () {
        return get(this.post, 'project.status') === PROJECT_STATUS.DONE
      },
    },
    data () {
      return {
        isReadMoreClicked: false,
      }
    },
    methods: {
      goMemo () {
        if (this.isMemoPaid !== false || this.isProjectPublished) {
          this.$router.push(this.targetUrl)
        }
      },
      memoDeductMach () {
        if (this.isMemoPaid === false) {
          /**
           * Go open deduction lightbox.
           */
          switchOnDeductionPanel(this.$store, this.post)
        }
      },
      toogleReadmore () {
        if (this.isMemoPaid !== false) {
          this.isReadMoreClicked = true
        }
      },
      get,
    },
    mounted () {},
    props: {
      targetUrl: {
        required: true,
      },
      postContentProcessed: {
        required: true,
      },
      shouldContentStopAtIndex: {
        required: true,
        type: Number,
      },
      getImgSrc: {
        type: Function,
        required: true,
      },
      setContentImageOrientation: {
        type: Function,
        required: true,
      },
      post: {
        type: Object,
        required: true,
      },
      isClientSide: {
        required: true,
      },
      shouldShowReadMoreButton: {
        typs: Function,
        required: true,
      },
      isArticleMain: {
        required: true,
      },
      hasSource: {
        required: true,
      },
      setOgImageOrientation: {
        required: true,
      },
      isElementContentYoutube: {
        type: Function,
        required: true,
      },
      isImg: {
        type: Function,
        required: true,
      },
      clickImg: {
        type: Function,
        required: true,
      },
    },
  }
</script>
<style lang="stylus" scoped>
  .editor-writing__container
    cursor pointer

  .post-content__hint
    display flex
    align-items center
    margin-bottom 5px
    font-size 0.875rem
    font-weight 500
    line-height normal
    color #808080
    .lock
      height 11px
      margin-right 7px

  .yt-iframe-container
    position relative
    padding-bottom 56.25% // 16:9
    padding-top 25px
    width 100%
    height 0
    display inline-block
    iframe
      position absolute
      top 0
      left 0
      width 100%
      height 100%
</style>
