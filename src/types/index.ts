import { exchangeToken } from './../api';
import GhTalks from '../index'

export interface GhTalksOption {
  selector: string
  clientId: string
  clientSecret: string
  owner: string
  issueId: number
  repo: string
  dialog?: string
  renderFn?: Function
  renderEditor?: Function
  renderComments?: Function
  exchangeTokenURL?: string
}

export interface GitHubUser {
  login: string
  id: number
  avatar_url: string
  gravatar_id: string
  url: string
  html_url: string
  followers_url: string
  following_url: string
  gists_url: string
  starred_url: string
  subscriptions_url: string
  organizations_url: string
  repos_url: string
  events_url: string
  received_events_url: string
  type: string
  site_admin: boolean
}

export interface Comment {
  id: number
  url: string
  html_url: string
  issue_url: string
  body: string
  body_html: string
  body_text: string,
  user: GitHubUser
  created_at: string
  updated_at: string
  author_association: string
  is_auth?: boolean
}

export interface EventBusIn {
  _events: Map<string, Function[]>
  $on: Function
  $emit: Function
  $off: Function
}

export interface RenderMeta {
  comments: Comment[]
  user?: GitHubUser
  dialog?: string
  eventBus?: EventBusIn
  instance: GhTalks
}

export interface renderProps {
  attrs?: Object
  events?: Object
  class?: Object | Array<string> | string
}

export interface SearchParams {
  [id: string]: any
}

export interface GithubTokenRes {
  access_token: string
  scope?: string
  token_type?: string
}

export interface RenderTypes {

}
