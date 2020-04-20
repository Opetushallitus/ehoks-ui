import styled from "styled"

interface PeriodProps {
  accentColor?: string
}
export const Period = styled("strong")`
  color: ${(props: PeriodProps) =>
    props.accentColor ? props.accentColor : "#000000"};
`
