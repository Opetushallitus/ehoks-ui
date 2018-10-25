import styled from "styled"

interface HorizontalLineProps {
  /**
   * Line height
   * @default 1px
   */
  height?: string
  /**
   * Line background color
   * @default #fff
   */
  backgroundColor?: string
}

/**
 * Horizontal line that fills the container
 */
export const HorizontalLine = styled("div")`
  height: ${(props: HorizontalLineProps) =>
    props.height ? props.height : "1px"};
  width: 100%;
  background-color: ${(props: HorizontalLineProps) =>
    props.backgroundColor ? props.backgroundColor : "#fff"};
`
