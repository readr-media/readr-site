<script>
export default {
  name: 'LinkItem',
  props: {
    href: {
      type: String,
      required: true
    },
    target: {
      type: String,
      default: ''
    }
  },
  render () {
    const isProjectLink = this.href.match(/\/project\//)
    const linkTag = isProjectLink ? 'a' : 'router-link'
    return (
      <linkTag href={ this.href } to={ this.href } target={ isProjectLink ? '_blank' : this.target }>
        { this.$slots.default }
      </linkTag>
    )
  }
}
</script>
