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
    const isHttpLink = this.href.match(/https?:\/\//)
    const linkTag = isHttpLink ? 'a' : 'router-link'
    return (
      <linkTag href={ this.href } to={ this.href } target={ isHttpLink ? '_blank' : this.target }>
        { this.$slots.default }
      </linkTag>
    )
  }
}
</script>
