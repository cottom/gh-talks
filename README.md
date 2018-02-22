# gh-talk

light discuss add-on based on `github` issue's comments.

## start
```
npm i -S gh-talk
```

or

```html
<link rel="stylesheet"  href="https://unpkg.com/gh-talk/dist/index.css" />
<div id="talk-container"></div>
<script src="https://unpkg.com/gh-talk/dist/index.js"></script>
```

## init

```js
new GhTalk({
  selector: '#talk-container'
  // custom maintain a github app
  clientId: string,
  clientSecret: string,

  // login with new dialog tab
  dialog: url,
  owner: string
  issueId: number
  repo: string
  renderFn?: Function
  renderEditor?: Function
  renderComments?: Function
  exchangeTokenURL?: string
})
```
