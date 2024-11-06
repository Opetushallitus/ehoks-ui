import { Link } from "react-router-dom"
import styled from "styled"

export const HomeLink = styled(Link)`
  color: ${(props) => props.theme.colors.green700};
  text-decoration: none;
  font-size: 24px;
  display: flex;
  align-items: center;
  padding: 20px;
`

export const BackLink = styled(Link)`
  display: block;
  color: #d5d8d8;
  font-size: 19px;
  font-weight: 400;
  padding: 0px 20px 20px 20px;
`
