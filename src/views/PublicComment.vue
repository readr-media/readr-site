<template>
  <div class="public-comments">
    <div v-if="isClientSide && !isLoggedIn">
      <RecoverPassword v-if="isGoingRecoverPwd"/>
      <Login v-else @goRecoverPwd="goRecoverPwd"/>
    </div>
    <CommentContainer
      :asset="resourceURL"
      :isPublic="true"
      @heightChanged="sendHeight"
    />
  </div>
</template>

<script>
import Login from 'src/components/login/Login.vue'
import RecoverPassword from 'src/components/login/RecoverPassword.vue'
import CommentContainer from 'src/components/comment/CommentContainer.vue'

const getDisposableToken = (store) => {
  return store.dispatch('DISPOSABLE_TOKEN', {
    type: 'register',
  })
}

export default {
  props: {
    resourceURL: {
      typs: String,
      default: '',
    },
  },
  components: {
    Login,
    RecoverPassword,
    CommentContainer,
  },
  data () {
    return {
      comments_raw: [],
      isGoingRecoverPwd: false,
      isClientSide: false,
      pymChild: undefined,
    }
  },
  computed: {
    isLoggedIn () {
      return this.$store.state.isLoggedIn
    },
  },
  methods: {
    goRecoverPwd () {
      this.isGoingRecoverPwd = true
    },
    sendHeight () {
      this.pymChild.sendHeight()
    }, 
  },
  beforeMount () {
    Promise.all([
      getDisposableToken(this.$store),
    ])
  },
  mounted () {
    this.isClientSide = true
    const pym = require('pym.js/dist/pym.v1.js')
    this.pymChild = new pym.Child()
  },
}
</script>

<style lang="stylus" scoped>
.public-comments
  padding 0 20px 20px 20px
</style>


