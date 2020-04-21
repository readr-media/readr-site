<template>
  <section :class="[ postType, 'post' ]">
    <div id="fb-root" />
    <figure v-if="!isReview && postImage">
      <img
        :src="postImage"
        :alt="post.title || post.ogTitle"
      >
    </figure>
    <main class="app-content-area">
      <p
        class="post__date small"
        v-text="dayjs(post.publishedAt).format('YYYY/MM/DD')"
      />
      <h1 v-text="post.title || post.ogTitle" />
      <PostAuthor
        v-if="post.author && post.author.nickname"
        :author="post.author"
        :post-type="postType"
        class="post__author"
      />
      <article v-html="postContentProcessed" />
      <TagsInPost
        v-if="post.tags && post.tags.length > 0"
        :tags="post.tags"
        class="post__tags"
      />
      <PostReviewLink
        v-if="isReview"
        :description="post.linkDescription"
        :image="post.linkImage"
        :link="post.link"
        :source-name="post.linkName"
        :title="post.linkTitle"
        class="post__review-link"
      />
    </main>
    <lazy-component
      class="post-bottom"
      @show="fetchSeries"
    >
      <DonateWithShare
        :url="getPostFullUrl(post)"
        class="app-content-area"
        @donate="toggleNavDonate"
      />
      <div
        v-if="seriesPostsFiltered.length > 0 || seriesFiltered.length > 0"
        class="app-content-area post__related"
      >
        <template v-if="seriesPostsFiltered.length > 0">
          <h2>繼續閱讀</h2>
          <PostList
            :items="seriesPostsFiltered"
            ga-event-label="tableofcontents"
            class="post__post-list"
          />
        </template>
        <template v-if="seriesFiltered.length > 0">
          <h2>更多專題</h2>
          <SeriesList
            :item-style="'comm-series-more'"
            :items="seriesFiltered"
            ga-event-label="series"
            class="post__series-list"
          />
        </template>
      </div>
    </lazy-component>
    <div class="fb-quote" />
  </section>
</template>
<script>
import { SITE_FULL, SITE_NAME } from 'src/constants'
import { createPost } from 'src/util/post'
import { getPostFullUrl } from 'src/util/post/index'
import { mapMutations, mapState } from 'vuex'

import DonateWithShare from 'src/components/DonateWithShare.vue'
import PostAuthor from 'src/components/post/PostAuthor.vue'
import PostList from 'src/components/post/PostList.vue'
import PostReviewLink from 'src/components/post/PostReviewLink.vue'
import SeriesList from 'src/components/series/SeriesList.vue'
import TagsInPost from 'src/components/tag/TagsInPost.vue'
import dayjs from 'dayjs'

export default {
  name: 'AppPost',
  components: {
    DonateWithShare,
    PostAuthor,
    PostList,
    PostReviewLink,
    SeriesList,
    TagsInPost
  },
  metaInfo () {
    const title = this.post.title
    const description = this.post.ogDescription || this.postProcessed.contentTruncateWithoutHtml
    const image = this.post.ogImage || this.post.heroImage || `${SITE_FULL}/public/og-image.jpg`
    const script = [
      {
        innerHTML: `
          (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id;
            js.src = 'https://connect.facebook.net/zh_TW/sdk.js#xfbml=1&version=v4.0';
            fjs.parentNode.insertBefore(js, fjs);
          }(document, 'script', 'facebook-jssdk'));
        `
      }
    ]
    return {
      title,
      script,
      meta: [
        { name: 'description', content: description },
        { vmid: 'og:type', property: 'og:type', content: 'article' },
        { vmid: 'og:title', property: 'og:title', content: `${title} - ${SITE_NAME}` },
        { vmid: 'og:description', property: 'og:description', content: description },
        { vmid: 'og:url', property: 'og:url', content: getPostFullUrl(this.post) },
        { vmid: 'og:image', property: 'og:image', content: image }
      ],
      __dangerouslyDisableSanitizers: [ 'script' ]
    }
  },
  computed: {
    ...mapState({
      post: state => state.DataPost.post,
      series: state => state.DataSeries.publicProjects.normal,
      seriesPosts: state => state.DataSeriesContents.publicProjectContents,
      showSidebar: state => state.UIAppHeader.showSidebar
    }),
    isReview () {
      return this.postType === 'review'
    },
    postContentProcessed () {
      const contentProcessed = this.postProcessed.contentProcessed || []
      return contentProcessed.join('')
    },
    postImage () {
      return this.post.heroImage || this.post.ogImage
    },
    postProcessed () {
      return createPost(this.post)
    },
    postType () {
      return this.postProcessed.typeProcessed
    },
    seriesFiltered () {
      return this.series
        .filter(series => series.id !== this.post.projectId)
        .slice(0, 3)
    },
    seriesPostsFiltered () {
      return this.seriesPosts
        .filter(post => post.id !== Number(this.$route.params.postId))
        .slice(0, 3)
    }
  },
  asyncData ({ store, route }) {
    return store.dispatch('DataPost/GET_POST', { id: route.params.postId, showAuthor: true, showTag: true })
      .catch(err => {
        const error = { code: err.status }
        throw error
      })
  },
  methods: {
    ...mapMutations({
      SET_SHOW_SIDEBAR: 'UIAppHeader/SET_SHOW_SIDEBAR',
      SET_CURRENT_SIDEBAR_SLOT: 'UIAppHeader/SET_CURRENT_SIDEBAR_SLOT'
    }),
    dayjs,
    fetchSeries () {
      this.$store.dispatch('DataSeries/FETCH', { maxResult: 4 })
    },
    getPostFullUrl,
    toggleNavDonate () {
      if (!this.showSidebar) {
        this.SET_CURRENT_SIDEBAR_SLOT('donate')
      }
      this.SET_SHOW_SIDEBAR(!this.showSidebar)
    }
  }
}
</script>
<style lang="stylus" scoped>
  .post
    position relative
    padding-top 100px
    figure
      position relative
      width 1000px
      padding-top calc(1000px * 0.5625)
      margin 0 auto
      overflow hidden
      img
        position absolute
        top 0
        left 0
        width 100%
        height 100%
        object-fit cover
        object-position center center
    main
      display flex
      flex-direction column
      padding 1em 0 5em
      > *
        order 10
      h1
        order 2
      article
        order 4
      .post__date
        order 1
      .post__author
        order 3
      .post__review-link
        order 9
    article
      margin 1.5rem 0 0
      >>> *
        & + *
          margin-top 1.5rem
        & + p
          margin-top 17px
      >>> p
        line-height 1.86
        text-align justify
        & + *
          margin-top 17px
      >>> a
        border-bottom 2px solid #11b8c9
      >>> img
        position relative
        top 0
        left -12.5%
        width 125%
      >>> .youtube-wrapper
        position relative
        padding-bottom 56.25% /* 16:9 */
        padding-top 25px
        height 0
        & iframe
          position absolute
          top 0
          left 0
          width 100%
          height 100%
      >>> .readme-image
        &:after
          display block
          content attr(text)
          margin-top .2em
          color #4a4a4a
          font-size 0.875rem
          text-align center
          font-weight normal
          line-height normal
      >>> .readme-embed
        > div
          display none
    h1
      & + *
        margin-top 1.5rem
    h2
      & + div
        margin-top 1.5rem
    p
      &.small
        color #4a4a4a
        & + h1
          margin-top 1.5rem
      & + h1
        margin-top 17px
    &::after
      content ''
      position absolute
      left 50%
      bottom 0
      transform translateX(-50%)
      width 60%
      max-width 800px
      height 5px
      background-color #000
    &__related
      margin 2em auto 0
      h2, div
        & + h2, & + div
          margin-top .5em
    &__post-list
      display flex
      flex-direction column
      >>> .list-item
        display flex
        width 100%
        padding-bottom .5em
        &:last-child
          border-bottom none
        & + .list-item
          margin-top .5em
        .date
          display none
        p
          & + p
            margin-top 1em
        figure
          width 33%
          padding-top calc(33% * 0.5625)
          border 1px solid #979797
          & + p
            margin-top 0
        .list-item__content
          flex 1
          margin 0 0 0 15px
          border-bottom 1px solid #979797

    &__series-list
      display flex
      flex-wrap wrap
      justify-content space-between
      >>> .list-item
        .description
          display none
    &__tags
      display flex
      flex-wrap wrap
      margin-top 30px
    &__review-link
      margin 30px auto 0
    .post-bottom
      margin 0
      padding 30px 0 60px
      background-color #fff
    &.review
      .post__author
        order 0
      .post__date
        margin-top .5em

@media (min-width: 1024px)
  .post
    &.review
      .post__date
        margin-top 1em
</style>
