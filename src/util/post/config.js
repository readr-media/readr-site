import sanitizeHtml from 'sanitize-html'

export const sanitizeHtmlOptions = {
  allowedAttributes: Object.assign({}, sanitizeHtml.defaults.allowedAttributes, { iframe: [ 'frameborder', 'allowfullscreen', 'src', 'style', 'width', 'height', ], img: [ 'src', 'srcset', ], }),
  allowedIframeHostnames: [ 'www.youtube.com', 'dev.readr.tw', 'www.readr.tw', 'cloud.highcharts.com', ],
  allowedTags: [ 'img', 'strong', 'h1', 'h2', 'figcaption', 'em', 'blockquote', 'a', 'iframe', ],
  customContentBreakTagName: 'hr',
  transformTags: {
    'iframe': function(tagName, attribs) {
      return {
        tagName,
        attribs: Object.assign(attribs, {
          allowfullscreen: 'allowfullscreen',
        }),
      }
    },
  },
}

export const truncateDefaults = {
  defaultLimitLine: 3,
  defaultLimitLineCustomBreakTag: sanitizeHtmlOptions.customContentBreakTagName,
  defaultLimitWord: 150,
}
