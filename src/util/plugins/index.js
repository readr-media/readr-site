import { MM_SITE_DOMAIN } from 'src/constants'
const targetOrigin = `https://www.${MM_SITE_DOMAIN}`

export function sendGAMessageToMM ({ category = '', action = '', label = '' }) {
  window.parentIFrame.sendMessage({ messageType: 'GA', category, action, label }, targetOrigin)
}
