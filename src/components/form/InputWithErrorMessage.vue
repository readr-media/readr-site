<template>
  <div :class="{ error: showErrorMessage }">
    <input
      v-model="value"
      :type="type"
      :disabled="disabled"
      :readonly="readonly"
      :required="required"
      :placeholder="placeholder"
    >
    <span
      v-if="errorMessage && showErrorMessage"
      v-text="errorMessage"
    />
  </div>
</template>
<script>

export default {
  name: 'InputWithErrorMessage',
  props: {
    autocomplete: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    errorMessage: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    readonly: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: false
    },
    showErrorMessage: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'text'
    },
    initValue: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      value: this.initValue
    }
  },
  watch: {
    value (value) {
      this.$emit('update:initValue', value)
    }
  }
}
</script>
<style lang="stylus" scoped>
input
  width 100%
  padding .2em .4em

span
  color red
  font-size .875rem

.error
  input
    border 1px solid red !important
</style>
