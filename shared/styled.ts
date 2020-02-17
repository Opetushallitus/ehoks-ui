export {
  css,
  keyframes,
  createGlobalStyle,
  ThemeProvider
} from "styled-components"
import baseStyled, {
  ThemedStyledInterface,
  withTheme as withThemeStyled,
  WithThemeFnInterface
} from "styled-components"
import { TypeOfTheme } from "./theme"
export default baseStyled as ThemedStyledInterface<TypeOfTheme>
export const withTheme = withThemeStyled as WithThemeFnInterface<TypeOfTheme>
