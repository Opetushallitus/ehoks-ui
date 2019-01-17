### Slider with default settings

```js
const { Slide } = require("components/MobileSlider")
;<MobileSlider>
  {["Slide 1", "Slide 2", "Slide 3"].map((slide, i) => {
    return <Slide key={i}>{slide}</Slide>
  })}
</MobileSlider>
```

### Slider without slide counter

```js
const { Slide } = require("components/MobileSlider")
;<MobileSlider showCount={false}>
  {["Slide 1", "Slide 2", "Slide 3"].map((slide, i) => {
    return <Slide key={i}>{slide}</Slide>
  })}
</MobileSlider>
```

### Slider with custom footer

```js
const { Slide } = require("components/MobileSlider")
;<MobileSlider showCount={false} footer={<div>Custom footer</div>}>
  {["Slide 1", "Slide 2", "Slide 3"].map((slide, i) => {
    return <Slide key={i}>{slide}</Slide>
  })}
</MobileSlider>
```
