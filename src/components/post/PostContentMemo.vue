<template>
  <div>
    <h1 class="post-content__title" v-text="post.title"></h1>
    <div class="editor-writing">
      <div class="editor-writing__container" @click="goMemo">
        <template v-for="(p, i) in postContentProcessed">
          <!-- post content for initial display -->
          <p class="editor-writing__paragraph--visible" v-if="i <= shouldContentStopAtIndex" :key="`${post.id}-${i}`">
            <!-- <span v-html="p"></span> -->
            <span v-if="isImg(p)" class="figure">
              <img v-if="isClientSide" :src="getImgSrc(p)" alt="post-content-img" @load="setContentImageOrientation(getImgSrc(p), $event)">
            </span>
            <span v-else v-html="p"></span>
            <span v-if="shouldShowReadMoreButton(i)">
              <span class="editor-writing__more" @click.prevent="toogleReadmore" v-text="$t('homepage.WORDING_HOME_POST_MORE')"></span>
            </span>
          </p>
          <!-- rest of the post content -->
          <p v-else v-html="p"
            :class="`editor-writing__paragraph--${isReadMoreClicked ? 'visible' : 'invisible'}`" 
            :key="`${post.id}-${i}`"></p>
        </template>
        <template v-if="isMemoPaid === false && !isProjectPublished">
          <span :style="{ marginTop: '20px', display: 'inline-block' }">...... </span>
          <span class="editor-writing__more" @click.prevent="memoDeductMach" v-text="$t('homepage.WORDING_HOME_POST_MORE')"></span>
        </template>
      </div>    
    </div>
    <a class="editor-writing-source" v-if="isArticleMain && hasSource" :href="post.link" target="_blank">
      <div class="editor-writing-source__content">
        <h1 class="editor-writing-source__title" v-text="linkTitleTrim"></h1>
        <div class="editor-writing-source__description">
          <p v-text="linkDescriptionTrim"></p>
          <p class="editor-writing-source__cite" v-if="post.linkName">{{ $t('homepage.WORDING_HOME_POST_SOURCE') }}{{ post.linkName }}</p>
        </div>
      </div>
      <img class="editor-writing-source__figure" v-if="post.linkImage" :src="post.linkImage" @load="setOgImageOrientation(post.linkImage, $event)">
    </a>
    <BaseLightBox :showLightBox.sync="showMemoDeduction" borderStyle="nonBorder" v-if="isMemoPaid === false && !isProjectPublished" @closeLightBox="hideMemoDeduction()">
      <div class="project-memo-alert">
        <div class="project-memo-alert__content">
          <h2 v-text="$t('PROJECT.JOIN_CONTENT_1')"></h2>
          <h1 v-text="get(post, 'project.title')"></h1>
          <h2>{{ $t('PROJECT.JOIN_CONTENT_2') }}<strong v-text="get(post, 'project.memoPoints', 0) || 0"></strong>{{ $t('PROJECT.JOIN_CONTENT_POINT') }}</h2>
          <button
            :disabled="memoDeducting"
            @click="memoDeduct()"
            v-text="memoDeducting ? `${$t('PROJECT.DEDUCTING')} ...` : $t('PROJECT.JOIN_CONFIRM')">
          </button>
        </div>
      </div>
    </BaseLightBox>    
  </div>
</template>
<script>
  import { POINT_OBJECT_TYPE, PROJECT_STATUS, } from 'api/config'
  import { get, } from 'lodash'
  import BaseLightBox from 'src/components/BaseLightBox.vue'
  import truncate from 'html-truncate'

  const deductPoints = (store, { objectId, memoPoints, } = {}) => {
    return store.dispatch('ADD_REWARD_POINTS_TRANSACTIONS', {
      params: {
        member_id: get(store, [ 'state', 'profile', 'id', ]),
        object_type: POINT_OBJECT_TYPE.PROJECT_MEMO,
        object_id: objectId,
        points: memoPoints,
      },
    })
  }

  export default {
    name: 'PostContentMemo',
    components: {
      BaseLightBox,
    },
    computed: {
      isMemoPaid () {
        return get(this.post, 'project.paid')
      },
      linkTitleTrim () {
        return truncate(this.post.linkTitle, 20)
      },
      linkDescriptionTrim () {
        return truncate(this.post.linkDescription, 45)
      },
      isProjectPublished () {
        return get(this.post, 'project.publishStatus') === PROJECT_STATUS.DONE
      },
    },
    data () {
      return {
        isReadMoreClicked: false,
        showMemoDeduction: false,
        memoDeducting: false,
      }
    },
    methods: {
      goMemo () {
        if (this.isMemoPaid !== false || this.isProjectPublished) {
          this.$router.push(this.targetUrl)
        }
      },
      memoDeduct () {
        this.memoDeducting = true
        deductPoints(this.$store, { objectId: get(this.post, 'projectId'), memoPoints: get(this.post, 'project.memoPoints') || 0, })
        .then(() => {
          this.showMemoDeduction = false
          location.reload()
        })        
      },   
      memoDeductMach () {
        if (this.isMemoPaid === false) {
          this.showMemoDeduction = true
        }
      },      
      toogleReadmore () {
        if (this.isMemoPaid !== false) {
          this.isReadMoreClicked = true
        }
      },
      hideMemoDeduction () {
        this.showMemoDeduction = false
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
      isImg: {
        type: Function,
        required: true,
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
    },
  }
</script>
<style lang="stylus" scoped>
  .editor-writing__container
    cursor pointer
  .project-memo-alert
    position relative
    min-width 500px
    min-height 400px
    background-color #11b8c9
    background-image url(/public/icons/join.png)
    background-position calc(100% - 20px) center
    background-size 185px auto
    background-repeat no-repeat
    border 5px solid #fff
    &__content
      position absolute
      left 30px
      bottom 60px
      h1
        max-width 290px
        margin 1em 0 0
        color #fff
        font-size 1.875rem
        font-weight 400
        letter-spacing 1px
      h2
        margin 0
        font-size 1.125rem
        strong
          color #fff
          font-size 1.875rem
          margin 0 .2em
      button
        width 290px
        margin-top 30px
        padding 15px 0
        color #11b8c9
        font-size 1.875rem
        background-color #fff
        border none
        transition color .5s
        &:disabled
          color rgba(17, 184, 201, .6)
</style>
