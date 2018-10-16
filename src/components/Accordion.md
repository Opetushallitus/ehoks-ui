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
  helpContent="Esimerkkiaputeksti"
>
  Esimerkkisisältö
</Accordion>
```

### Accordion without content container

```js
initialState = { isOpen: false }
;<Accordion
  open={state.isOpen}
  onToggle={() => setState({ isOpen: !state.isOpen })}
  title="Esimerkkiotsikko"
  childContainer={false}
>
  Esimerkkisisältö
</Accordion>
```

### Inline accordion

```js
initialState = { isOpen: false }
;<Accordion
  open={state.isOpen}
  onToggle={() => setState({ isOpen: !state.isOpen })}
  title="Suunnitellut opintoni (2)"
  inline={true}
  childContainer={false}
>
  Esimerkkisisältö
</Accordion>
```
