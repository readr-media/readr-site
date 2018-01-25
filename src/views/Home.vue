<template>
  <div class="homepage">
    <!-- <app-header :sections="sections"></app-header> -->
    <!-- <div class="celebrities-talk block">
      <div class="block__title"><h2 v-text="sections[ 'celebrities-talk' ]"></h2></div>
      <div class="block__content">
        <div :style="{ width: '100%', height: '213px', backgroundColor: 'black' }"></div>
      </div>
    </div>
    <div class="hot-talk block">
      <div class="block__title"><h2 v-text="sections[ 'hot-talk' ]"></h2></div>
      <div class="block__content">
        <div class="block__content__item" v-for="n in 3">
          <div class="block__content__item__left">
            <div class="thumbnail">
              <img src="/public/icons/account.png">
            </div>
          </div>
          <div class="block__content__item__right">
            <div class="name"><span v-text="'某總編'"></span></div>
            <div class="title"><h3 v-text="'台北不是我的家！？租屋黑市大揭露'"></h3></div>
            <div class="content"><p v-text="'根據線上訂餐服務「Seamless」的數據顯示，美國大學生期末考期間購買高熱量食物......'"></p></div>
            <div class="info"></div>
          </div>
        </div>
      </div>
    </div> -->
    <div class="homepage__container">
      <aside class="homepage__aside">
        <AppAsideNav/>
      </aside>
      <main class="homepage__main">
        <HomeCustomEditorList/>
      </main>
    </div>
  </div> 
  
</template>
<script>
  // import { SECTIONS_DEFAULT } from '../constants'
  import { removeToken } from '../util/services'
  // import AppHeader from '../components/AppHeader.vue'
  import AppAsideNav from '../components/AppAsideNav.vue'
  import HomeCustomEditorList from '../components/home/HomeCustomEditorList.vue'

  export default {
    components: {
      // 'app-header': AppHeader,
      AppAsideNav,
      HomeCustomEditorList
    },
    computed: {
      // sections () {
      //   return SECTIONS_DEFAULT
      // }
    },
    name: 'Home',
    methods: {
      logout () {
        removeToken()
      }
    },
    mounted () {
      // console.log('currentUser', currentUser())
      // console.log('isLoggedIn', isLoggedIn())
    }
  }
</script>
<style lang="stylus" scoped>
  .homepage
    background-color #e6e6e6
    min-height 100vh
    &__container
      max-width 1085px
      margin auto
      padding 60px 0
      display flex
    &__aside
      width 75px
      height 100%
      position sticky
      // position fixed
      top 60px
    &__main
      margin-left 30px
    .block
      padding 0 17px
      margin 20px auto
      &__title
        h2
          font-size 0.9375rem
          font-weight 600
          color #000
          letter-spacing 3px
      &__content
        &__item
          display flex
          border-bottom solid 1px #979797
          padding 9px 0
          &__left
            .thumbnail
              width 65px
              height 65px
              border-radius 50%
              overflow hidden
              > img
                width 100%
                height 100%
                object-fit contain
                object-position center center
          &__right
            padding-left 10px
            .name
              font-size 0.85rem
              font-weight 500
            .title
              h3
                font-size 0.9375rem
                margin 8px 0
                font-weight 400
            .content
              font-size 0.85rem
              line-height 1.125rem
              font-weight 300

</style>