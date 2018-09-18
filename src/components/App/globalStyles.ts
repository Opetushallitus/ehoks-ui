import { injectGlobal } from "emotion"

injectGlobal`
  html {
    box-sizing: border-box;
  }

  *, *:before, *:after {
    box-sizing: inherit;
  }

  html, body {
    margin: 0;
    padding: 0;
    background: #fff;
  }

  body  {
    font-family: 'Source Sans Pro', sans-serif;
  }

  /*
  * react-circular-progressbar styles
  *
  * All of the styles in this file are optional and configurable!
  */
  .CircularProgressbar .CircularProgressbar-path {
    stroke: #027FA9;
    stroke-linecap: square;
  }

  .CircularProgressbar .CircularProgressbar-trail {
    stroke: #d6d6d6;
  }

  .CircularProgressbar .CircularProgressbar-text {
    fill: #027FA9;
    font-size: 48px;
    dominant-baseline: middle;
    text-anchor: middle;
  }
`
