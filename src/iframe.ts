// please require in your callback page
import { parseQuery } from './util'

const init = () => {
  const searchQuery = parseQuery()
  const code = searchQuery.code
  if (window.parent === window) return
  window.parent.postMessage({type: 'AUTH', data: code}, '*')
}

init()
