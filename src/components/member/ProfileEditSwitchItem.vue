<template>
  <div class="form__switcher">
    <div class="top title"><span v-text="title"></span></div>
    <div class="bottom">
      <div class="desc"><span v-text="desc"></span></div>
      <div class="switcher">
        <BooleanSwitcher :status.sync="status"></BooleanSwitcher>
      </div>
    </div>
  </div>
</template>
<script>
  import BooleanSwitcher from 'src/components/form/BooleanSwitcher.vue'
  export default {
    name: 'ProfileEditSwitchItem',
    components: {
      BooleanSwitcher,
    },
    data () {
      return {
        status: this.value,
      }
    },
    methods: {},
    mounted () {},
    props: {
      title: {
        type: String,
        default: '',
      },
      desc: {
        type: String,
        default: '',
      },
      value: {
        type: Boolean,
        default: false,
      },
      defaultVal: {
        default: false,
      },
    },
    watch: {
      status () {
        this.$emit('update:value', this.status)
      },
      defaultVal () {
        this.status = this.defaultVal
      },
    },
  }
</script>
<style lang="stylus" scoped>
  .bottom
    margin-top 5px
    display flex
    justify-content space-between
    width 100%
    .desc
      flex 1
    .switcher
      width 60px
</style>