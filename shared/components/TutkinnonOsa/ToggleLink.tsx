import styled from "styled"

export const ToggleLink = styled("button")`
  font-size: 16px;
  text-decoration: underline;
  color: ${(props) => props.theme.colors.links.active};
  cursor: pointer;
  appearance: none;
  border: none;
  text-align: left;
  padding: 0;
  background: transparent;

  @media screen and (max-width: ${(props) => props.theme.breakpoints.Max}px) {
    font-size: 16px;
  }

  @media screen and (max-width: ${(props) => props.theme.breakpoints.Large}px) {
    font-size: 14px;
  }
`
