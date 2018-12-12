import styled from "styled"

export const StudiesContainer = styled("div")`
  display: flex;
  flex-wrap: wrap;
  margin-top: 20px;

  @media screen and (max-width: 1060px) {
    flex-direction: column;
  }
`
