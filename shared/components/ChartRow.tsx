import styled from "styled"

interface ChartRowProps {
  height?: string
  marginBottom?: string
}
export const ChartRow = styled("div")`
  display: flex;
  flex: 1;
  height: ${(props: ChartRowProps) => (props.height ? props.height : "200px")};
  margin-bottom: ${(props: ChartRowProps) =>
    props.marginBottom ? props.marginBottom : 0};

  @media screen and (max-width: ${props => props.theme.breakpoints.Desktop}px) {
    height: unset;
    margin-bottom: 5px;
  }
`
