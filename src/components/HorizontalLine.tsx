import styled from "react-emotion"

interface HorizontalLineProps {
  height?: string
  backgroundColor?: string
}

export const HorizontalLine = styled("div")`
  height: ${(props: HorizontalLineProps) =>
    props.height ? props.height : "1px"};
  width: 100%;
  background-color: ${(props: HorizontalLineProps) =>
    props.backgroundColor ? props.backgroundColor : "#fff"};
`
