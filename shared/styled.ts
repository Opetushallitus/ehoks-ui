import * as StyledComponents from "styled-components"
import { ThemedStyledComponentsModule } from "styled-components"
import { TypeOfTheme } from "./theme"
const {
  default: baseStyled,
  css,
  createGlobalStyle,
  keyframes,
  ThemeProvider,
  withTheme
} = (StyledComponents as any) as ThemedStyledComponentsModule<TypeOfTheme>
export default baseStyled
export { css, createGlobalStyle, keyframes, ThemeProvider, withTheme }
