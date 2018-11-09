import styled from "styled"

export const ToggleLink = styled("div")`
  font-size: 16px;
  text-decoration: underline;
  color: #0076d9;
  cursor: pointer;

  @media screen and (max-width: ${props => props.theme.breakpoints.Max}px) {
    font-size: 16px;
  }

  @media screen and (max-width: ${props => props.theme.breakpoints.Large}px) {
    font-size: 14px;
  }
`
