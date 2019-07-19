<template>
  <section class="intro">
    <div class="intro__landing landing">
      <img
        class="landing__img"
        src="/public/2.0/about/assets/關於我們-web.svg"
        alt="intro"
      >
    </div>
    <footer class="intro__footer footer">
      <p class="footer__description description">
        <span>
          提供有趣、多元的新聞報導，例如
        </span>
        <span class="description__highlight">
          數據分析
        </span>
        <span>
          、
        </span>
        <span class="description__highlight">
          多媒體互動
        </span>
        <span>
          ，
        </span>
        <span class="description__highlight">
          理想的閱讀體驗
        </span>
        <span>
          都會是我們提供的服務
        </span>
      </p>
    </footer>
  </section>
</template>

<style lang="stylus" scoped>
.landing
  background-color #69CAD3
  padding 50px 100px

.footer
  height 100px
  background-color #363C5C
  display flex
  justify-content center
  padding 20px 0 50px 0

.description
  color white
  font-size 20px
  &__highlight
    color #DDD01F
</style>
