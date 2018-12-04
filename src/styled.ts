import styled, { CreateStyled } from "react-emotion"
export { css, injectGlobal, keyframes } from "emotion"
import { theme } from "theme"
export default styled as CreateStyled<typeof theme>
