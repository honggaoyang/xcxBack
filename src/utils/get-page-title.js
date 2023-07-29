import defaultSettings from '@/settings'

const title = defaultSettings.title || '小程序后台'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
