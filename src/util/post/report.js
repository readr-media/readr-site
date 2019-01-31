import sanitizeHtml from 'sanitize-html'
import { SITE_DOMAIN, MM_SITE_DOMAIN, OLD_PROJECTS_SLUGS, } from 'src/constants'
import { get, } from 'lodash'
import { getFullUrl, } from 'src/util/comm'

export function getReportContent (report) {
  return get(report, 'description') || get(report, 'ogDescription') || sanitizeHtml(get(report, 'content'), {
    allowedTags: [],
    allowedAttributes: {},
  })
}

export function getReportLink (report) {
  const getReportLinkBySlug = (slug) => {
    return OLD_PROJECTS_SLUGS.includes(slug) ? `https://${MM_SITE_DOMAIN}/projects/${slug}` : `https://${SITE_DOMAIN}/project/${slug}`
  }

  return get(report, 'link') || getReportLinkBySlug(get(report, 'slug'))
}

export function getReportHeroImageUrl (report) {
  return get(report, 'linkImage') || get(report, 'heroImage')
}

export function getReportHeroImage (report) {
  return getFullUrl(getReportHeroImageUrl(report))
}