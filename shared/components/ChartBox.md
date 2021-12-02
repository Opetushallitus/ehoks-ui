### Default

```js
const { MdAccountBalance } = require("react-icons/md")
const { ChartContainer } = require("components/ChartContainer")
const { ChartContent } = require("components/ChartContent")
const { ChartRow } = require("components/ChartRow")
;<ChartContainer role="list">
  <ChartRow height="200px" marginBottom="15px">
    <ChartBox
      flex={1}
      backgroundColor="#3A7A10"
      icon={<MdAccountBalance size={160} color="rgba(255, 255, 255, 0.1)" />}
    >
      <ChartContent>
        <h2>Tavoitteeni asettaminen</h2>
        <ul>
          <li>Uratavoite</li>
          <li>Koulutustavoite</li>
        </ul>
      </ChartContent>
    </ChartBox>
  </ChartRow>
</ChartContainer>
```

### With arrows

```js
const { MdAccountBalance } = require("react-icons/md")
const {
  ChartArrowTop,
  ChartArrowBottom,
  ChartArrowLeft,
  ChartArrowRight
} = require("components/ChartArrow")
const { ChartContainer } = require("components/ChartContainer")
const { ChartContent } = require("components/ChartContent")
const { ChartRow } = require("components/ChartRow")
;<ChartContainer role="list">
  <ChartRow height="200px" marginBottom="15px">
    <ChartBox
      flex={1}
      backgroundColor="#3A7A10"
      icon={<MdAccountBalance size={160} color="rgba(255, 255, 255, 0.1)" />}
    >
      <ChartContent>
        <h2>Tavoitteeni asettaminen</h2>
        <ul>
          <li>Uratavoite</li>
          <li>Koulutustavoite</li>
        </ul>
      </ChartContent>
      <ChartArrowTop backgroundColor="#3A7A10" size={20} borderWidth={5} />
      <ChartArrowBottom backgroundColor="#3A7A10" size={20} borderWidth={5} />
      <ChartArrowLeft backgroundColor="#3A7A10" size={20} borderWidth={5} />
      <ChartArrowRight backgroundColor="#3A7A10" size={20} borderWidth={5} />
    </ChartBox>
  </ChartRow>
</ChartContainer>
```

### Multiple boxes

```js
const { MdAccountBalance, MdSearch } = require("react-icons/md")
const { ChartArrowRight } = require("components/ChartArrow")
const { ChartContainer } = require("components/ChartContainer")
const { ChartContent } = require("components/ChartContent")
const { ChartRow } = require("components/ChartRow")
;<ChartContainer role="list">
  <ChartRow height="200px" marginBottom="15px">
    <ChartBox
      flex={1}
      backgroundColor="#3A7A10"
      icon={<MdAccountBalance size={160} color="rgba(255, 255, 255, 0.1)" />}
    >
      <ChartContent>
        <h2>Tavoitteeni asettaminen</h2>
        <ul>
          <li>Uratavoite</li>
          <li>Koulutustavoite</li>
        </ul>
      </ChartContent>
      <ChartArrowRight backgroundColor="#3A7A10" size={20} borderWidth={5} />
    </ChartBox>
    <ChartBox
      flex={2}
      backgroundColor="#9459A4"
      icon={<MdSearch size={160} color="rgba(255, 255, 255, 0.1)" />}
    >
      <ChartContent>
        <h2>Mitä osaan jo?</h2>
        <ul>
          <li>
            Aiemmin hankitun osaamisen tunnistaminen ja tunnustaminen suhteessa
            tavoitteeseen
          </li>
        </ul>
      </ChartContent>
    </ChartBox>
  </ChartRow>
</ChartContainer>
```
