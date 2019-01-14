export {
  css,
  keyframes,
  createGlobalStyle,
  ThemeProvider
} from "styled-components"
import baseStyled, { ThemedStyledInterface } from "styled-components"
import { theme } from "./theme"
export default baseStyled as ThemedStyledInterface<typeof theme>
