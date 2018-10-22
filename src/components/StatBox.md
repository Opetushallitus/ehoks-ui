## Complete example with StatBoxes, StatNumber and StatTitle

```js
const { StatBoxes, StatNumber, StatTitle } = require("components/StatBox")
;<StatBoxes>
  <StatBox borderTop="#EB6F02">
    <StatNumber color="#EB6F02">2</StatNumber>
    <StatTitle>Suunniteltua opintoa</StatTitle>
  </StatBox>
  <StatBox borderTop="#43A047">
    <StatNumber color="#43A047">4</StatNumber>
    <StatTitle>Valmista opintoa</StatTitle>
  </StatBox>
  <StatBox borderTop="#E2A626">
    <StatNumber color="#E2A626">6</StatNumber>
    <StatTitle>Aikataulut&shy;tamatonta opintoa</StatTitle>
  </StatBox>
</StatBoxes>
```
