import { css } from "styled"

export const GlobalStyles = css`
  html {
    box-sizing: border-box;
  }

  *,
  *:before,
  *:after {
    box-sizing: inherit;
  }

  html,
  body {
    margin: 0;
    padding: 0;
    background: #fff;
  }

  body {
    ${props => props.theme.typography.body}
  }

  :focus {
    outline-color: rgba(25, 118, 210, 0.4);
    outline-style: solid;
  }

  h1 {
    ${props => props.theme.typography.heading1}
  }

  /*
  * react-circular-progressbar styles
  *
  * All of the styles in this file are optional and configurable!
  */
  .CircularProgressbar .CircularProgressbar-path {
    stroke: #027fa9;
    stroke-linecap: square;
  }

  .CircularProgressbar .CircularProgressbar-trail {
    stroke: #f5f5f5;
  }

  .CircularProgressbar .CircularProgressbar-text {
    fill: #027fa9;
    font-size: 48px;
    dominant-baseline: middle;
    text-anchor: middle;
  }
`
