# gh-talk

light discuss add-on based on `github` issue's comments.

## start
```
npm i -S gh-talk
```

or

```html
<script src="https://unpkg.com/gh-talk/dist/index.js"></script>
```

## init

```js
new GhTalk({
  selector: '#talk-container'
  clientId: string,
  clientSecret: string,
  owner: string
  issueId: number
  repo: string
  renderFn?: Function
  renderEditor?: Function
  renderComments?: Function
  exchangeTokenURL?: string
})
```
