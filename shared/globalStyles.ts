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
    outline-color: props.theme.;
    outline-style: solid;
  }

  h1 {
    ${props => props.theme.typography.heading1}
  }
  h2 {
    ${props => props.theme.typography.heading2}
  }
  h3 {
    ${props => props.theme.typography.heading3}
  }
  h4,
  th {
    ${props => props.theme.typography.heading4}
  }

  /*
  * react-circular-progressbar styles
  *
  * All of the styles in this file are optional and configurable!
  */
  .CircularProgressbar .CircularProgressbar-path {
    stroke: ${props => props.theme.colors.green700};
    stroke-linecap: square;
  }

  .CircularProgressbar .CircularProgressbar-trail {
    stroke: #f5f5f5;
  }

  .CircularProgressbar .CircularProgressbar-text {
    fill: ${props => props.theme.colors.green300}
    font-size: 48px;
    dominant-baseline: middle;
    text-anchor: middle;
  }
`
