import styled from "styled"

export const ChildContentArea = styled("div")`
  margin: 10px 0 10px 50px;
  border-radius: 4px;
  border: 1px solid #a8a8a8;
  background: #fff;
  padding: 10px;

  @media screen and (max-width: ${(props) =>
      props.theme.breakpoints.Tablet}px) {
    margin: 0;
    padding: 0;
    border-width: 0;
    background: transparent;
  }
`

export const ContentArea = styled("div")`
  margin-top: 10px;
  padding: 20px;
  background: #fff;
  border: 1px solid #a8a8a8;
`
