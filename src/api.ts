import { GhTalksOption, Comment, GitHubUser, GithubTokenRes } from './types/index';
import axios, { AxiosPromise, AxiosInstance, AxiosResponse } from 'axios'
import { API_HOST, GH_TALK_LOCAL_USER, GH_TALK_TOKEN } from './constant';

const unAuthHttp = axios.create({
  baseURL: API_HOST,
  headers: {Accept: 'application/vnd.github.full+json'},
})

export default class API {
  private token: string
  private $http: AxiosInstance
  private ghTalkOption: GhTalksOption
  private state: string
  constructor (token: string, option: GhTalksOption) {
    this.token = token
    this.ghTalkOption = option
    this.$http = axios.create({
      headers: {Authorization: `token ${token}`, Accept: 'application/vnd.github.full+json'},
      baseURL: API_HOST
    })
  }
  listComments (): AxiosPromise<Array<Comment>> {
    const { owner, repo, issueId } = this.ghTalkOption
    return this.$http.get(`/repos/${owner}/${repo}/issues/${issueId}/comments`)
  }
  createComment (body: string, ): AxiosPromise<Comment> {
    const { owner, repo, issueId } = this.ghTalkOption
    return this.$http.post(`/repos/${owner}/${repo}/issues/${issueId}/comments`, {body})
  }
  editComment (id: number, body: string): AxiosPromise<Comment> {
    const { owner, repo } = this.ghTalkOption
    return this.$http.patch(`/repos/${owner}/${repo}/issues/comments/${id}`, {body})
  }
  deleteComment (id: number) {
    const { owner, repo } = this.ghTalkOption
    return this.$http.delete(`/repos/${owner}/${repo}/issues/comments/${id}`)
  }
  async detailUser () {
    try {
      const {data} = await this._getUser()
      localStorage.setItem(GH_TALK_LOCAL_USER, JSON.stringify(data))
      localStorage.setItem(GH_TALK_TOKEN, this.token)
      return data;
    } catch (error) {
      localStorage.removeItem(GH_TALK_LOCAL_USER)
      localStorage.removeItem(GH_TALK_TOKEN)
      return Promise.reject(error)
    }
  }
  _getUser (): AxiosPromise<GitHubUser> {
    return this.$http.get('/user')
  }
  parseMarkdown (text: string): AxiosPromise<string> {
    return this.$http.post('/markdown', {text, mode: 'gfm'})
  }
}

export const listComments:(x: GhTalksOption) => AxiosPromise<Comment[]> = x => unAuthHttp.get(`/repos/${x.owner}/${x.repo}/issues/${x.issueId}/comments`, {params: {}})

export const getToken = (code: string, client_id: string, client_secret: string): AxiosPromise<GithubTokenRes> => {
  return axios({
    params: {code, client_id, client_secret},
    url: '//localhost:3002/exchange-token',
    method: 'GET'
  })
}

export const exchangeToken = async (code: string, option: GhTalksOption): Promise<string> => {
  const { clientId, clientSecret } = option
  const { data } = await getToken(code, clientId, clientSecret)
  return data.access_token
}
