import styled from "styled"
import { Period } from "./Period"

export const Container = styled("div")`
  margin: 0;

  &:last-of-type {
    margin-bottom: 0;
  }
`

export const Title = styled(Period)`
  display: block;
  font-weight: 600;
  border-bottom: 2px solid #89827c;
  padding-bottom: 5px;
`

export const Table = styled("table")`
  border-collapse: collapse;
  margin: 5px 0 0 0;
`

export const THead = styled("thead")`
  display: inline-block;
  padding-right: 20px;
  text-align: left;
`

export const TBody = styled("tbody")`
  display: inline-block;
`

export const TH = styled("th")`
  text-align: left;
  vertical-align: top;
  padding: 5px 30px 5px 0;

  @media screen and (max-width: ${props => props.theme.breakpoints.Tablet}px) {
    display: block;
  }
`

export const TD = styled("td")`
  padding: 5px 0;

  @media screen and (max-width: ${props => props.theme.breakpoints.Tablet}px) {
    display: block;
  }
`

export const EmptyTD = styled("td")`
  display: none;
`

export const InfoContainer = styled("ul")`
  padding: 0;
  margin: 10px 0 0 0;
  background: #fff;
  color: #2b2b2b;
  border-radius: 3px;
  border: 1px solid #999;
  list-style: none;

  li {
    padding: 6px 20px;
    &:nth-child(2n) {
      background: #fafafa;
    }
  }
`
