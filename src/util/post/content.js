import { filter, get, map } from 'lodash'
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
  const contentDOMChildNodes = get(getPostContentDOM(post), 'childNodes')
  const paragraphsWithoutEmptyOrBreak = filter(contentDOMChildNodes, p => {
    const pHtmlStr = new XMLSerializer().serializeToString(p)
    return sanitizeHtml(pHtmlStr, options)
  })

  const paragraphsHtmlString = map(paragraphsWithoutEmptyOrBreak, p => {
    const regexHtmlTag = /<[^>]*>/g
    const regexSpecificHtmlTag = /<(a|em|strong|pre)[^>]*>/g
    const regexErrorSelfClosingTag = /<(iframe*)\b[^>]*\/>/g
    let pHtmlStr = new XMLSerializer().serializeToString(p).replace(/&lt;/g, '<')
    if (pHtmlStr.match(regexErrorSelfClosingTag)) {
      pHtmlStr = pHtmlStr.replace(regexErrorSelfClosingTag, '$&</$1>').replace('/></iframe', '></iframe')
    }

    // Add a wrapper element for the purpose of fluid 16:9 youtube iframe
    const regexIsIframe = /<(iframe)[^>]*>/g
    const regexGetSrc = /(?:src=").*?(?=[?"])/g
    const checkYoutubeIframe = html => regexIsIframe.test(html) && get(html.match(regexGetSrc), 0, '').includes('youtube')
    if (checkYoutubeIframe(pHtmlStr)) {
      pHtmlStr = `<div class="youtube-wrapper">${pHtmlStr}</div>`
    }

    const sanitize = sanitizeHtml(pHtmlStr, options)
    return (!sanitize.match(regexHtmlTag) || sanitize.match(regexSpecificHtmlTag)) ? pHtmlStr : sanitize
  })
  return paragraphsHtmlString
}
