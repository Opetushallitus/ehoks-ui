import styled from "styled"

export const Container = styled("div")`
  max-width: ${props => props.theme.maxWidth}px;
  margin: 0 auto;
`

export const PaddedContainer = styled("div")`
  margin: 0 20px;

  @media screen and (max-width: ${props => props.theme.breakpoints.Desktop}px) {
    margin: 0;
  }
`

export const PaddedContent = styled(PaddedContainer)`
  padding: 20px;
`
