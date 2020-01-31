<template>
  <div class="donate-wrapper">
    <SidebarDonateForm
      v-if="!showResult"
      @submitForm="onFormSubmit"
      @showResultSuccess="onShowResultSuccess"
      @showResultFail="onShowResultFail"
    />
    <SidebarDonateResult
      v-else
      :is-result-success="isResultSuccess"
      :form-data="formData"
      @backToForm="showResult = false"
      @closeSidebar="$emit('closeSidebar')"
    />
  </div>
</template>

<script>
import SidebarDonateForm from './SidebarDonateForm.vue'
import SidebarDonateResult from './SidebarDonateResult.vue'

export default {
  components: {
    SidebarDonateForm,
    SidebarDonateResult
  },
  data () {
    return {
      showResult: false,
      isResultSuccess: false,
      formData: {
        donateAmount: 0,
        carrierTypeSelected: '',
        carrierInputs: '',
        date: ''
      }
    }
  },
  methods: {
    onFormSubmit (formData) {
      this.$set(this, 'formData', formData)
    },
    onShowResultSuccess () {
      this.showResult = true
      this.isResultSuccess = true
    },
    onShowResultFail () {
      this.showResult = true
      this.isResultSuccess = false
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>
