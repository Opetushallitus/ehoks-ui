import styled from "styled"

export const ProgressPies = styled("div")`
  display: flex;
  justify-content: center;
  margin: 20px 0;

  @media screen and (max-width: ${(props) =>
      props.theme.breakpoints.Tablet}px) {
    margin: 0;
    justify-content: space-around;
  }
`
