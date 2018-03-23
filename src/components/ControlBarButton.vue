<template>
  <button class="controlBarButton" @click="$_controlBarButton_clickHandler" v-text="text"></button>
</template>
<script>
  
  export default {
    name: 'ControlBarButton',
    props: {
      text: {
        type: String,
        required: true,
      },
    },
    mounted () {
      this.$emit('changeBtnAmount', true)
    },
    destroyed () {
      this.$emit('changeBtnAmount', false)
    },
    methods: {
      $_controlBarButton_clickHandler () {
        this.$emit('click')
      },
    },
  }
</script>
<style lang="stylus" scoped></style>
