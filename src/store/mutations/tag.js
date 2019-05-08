// const debug = require('debug')('CLIENT:mutations:tag')

const SET_POST_REPORT_BY_TAG = (state, data) => {
  state['itemsByTag'] = data || {}
}

const SET_PUBLIC_TAGS = (state, { tags }) => {
  state['publicTags'] = tags || []
}

const SET_TAGS = (state, { tags }) => {
  state['tags'] = tags || []
}
const INIT_TAGS_MOUSEEVENT = (state, { tags }) => {
  let obj = {}
  tags.forEach(tag => { obj[tag.id] = false })
  state['tagsIsMouseover'] = obj
}
const SET_TAGS_MOUSEEVENT = (state, { id, value }) => {
  state['tagsIsMouseover'][id] = value
}
const SET_TAGS_COUNT = (state, { meta }) => {
  state['tagsCount'] = meta.total
}

export {
  SET_POST_REPORT_BY_TAG,
  SET_PUBLIC_TAGS,
  SET_TAGS,
  INIT_TAGS_MOUSEEVENT,
  SET_TAGS_MOUSEEVENT,
  SET_TAGS_COUNT
}
