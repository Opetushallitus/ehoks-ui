import { Link } from "react-router-dom"
import styled from "styled"

export const HOKSButton = styled(Link)`
  background: ${(props) => props.theme.colors.buttons.background};
  padding: 10px 70px;
  color: ${(props) => props.theme.colors.buttons.color};
  text-decoration: none;
`
