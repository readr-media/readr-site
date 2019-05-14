import { SITE_FULL, URL_SHARE_FB, URL_SHARE_LINE } from 'src/constants'

export function createShareUrl (socialMedia = 'fb', url = SITE_FULL) {
  const createUTMQueryString = (url, utmSource) => {
    try {
      const urlInstance = new URL(url)

      let params = new URLSearchParams(urlInstance.search.slice(1))
      params.append('utm_source', utmSource)
      params.append('utm_medium', 'sharebutton')
      urlInstance.search = `?${params.toString()}`

      return encodeURIComponent(urlInstance.toString())
    } catch (error) {
      return SITE_FULL
    }
  }

  switch (socialMedia) {
    case 'fb':
      return `${URL_SHARE_FB}?u=${createUTMQueryString(url, 'facebook')}`
    case 'line':
      return `${URL_SHARE_LINE}?url=${createUTMQueryString(url, 'line')}`
    case 'copylink':
      return `${url}?rref=copylinkshare`
    default:
      return `${URL_SHARE_FB}?u=${createUTMQueryString(url, 'facebook')}`
  }
}
