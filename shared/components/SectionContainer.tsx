import styled from "styled"

export const BackgroundContainer = styled("div")`
  background: #f8f8f8;

  @media screen and (max-width: ${(props) =>
      props.theme.breakpoints.Tablet}px) {
    background: #fff;
  }
`

export const SectionContainer = styled(BackgroundContainer)`
  padding: 20px;
`
