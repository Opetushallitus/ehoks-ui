import styled from "styled"

export const SectionContainer = styled("div")`
  background: #f8f8f8;
  padding: 20px;

  @media screen and (max-width: ${props => props.theme.breakpoints.Tablet}px) {
    background: #fff;
  }
`
