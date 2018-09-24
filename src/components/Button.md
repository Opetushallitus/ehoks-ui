### Normal styles

```js
<Button onClick={() => console.log("Hello")}>Esimerkkipainike</Button>
```

### Custom className

```js
const { css } = require("react-emotion")
;<Button className={css({ backgroundColor: "red" })}>
  Punaisella taustalla
</Button>
```
