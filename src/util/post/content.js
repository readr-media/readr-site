import { get, map, } from 'lodash'
import sanitizeHtml from 'sanitize-html'
import { sanitizeHtmlOptions, } from './config'
const dom = require('xmldom').DOMParser
const seializer  = require('xmldom').XMLSerializer

const {
  allowedAttributes,
  allowedIframeHostnames,
  allowedTags,
  customContentBreakTagName,
} = sanitizeHtmlOptions

export function getPostContentDOM (post) {
  const options = {
    allowedTags: false,
    allowedAttributes,
    allowedIframeHostnames,
    selfClosing: [ 'img', customContentBreakTagName, ],
  }
  const wrappedContent = sanitizeHtml(post.content, options)
  const doc = new dom().parseFromString(wrappedContent)
  return doc
}

export function getPostContentStrings (post) {
  if (!post.content || post.content.length === 0) { return [] }

  const options = {
    allowedTags,
    allowedAttributes,
    allowedIframeHostnames,
  }
  const postParagraphs = map(get(getPostContentDOM(post), 'childNodes'), (p) => (sanitizeHtml(new seializer().serializeToString(p), options)))
  return postParagraphs
}