import styled from "styled"

export const ContentContainer = styled("div")`
  display: flex;
  margin: 30px 50px 50px 40px;
  flex-direction: row;

  @media screen and (max-width: ${(props) =>
      props.theme.breakpoints.Desktop}px) {
    display: block;
    margin: 30px 50px 0 20px;
  }

  @media screen and (max-width: ${(props) => props.theme.breakpoints.Large}px) {
    flex-direction: column;
  }
`
