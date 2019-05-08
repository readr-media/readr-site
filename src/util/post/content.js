import { get, map } from 'lodash'
import sanitizeHtml from 'sanitize-html'
import { sanitizeHtmlOptions } from './config'
const DOMParser = require('xmldom').DOMParser
const XMLSerializer = require('xmldom').XMLSerializer

const {
  allowedAttributes,
  allowedIframeHostnames,
  allowedTags,
  customContentBreakTagName,
  transformTags
} = sanitizeHtmlOptions

export function getPostContentDOM (post) {
  const options = {
    allowedTags: false,
    allowedAttributes,
    allowedIframeHostnames,
    selfClosing: [ 'img', customContentBreakTagName ],
    transformTags
  }
  const wrappedContent = sanitizeHtml(post.content, options)
  const doc = new DOMParser().parseFromString(wrappedContent)
  return doc
}

export function getPostContentStrings (post) {
  if (!post.content || post.content.length === 0) { return [] }

  const options = {
    allowedTags,
    allowedAttributes,
    allowedIframeHostnames,
    transformTags
  }
  const postParagraphs = map(get(getPostContentDOM(post), 'childNodes'), p => {
    const pHtmlStr = new XMLSerializer().serializeToString(p)
    const exp = /<([a-zA-Z0-9]*)\b[^>]*\/>/g
    return sanitizeHtml(pHtmlStr.replace(exp, '$&</$1>'), options)
  })
  return postParagraphs
}
