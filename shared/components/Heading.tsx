import styled from "styled"

export const Heading = styled("h1")`
  margin: 0;
`

export const MainHeading = styled(Heading)`
  @media screen and (max-width: ${props => props.theme.breakpoints.Tablet}px) {
    display: none;
  }
`

export const HeadingContainer = styled("div")`
  display: flex;
  align-items: center;
`

export const HelpHeading = styled(Heading)`
  margin-right: 20px;
`
