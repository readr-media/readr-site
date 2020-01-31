<template>
  <div class="tag-item">
    <span
      v-text="tag.text"
    />
  </div>
</template>
<script>
export default {
  name: 'TagItem',
  props: {
    tag: {
      type: Object,
      required: true
    }
  }
}
</script>
