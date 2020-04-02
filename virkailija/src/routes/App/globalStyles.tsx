import { createGlobalStyle } from "styled"
import { GlobalStyles as GlobalStylesBase } from "globalStyles"

export const GlobalStyles = createGlobalStyle`
  ${GlobalStylesBase}
  html, body {
      height: 100%;
  }

  #app {
    height: 100%;
  }
`
