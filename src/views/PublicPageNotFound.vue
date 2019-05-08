<template>
  <div class="page-not-found">
    <div class="page-not-found__top top">
      <div class="top__back-to-home back-to-home">
        <img
          class="back-to-home__404-img"
          src="/public/404.png"
          alt=""
        >
        <div class="back-to-home__to-home to-home">
          <p
            class="to-home__hint"
            v-text="$t('NOT_FOUND.TO_HOME_HINT')"
          />
          <button
            class="to-home__button"
            @click="$router.push('/')"
            v-text="$t('NOT_FOUND.TO_HOME_BUTTON')"
          />
        </div>
      </div>
    </div>
    <div class="page-not-found__bottom bottom">
      <ol class="bottom__projects-list projects-list">
        <li
          v-for="(project, i) in projects"
          :key="get(project, 'id', i)"
          class="projects-list__list-item list-item"
        >
          <router-link :to="project.slug ? `/series/${project.slug}` : '/'">
            <template v-if="isClientSide">
              <img
                v-if="project.heroImage"
                :src="getFullUrl(get(project, 'heroImage', ''))"
                class="list-item__project-img"
                alt=""
              >
              <div
                v-else
                class="list-item__project-img list-item__project-img--no-img"
                v-text="get(project, 'title', '')"
              />
            </template>
            <p
              class="list-item__project-title"
              v-text="get(project, 'title', '')"
            />
          </router-link>
        </li>
      </ol>
    </div>
  </div>
</template>

<script>
import { get, take } from 'lodash'
import { PROJECT_PUBLISH_STATUS, PROJECT_STATUS } from 'api/config'
import { getFullUrl, isClientSide } from 'src/util/comm'

const DEFAULT_PAGE = 1
const DEFAULT_SORT = 'project_order,-updated_at'
const MAXRESULT = 9
// const debug = require('debug')('CLIENT:404')
const fetchProjectsList = (store, {
  maxResult = MAXRESULT,
  page = DEFAULT_PAGE,
  sort = DEFAULT_SORT
} = {}) => {
  return store.dispatch('GET_PUBLIC_PROJECTS', {
    params: {
      max_result: maxResult,
      page: page,
      sort: sort,
      where: {
        status: [ PROJECT_STATUS.DONE, PROJECT_STATUS.WIP ],
        publish_status: PROJECT_PUBLISH_STATUS.PUBLISHED
      }
    }
  })
}

export default {
  name: 'PageNotFound',
  data () {
    return {
      projectLimit: 3
    }
  },
  computed: {
    projects () {
      return take(get(this.$store.state, [ 'publicProjects', 'normal' ], []), this.projectLimit)
    },
    isClientSide
  },
  asyncData ({ store }) {
    return fetchProjectsList(store)
  },
  methods: {
    get,
    getFullUrl (url) {
      return url.includes('http') ? url : getFullUrl(url)
    }
  }
}
</script>

<style lang="stylus" scoped>
.page-not-found
  position fixed
  top 0
  left 0
  height 100vh
  width 100vw
  background-color white
  z-index 1000
  &__top
    height 50%
  &__bottom
    height 50%
    background-color #808080

.back-to-home
  height 100%
  display flex
  justify-content center
  align-items flex-end
  &__404-img
    height 250px
  &__to-home
    margin 0 0 0 10px

.to-home
  display flex
  flex-direction column
  align-items center
  &__hint
    font-size 30px
    color #8c8c8c
  &__button
    border 3px solid #8c8c8c
    border-radius 50px
    font-size 50px
    font-weight 900
    color #808080
    width 300px
    margin 0 0 40px 0
    &:focus
      outline none

.bottom
  display flex
  justify-content center

.projects-list
  list-style none
  margin 40px 0 0 0
  padding 0
  display flex
  justify-content center

.list-item
  & + &
    margin 0 0 0 10px
  &__project-img
    width 300px
    height 157.5px
    object-fit cover
    background-color #11b8c9
    &--no-img
      display flex
      justify-content center
      align-items center
      font-size 25px
      color white
  &__project-title
    width 300px
    white-space nowrap
    overflow hidden
    text-overflow ellipsis
    margin 0
    padding 10px 0 10px 10px
    border-left 1px solid white
    color white
</style>
