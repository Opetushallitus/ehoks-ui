### Full example

```js
initialState = { isLoading: false, searchText: "" }
;<SearchField
  isLoading={state.isLoading}
  onSubmit={() => console.log("Submitted")}
  onTextChange={event => {
    setState({ searchText: event.target.value, isLoading: true })
    setTimeout(() => {
      setState({ isLoading: false })
    }, 3000)
  }}
  value={state.searchText}
  placeholder="Enter your search term"
/>
```

### Persistent loading state

```js
<SearchField
  isLoading={true}
  onSubmit={() => console.log("Submitted")}
  onTextChange={() => {}}
  value={"fixed value"}
/>
```
