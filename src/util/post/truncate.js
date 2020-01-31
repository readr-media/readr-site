import truncate from 'truncate-html'
import { get, findIndex, take } from 'lodash'
import { truncateDefaults } from './config'
import { getPostContentDOM, getPostContentStrings } from './content'

const {
  defaultLimitLine,
  defaultLimitLineCustomBreakTag,
  defaultLimitWord
} = truncateDefaults

truncate.setup({
  length: defaultLimitWord,
  ellipsis: '',
  keepWhitespaces: true
})

function findCustomBreak (postContentDOM) {
  return findIndex(get(postContentDOM, 'childNodes'), [ 'tagName', defaultLimitLineCustomBreakTag ])
}

function getLineBreak (postContentDOM) {
  const customBreak = findCustomBreak(postContentDOM)
  return customBreak !== -1 ? customBreak : defaultLimitLine
}

function getContentTruncatedLines (post) {
  const dom = getPostContentDOM(post)
  const paragraphs = getPostContentStrings(post)
  const lineBreakAt = getLineBreak(dom)
  const contentTruncatedLines = take(paragraphs, lineBreakAt)

  return contentTruncatedLines
}

function getContentTruncatedWords (post) {
  const contentTruncatedLines = getContentTruncatedLines(post)
  return truncate(contentTruncatedLines.join('<br>')).split('<br>')
}

export function truncatePostContent (post = {}) {
  const dom = getPostContentDOM(post)
  const customBreak = findCustomBreak(dom)
  const contentTruncatedLines = getContentTruncatedLines(post)
  const contentTruncatedWords = getContentTruncatedWords(post)

  return customBreak !== -1 ? contentTruncatedLines : contentTruncatedWords
}
