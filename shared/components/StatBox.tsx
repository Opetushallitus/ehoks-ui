import styled from "styled"

interface StatBoxProps {
  /**
   * Color of top border
   * @default #979797
   */
  borderTop?: string
}
/**
 * Statistics components for showing stats using numbers and colors
 */
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

  @media screen and (max-width: ${props => props.theme.breakpoints.Tablet}px) {
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
  hyphens: manual;
`

export const StatBoxes = styled("div")`
  display: flex;
  margin: 10px 0;
  flex-direction: row;
  @media screen and (max-width: ${props => props.theme.breakpoints.Tablet}px) {
    flex-direction: column;
  }
`
