import styled from "styled"

export const Heading = styled("h1")`
  margin: 0;
  font-size: 30px;
  font-weight: 400;
`

export const MainHeading = styled(Heading)`
  @media screen and (max-width: ${props => props.theme.breakpoints.Tablet}px) {
    display: none;
  }
`
