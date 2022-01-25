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

  .popup-content {
    margin: auto;
    background: rgb(255, 255, 255);
    width: 50%;
    padding: 5px;
  }
  .popup-arrow {
    color: rgb(255, 255, 255);
  }
  [role="tooltip"].popup-content {
    width: 200px;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 0px 3px;
  }

  .popup-overlay {
    background: rgba(0, 0, 0, 0.5);
  }
  [data-popup="tooltip"].popup-overlay {
    background: transparent;
  }
`
