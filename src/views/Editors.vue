<template>
  <div class="editors">
    <div class="editors__container">
      <aside class="editors__aside">
        <AppAsideNav/>
      </aside>
      <main class="editors__main">
        <AppTitledList :listTitle="'本週客座'">
          <EditorsIntro class="editors-intro-main" v-for="customEditor in customEditors" :editor="customEditor"/>
        </AppTitledList>
        <ul class="editors__list-aside">
          <EditorsIntro class="editors-intro-aside" v-for="customEditor in customEditors" :editor="customEditor" :trimDescription="true"/>
        </ul>
      </main>
    </div>
  </div>
</template>

<script>
import AppAsideNav from '../components/AppAsideNav.vue'
import AppTitledList from '../components/AppTitledList.vue'
import EditorsIntro from '../components/editors/EditorsIntro.vue'
import _ from 'lodash'

const getCustomEditors = (store, { page, sort }) => {
  return store.dispatch('GET_PUBLIC_MEMBERS', {
  // return store.dispatch('GET_MEMBERS', {
    params: {
      custom_editor: true
    }
  })
}
const fetchFollowing = (store, params) => {
  if (params.subject) {
    return store.dispatch('GET_FOLLOWING_BY_USER', {
      subject: params.subject,
      resource: params.resource
    })
  } else {
    return store.dispatch('GET_FOLLOWING_BY_RESOURCE', {
      resource: params.resource,
      ids: params.ids
    })
  }
}

export default {
  components: {
    AppAsideNav,
    AppTitledList,
    EditorsIntro
  },
  computed: {
    customEditors () {
      return _.get(this.$store, 'state.customEditors.items', [])
    }
  },
  beforeMount () {
    Promise.all([
      getCustomEditors(this.$store, {})
    ]).then(() => {
      if (this.$store.state.isLoggedIn) {
        const customEditorsIds = this.$store.state.customEditors.items.map(editor => editor.id)
        fetchFollowing(this.$store, {
          resource: 'member',
          ids: customEditorsIds
        })
      }
    })
  }
}
</script>

<style lang="stylus" scoped>
.editors
  background-color #e6e6e6
  min-height 100vh
  &__container
    max-width 1200px
    margin auto
    padding 60px 0
    display flex
  &__aside
    width 75px
    height 100%
    position sticky
    // position fixed
    top 60px
    z-index 999
  &__main
    margin-left 40px
    display flex
    justify-content flex-start
    align-items flex-start
  &__list-aside
    background-color white
    list-style none
    padding 16px 0
    margin 0
    margin-left 35px

.editors-intro-main
  width calc(650px - 20px - 20px)
  margin 0 20px
  padding 14px 0 10px 0
.editors-intro-aside
  width calc(355px - 15px - 15px)
  margin 0 15px
  padding 10px 0
</style>


