import sanitizeHtml from 'sanitize-html'

export const sanitizeHtmlOptions = {
  allowedAttributes: Object.assign({}, sanitizeHtml.defaults.allowedAttributes, {
    iframe: [ 'frameborder', 'allowfullscreen', 'src', 'style', 'width', 'height', 'allow' ],
    img: [ 'src', 'srcset', 'alt' ],
    div: [ 'class', 'text' ],
    script: [ 'src' ]
  }),
  allowedIframeHostnames: [ 'www.youtube.com', 'dev.readr.tw', 'www.readr.tw', 'cloud.highcharts.com', 'public.flourish.studio' ],
  allowedTags: [ 'img', 'strong', 'h1', 'h2', 'figcaption', 'em', 'blockquote', 'a', 'iframe', 'div', 'script' ],
  customContentBreakTagName: 'hr',
  transformTags: {
    'iframe': function (tagName, attribs) {
      return {
        tagName,
        attribs: Object.assign(attribs, {
          allowfullscreen: 'allowfullscreen'
        })
      }
    },
    'a': function (tagName, attribs) {
      return {
        tagName,
        attribs: Object.assign(attribs, {
          target: '_blank'
        })
      }
    }
  }
}

export const truncateDefaults = {
  defaultLimitLine: 3,
  defaultLimitLineCustomBreakTag: sanitizeHtmlOptions.customContentBreakTagName,
  defaultLimitWord: 150
}
