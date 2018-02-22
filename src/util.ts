import { renderProps, SearchParams } from "./types/index";
let newWindow: Window | null;
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

export const removeLoginDialog = () => {
  if (newWindow) newWindow.close()
}

export const h = (tag: string, attrs: Object) => {

}

// https://stackoverflow.com/questions/4068373/center-a-popup-window-on-screen
function popupCenter(url: string, title: string, w: number, h: number) {
// Fixes dual-screen position
var dualScreenLeft = window.screenLeft
var dualScreenTop = window.screenTop

var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

var left = ((width / 2) - (w / 2)) + dualScreenLeft;
var top = ((height / 2) - (h / 2)) + dualScreenTop;
var newWindow = window.open(url, title, 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);

  // Puts focus on the newWindow
  if (window.focus && newWindow) {
    newWindow.focus();
  }
  return newWindow
}

export const openLoginDialog = (url: string) => {
  if (newWindow) newWindow.close()
  newWindow = popupCenter(url, 'gh-talk-login', 800, 800)
}

export const toast = (str: string) => {
  const toastEl = document.createElement('p')
  toastEl.innerHTML = str
  toastEl.className = 'gh-talk-toast'
  document.body.appendChild(toastEl)
  setTimeout(() =>  document.body.removeChild(toastEl), 1000)
}
