import { RenderMeta, GitHubUser, Comment, GhTalksOption } from './types/index';
import GhTalks from './index'
import { formatTime } from './util'
import { editSVG, deleteSVG, markdownSVG, githubSVG, loadingSVG } from './resource'
import { AxiosError } from 'axios';
import autosize from 'autosize'

interface renderEditorProps {
  saveHandler: Function
  cancelHandler?: Function,
  defaultText?: string,
  instance: GhTalks
}

// const
const disappearEL = (el: Element) => (el.classList.add('display-none'))
const showEl = (el: Element) => (el.classList.remove('display-none'))

const LOADING_CLASS_NAME = 'gh-talk-loading'
const LOADING_CLASS_SELECTOR = `.${LOADING_CLASS_NAME}`

const renderLoading = (container: HTMLElement) => {
  const loadingEl = container.querySelector(LOADING_CLASS_SELECTOR)
  if (loadingEl) showEl(loadingEl)
  else {
    const _loadingEL = document.createElement('div')
    _loadingEL.classList.add(LOADING_CLASS_NAME)
    _loadingEL.innerHTML = loadingSVG
    if (!container.innerHTML) _loadingEL.style.backgroundColor = '#fff'
    else _loadingEL.style.backgroundColor = null
    container.appendChild(_loadingEL)
  }
}

const stopLoading = (container: Element) => {
  const loadingEl = container.querySelector(LOADING_CLASS_SELECTOR)
  loadingEl && disappearEL(loadingEl)
}

export class DOMRender {
  _user?: GitHubUser
  _comments?: Comment
  _renderComments?: Function
  _renderEditor?: Function
  constructor (options: GhTalksOption, container: HTMLElement) {
    const { renderComments, renderEditor } = options
    this._renderComments = renderComments
    this._renderEditor = renderEditor
    renderLoading(container)
  }

  render (meta: RenderMeta, container: Element) {
    container.innerHTML = ''
    container.appendChild(this.renderComments(meta))
    container.appendChild(this.renderEditor(meta))
    const textareas = container.querySelectorAll('textarea')
    autosize(textareas || [])
  }

  get renderComments (): Function {
    return this._renderComments || defaultRenderComments
  }

  get renderEditor () {
    return this._renderEditor || defaultRenderEditor
  }
}

function defaultRenderComments (meta: RenderMeta) {
  const { user, comments, instance } = meta
  const commentEls = comments.map(item => renderSignComment(meta, item))
  // zoom all those comment
  const commentsContainer = document.createElement('div')
  commentsContainer.className = 'gh-talk__comments-list'
  commentEls.forEach(item => (commentsContainer.appendChild(item)))
  if (!commentsContainer.innerHTML) {
    const emptyEl = document.createElement('div')
    emptyEl.classList.add('gh-talk__empty')
    emptyEl.innerHTML = 'no comments'
    commentsContainer.appendChild(emptyEl)
  }
  return commentsContainer
}


function defaultRenderEditor (meta: RenderMeta) {
  const container = document.createElement('div')
  const { instance, user, dialog } = meta
  if (user) {
    const config: renderEditorProps = {
      saveHandler: async (text: string, cb: Function, editorContainer: HTMLElement) => {
        renderLoading(editorContainer)
        try {
          const res = await instance.resource.createComment(text)
          const { data } = res
          const commentEl = renderSignComment(meta, data)
          const parent = container.parentElement
          if (parent) {
            const el = parent.querySelector('.gh-talk__comments-list')
            if (el) {
              if (!el.querySelector('.gh-talk__comment-item')) el.innerHTML = '' // clear empty
              el.appendChild(commentEl)
            }
          }
          cb && cb()
        } catch (error) {
          console.error(error)
        } finally {
          stopLoading(editorContainer)
        }
      },
      instance
    }

    container.className = 'gh-talk__comment-item '
    container.appendChild(renderUser(user))
    const editorEl = renderEditor(config)
    const editorElContainer = document.createElement('div')
    editorElContainer.classList.add('gh-talk__comment')
    editorEl.classList.add('gh-talk-comment__write')
    editorElContainer.appendChild(editorEl)
    container.appendChild(editorElContainer)
  } else {
    container.innerHTML = `
      <div class="gh-talk-login">
        <div class="gh-talk-login__logo">${githubSVG}</div>
        <div class="gh-talk-login__btn-container"><span role="button" class="gh-talk-login__btn-container">Login With Github</span></div>
      </div>
    `
    const btn = container.querySelector('svg')
    if (btn) {
      btn.addEventListener('click', () => {
        instance.toLoginIn()
      })
    }
  }
  return container
}

function renderEditor (config: renderEditorProps) {
  const { saveHandler, cancelHandler, defaultText, instance } = config
  const container = document.createElement('div')
  container.className = 'gh-talk-editor'
  container.innerHTML = `
    <div class="gh-talk-editor__header">
      <div class="gh-talk-editor__toolbox"></div>
      <nav class="gh-talk-editor__btns" role="tablist">
        <button class="gh-talk__btn gh-talk-editor__write-btn selected gh-talk-editor__nav-btn" role="tab">Write</button>
        <button class="gh-talk__btn gh-talk-editor__preview-btn gh-talk-editor__nav-btn" role="tab">Preview</button>
      </nav>
    </div>
    <div class="gh-talk-editor__content">
      <textarea class="gh-talk-editor__textarea" placeholder="Styling with Markdown is supported"></textarea>
    </div>
    <div class="gh-talk-editor__preview comment-body markdown-body  js-comment-body" ></div>
    <div class="gh-talk-editor__save-btns">
      <div class="gh-talk-editor__label">
        <a href="https://jerry-i.github.io/gh-talks/" target="_blank" class="gh-talk__btn
        gh-talk__btn--text gh-talk-editor__markdown-btn gh-talk__comment__action-btn">
         ${markdownSVG} powered by ghtalks
        </a>

      </div>
      <div class="gh-talk-editor__execute">
        ${
          cancelHandler && `<button class="gh-talk__btn gh-talk-editor__execute-cancel gh-talk__btn--lg gh-talk__btn--default">Cancel</button>` || ''
        }
        <button class="gh-talk__btn gh-talk__btn--primary gh-talk__btn--lg gh-talk__btn--bg  gh-talk-editor__execute-submit">Submit</button>
      </div>
    </div>
  `
  const writeBtn = container.querySelector('.gh-talk-editor__write-btn')
  const previewBtn = container.querySelector('.gh-talk-editor__preview-btn')
  const textarea = container.querySelector('textarea')
  const editContent = container.querySelector('.gh-talk-editor__content')
  const previewContent = container.querySelector('.gh-talk-editor__preview')
  const cancelBtn = container.querySelector('.gh-talk-editor__execute-cancel')
  const editBtn = container.querySelector('.gh-talk-editor__execute-submit')
  if (writeBtn && previewBtn && textarea && editContent && previewContent && editBtn) {
    disappearEL(previewContent)
    textarea.value = defaultText || ''
    // add event to items
    const switchToEdit = () => {
      if (writeBtn.classList.contains('selected')) return
      writeBtn.classList.add('selected')
      previewBtn.classList.remove('selected')
      showEl(editContent)
      disappearEL(previewContent)
    }

    const switchToPreview = () => {
      if (!textarea.value) return
      if (previewBtn.classList.contains('selected')) return
      previewBtn.classList.add('selected')
      writeBtn.classList.remove('selected')
      previewContent.innerHTML = `<div class="gh-talk-editor__loading-text">加载中...</div>`
      disappearEL(editContent)
      showEl(previewContent)
      instance.markdown(textarea.value).then(res => (previewContent.innerHTML = res.data || '')).catch(() => (previewContent.innerHTML = `<div>加载失败..</div>`))
    }

    writeBtn.addEventListener('click', switchToEdit)
    previewBtn.addEventListener('click', switchToPreview)
    if (cancelBtn && cancelHandler) {
      cancelBtn.addEventListener('click', () => {
        switchToEdit()
        cancelHandler && cancelHandler(textarea.value)
      })
    }

    editBtn.addEventListener('click', () => {
      switchToEdit()
      saveHandler && saveHandler(textarea.value, () => {
        textarea.value = ''
        switchToEdit()
      }, container)
    })
  }
  return container
}

function renderSignComment (meta: RenderMeta, item: Comment) {
  const { user, instance } = meta
  const { created_at, updated_at, author_association, body, body_html, user: commentUser } = item
  const container = document.createElement('div')
  const canEditFlag = user && commentUser.login === user.login
  container.className = 'gh-talk__comment-item '
  const userEL = renderUser(commentUser)
  container.appendChild(userEL)
  const commentEl = document.createElement('div')
  commentEl.className='gh-talk__comment'
  commentEl.innerHTML = `
    <div class="gh-talk__comment-main">
      <div class="gh-talk__comment-header">
        <strong>
          <a href="${commentUser.html_url}" class="gh-talk__comment-header__author">${commentUser.login}</a>
          ${ author_association === 'OWNER' && `<span class="gh-talk__comment-header__author-label">author</span>` || '' }
        </strong>
        <span class="gh-talk__comment__timestamp">${formatTime(created_at)}</span>
        <div class="gh-talk__comment-header__edit-label">
          ${canEditFlag && `
            <button class="gh-talk__btn gh-talk__btn--text  gh-talk__comment__edit-btn gh-talk__comment__action-btn">
              ${editSVG}
            </button>
            <button class="gh-talk__btn gh-talk__btn--text gh-talk__comment__delete-btn gh-talk__comment__action-btn">
              ${deleteSVG}
            </button>
          ` || ''}
        </div>
      </div>
      <div class="gh-talk__comment-preview comment-body markdown-body js-comment-body">
        ${body_html}
      </div>
    </div>
  `
  const issuePreview = commentEl.querySelector('.gh-talk__comment-preview')
  const commentPreview = commentEl.querySelector('.gh-talk__comment-main')
  if (canEditFlag && commentPreview && issuePreview) {
    const openEditor = () => {
      disappearEL(commentPreview)
      showEl(editorEl)
      const textarea = editorEl.querySelector('textarea')
      if (textarea) textarea.value = item.body
    }
    const closeEditor = () => {
      disappearEL(editorEl)
      showEl(commentPreview)
    }

    const editorConfig = {
      saveHandler: async (text: string, cb: Function, container: HTMLElement) => {
        renderLoading(container)
        try {
          const res = await instance.resource.editComment(item.id, text)
          const { data } = res
          const { body, body_html } = data
          item.body = body
          item.body_html = body_html
          issuePreview.innerHTML = body_html
          closeEditor()
        } catch (error) {
          console.error(error)
          if (!error) return
          const {response, message} = error
          // TODO
          if (response) {
            const { message } = response
          }
        } finally {
          stopLoading(container)
        }
      },
      cancelHandler: (text: string) => closeEditor(),
      defaultText: body,
      instance
    }
    const editorEl = renderEditor(editorConfig)
    editorEl.classList.add('gh-table__comment-item__editor')
    disappearEL(editorEl)
    commentEl.appendChild(editorEl)

    // add events to btn elements
    const editBtn = commentEl.querySelector('.gh-talk__comment__edit-btn')
    const deleteBtn = commentEl.querySelector('.gh-talk__comment__delete-btn')
    if (editBtn && deleteBtn) {
      editBtn.addEventListener('click', () => {
        const textarea = editorEl.querySelector('textarea')
        if (!textarea) return
        textarea.value = body // reset edit textarea
        openEditor()
        autosize.update(textarea)
      })
      deleteBtn.addEventListener('click', () => {
        if (window.confirm('confirm delete this ?')) {
          // delete action
          instance.resource.deleteComment(item.id).then(() => {
            const parent = container.parentElement
            if (parent) parent.removeChild(container)
          })
        }
      })
    }
  }
  container.appendChild(commentEl)
  return container
}

function renderUser (user: GitHubUser) {
  const container = document.createElement('div')
  container.className = 'gh-talk__user'
  container.innerHTML = `
    <a href="${user.html_url}"  target="_blank">
      <img class="gh-talk__user-avatar" src="${user.avatar_url}" height="44"/>
    </a>
  `
  return container
}
