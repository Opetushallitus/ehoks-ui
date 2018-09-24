### Basic accordion

```js
initialState = { isOpen: false }
;<Accordion
  open={state.isOpen}
  onToggle={() => setState({ isOpen: !state.isOpen })}
  title="Esimerkkiotsikko"
>
  Esimerkkisisältö
</Accordion>
```

### Accordion with help popup

```js
initialState = { isOpen: false }
;<Accordion
  open={state.isOpen}
  onToggle={() => setState({ isOpen: !state.isOpen })}
  title="Esimerkkiotsikko"
  helpIcon={true}
>
  Esimerkkisisältö
</Accordion>
```
