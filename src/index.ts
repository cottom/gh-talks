import { AxiosPromise } from 'axios';
import './styles/index.styl'
import { AUTH_URL, GH_TALK_TOKEN } from './constant';
import { GhTalksOption, Comment, GitHubUser } from './types/index';
import API, { listComments, exchangeToken } from './api';
import { parseQuery, openIframeDialog, removeCodeInQuery } from './util';
import { DOMRender } from './dom'
class  GhTalk {
  private options: GhTalksOption
  resource: API
  private comments: Comment[]
  private user?: GitHubUser
  private rootElement: Element
  private domRender: DOMRender
  constructor (options: GhTalksOption) {
    this.options = options
    let el =  <HTMLElement>document.body.querySelector(options.selector)
    if (!el){
      el = el;
      this.error(`can\'t find target selector ${options.selector}`)
      return
    }
    this.rootElement = el
    this.domRender = new DOMRender(options, el)
    this.initPrepare()
  }

  async initPrepare () {
    // validate cache
    const token = localStorage.getItem(GH_TALK_TOKEN)
    if (token) {
      const api = new API(token, this.options)
      const data = await api.detailUser()
      if (data && data.login) {
        this.user = data
        this.initWithCode(token)
        return
      }
    }
    const queryParams = parseQuery()
    if (queryParams.code) {
      const _search = removeCodeInQuery()
      const search = _search && `?${_search}` || ''
      history.replaceState({}, '', `${location.origin}${location.pathname}${search}${location.hash}`)
      const token = await exchangeToken(queryParams.code, this.options)
      this.initWithCode(token)
    } else {
      if (this.options.iframe) this.initIframe()
      await this.loadComments()
      this.render()
    }
  }

  async initWithCode (token: string) {
    this.resource = new API(token, this.options)
    if (!this.user) {
      await this.resource.detailUser().then(data => (this.user = data))
    }
    await this.loadComments()
    this.render()
  }

  render () {
    const meta = {
      user: this.user,
      comments: this.comments,
      instance: this
    }
    this.domRender.render(meta, this.rootElement)
  }

  toLoginIn () {
    if (this.options.iframe) {
      openIframeDialog(this.loginURL)
    } else {
      location.href = this.loginURL
    }
  }

  get loginURL () {
    let { clientId, iframe } = this.options
    const {origin} = location
    if (iframe) {
      if (!~iframe.indexOf('http')) iframe = `${origin}${iframe}`
    }
    const redirect_uri = iframe || location.href
    return `${AUTH_URL}?scope=public_repo&client_id=${clientId}&redirect_uri=${redirect_uri}`
  }

  async loadComments () {
    try {
      if (this.resource) {
        const {data} = await this.resource.listComments()
        this.comments = data
      } else {
        const { data } = await listComments(this.options)
        this.comments = data
      }
    } catch (error) {
      this.comments = []
    }
  }


  markdown (text: string):AxiosPromise<string>  {
    return this.resource.parseMarkdown(text)
  }

  error (msg: string) {
    console.error(msg)
  }

  initIframe () {
    window.addEventListener('message', e => {
      const data = e.data
      if (data && data.type && data.type === 'AUTH') {
        const { code } = data
        this.initWithCode(code)
      }
    })
  }
}
export default GhTalk
