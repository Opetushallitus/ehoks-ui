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
import { theme } from "./theme"
export default baseStyled as ThemedStyledInterface<typeof theme>
export const withTheme = withThemeStyled as WithThemeFnInterface<typeof theme>
