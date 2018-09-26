<template>
  <div class="advanced">
    <template v-for="setting in PROFILE_SETTING">
      <div class="advanced__setting">
        <div class="advanced__setting--title"><span v-html="$t(`profile_editor.${setting.object}.${setting.name}`)"></span></div>
        <template v-if="initialized">
          <div class="advanced__setting--item" v-for="item in setting.items">
            <SettingCheckbox :value.sync="form[ item.key ]">
              <span v-text="$t(`profile_editor.${setting.object}.${item.name}`)"></span>
            </SettingCheckbox>
          </div>
        </template>
      </div>
    </template>
  </div>
</template>
<script>
  import SettingCheckbox from 'src/components/member/SettingCheckbox.vue'
  import { PROFILE_SETTING, } from 'src/constants'
  import { camelize, } from 'humps'
  import { get, map, } from 'lodash'

  const debug = require('debug')('CLIENT:Advanced')

  export default {
    name: 'Advanced',
    components: {
      SettingCheckbox,
    },
    computed: {
      formItems () {
        const items = []
        map(PROFILE_SETTING, s => {
          map(get(s, 'items'), i => {
            const key = get(i, 'key')
            key && items.push(key)
          })
        })
        return items
      },
      personalSetting () {
        return get(this.$store, 'state.personalSetting', {})
      },
    },
    data () {
      return {
        PROFILE_SETTING,
        form: {},
        initialized: false,
      }
    },
    methods: {
      initForm () {
        const form = {}
        map(this.formItems, k => {
          debug('get(this.personalSetting, camelize(k))', k, get(this.personalSetting, camelize(k)))
          form[ k ] = get(this.personalSetting, camelize(k)) || false
        })
        this.form = form
        this.initialized = true
      },
    },
    mounted () {
      this.fetchPersonalSetting(this.$store).then(() => this.initForm())
    },
    props: {
      values: {
        type: Object,
      },
      fetchPersonalSetting: {
        type: Function,
        default: () => new Promise(resolve => resolve()),
      },
    },
    watch: {
      form () {
        this.$emit('update:values', this.form)
      },
    },
  }
</script>
<style lang="stylus" scoped>
  .advanced
    background-color #fff
    padding 15px
    &__setting
      &:not(:first-child)
        margin-top 15px
      &--title
        &:not(:last-child)
          margin-bottom 2px
        font-size 0.9375rem
        font-weight 500
        line-height normal
      &--item
        font-size 0.9375rem
        font-weight 300
        line-height normal
</style>