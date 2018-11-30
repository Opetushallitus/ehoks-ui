### Default

```js
<ProgressPie percentage={75} title="Tavoitteeni ja perustietoni" />
```

### Custom stroke color

```js
<ProgressPie percentage={50} title="Aiempi osaamiseni" stroke="#43A047" />
```

### onClick handler

```js
<ProgressPie
  percentage={100}
  title="Osaamisen tunnustaminen"
  onClick={() => console.log("hello")}
/>
```
