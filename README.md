# gh-talk

light discuss add-on based on `github` issue's comments.

## API

### [issue's Comment api](https://developer.github.com/v3/issues/comments/#create-a-comment)
```
GET /repos/:owner/:repo/issues/:number/comments
```

```
POST /repos/:owner/:repo/issues/:number/comments
{
  "body": "Me too"
}
```

```
PATCH /repos/:owner/:repo/issues/comments/:id
{
  "body": "Me too"
}
```

```
DELETE /repos/:owner/:repo/issues/comments/:id
```
