import { renderProps, SearchParams } from "./types/index";

export function parseQuery(): SearchParams{
  const searchStr = location.search
  const search = searchStr[0] === '?' ? searchStr.slice(1) : searchStr
  return search.split('&').reduce((pre: SearchParams, cur) => {
    const [k, v] = cur.split('=')
    k&&v&&(pre[k] = v)
    return pre
  }, {})
}

export function removeCodeInQuery() {
  const query = parseQuery()
  delete query.code
  return Object.keys(query).reduce((pre, k, index) => {
    const v = query
    return pre + (index && '&' || '') + `${k}=${v}`
  }, '')
}

export const formatTime = (dateStr:string) => {
  const date = new Date(dateStr)
  const [year, month, day, hours, minutes, seconds] = [date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getMinutes()].map(i => +i < 10 ? `0${i}` : i)
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

export const createElement = (tag: string, renderProps: renderProps, content: Array<any> | string, html?: string) => {
  const el = document.createElement(tag)
  const { events, attrs } = renderProps
}

const IFRAME_CLASS = 'gh-talk-iframe__main'

export const removeIframeDialog = () => {
  const container = document.body.querySelector(IFRAME_CLASS)
  if (container) {
    const parent = container.parentElement
    if (parent) parent.removeChild(container)
  }
}

export const openIframeDialog = (url: string) => {
  removeIframeDialog()
  const container = document.createElement('div')
  container.className = IFRAME_CLASS
  container.innerHTML = `
    <iframe src="${url}"></iframe>
  `
  const iframe = container.querySelector('iframe')
  if (iframe) {
    iframe.onerror = removeIframeDialog
  }
  document.body.appendChild(container)
}
