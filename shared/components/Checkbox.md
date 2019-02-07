```js
initialState = { checked: false }
;<Checkbox
  id="test1"
  checked={state.checked}
  onToggle={() => setState({ checked: !state.checked })}
>
  Checkbox title
</Checkbox>
```
