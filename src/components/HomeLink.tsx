import { Link } from "@reach/router"
import styled from "react-emotion"

export const HomeLink = styled(Link)`
  color: ${props => props.theme.colors.waterBlue};
  text-decoration: none;
  font-size: 24px;
  display: flex;
  align-items: center;
  padding: 20px;
`
