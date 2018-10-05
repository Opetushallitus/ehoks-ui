import styled from "react-emotion"
import { breakpoints } from "utils"

export const StatBoxes = styled("div")`
  display: flex;
  margin: 10px 0;
  flex-direction: row;
  @media screen and (max-width: ${breakpoints.Tablet}px) {
    flex-direction: column;
  }
`

interface StatBoxProps {
  borderTop?: string
}
export const StatBox = styled("div")`
  display: flex;
  flex: 1;
  align-items: center;
  margin-right: 20px;
  border: 1px solid #979797;
  border-top-width: 4px;
  border-top-color: ${(props: StatBoxProps) =>
    props.borderTop ? props.borderTop : "#979797"};

  &:last-of-type {
    margin-right: 0;
  }

  @media screen and (max-width: ${breakpoints.Tablet}px) {
    margin-bottom: 20px;
    margin-right: 0;
  }
`

interface StatNumberProps {
  color?: string
}
export const StatNumber = styled("div")`
  padding: 8px 20px;
  font-size: 32px;
  font-weight: 400;
  color: ${(props: StatNumberProps) => (props.color ? props.color : "#979797")};
`

export const StatTitle = styled("div")`
  color: #000;
  font-size: 16px;
  padding-right: 20px;
`
