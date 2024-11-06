import React from "react"
import { CircularProgressbar } from "react-circular-progressbar"
import styled, { withTheme, ComponentWithTheme } from "styled"
import { ColorType } from "theme"

const Container = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`

const ProgressPieContainer = styled("div")`
  position: relative;
  width: 90px;
  hyphens: manual;
  text-align: center;
  margin-right: ${(props) => props.theme.spacing.xl};

  &:last-of-type {
    margin-right: 0;
  }
`

const PercentageContainer = styled("div")<{
  color?: ColorType
}>`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 90px;
  height: 90px;
  top: 0;
  left: 0;
  font-size: 14px;
  font-weight: bold;
  color: ${(props) =>
    props.color ? props.theme.colors[props.color] : "#3A7A10"};
`

const PercentageTitle = styled("div")`
  font-weight: bold;
  font-size: 22px; /*//TODO from theme*/
`

const Title = styled("span")`
  margin-top: 10px;
  text-align: center;
  @media screen and (max-width: ${(props) =>
      props.theme.breakpoints.Tablet}px) {
    display: none;
  }
`

export interface ProgressPieProps extends ComponentWithTheme {
  /**
   * Progress bar indicator fill percentage
   * @default 100
   */
  value?: number
  /** Text below circle */
  title?: React.ReactNode
  /** Click handler function */
  onClick?: () => void
  /**
   * Color of circle's filled path
   * @default #3A7A10
   */
  stroke?: ColorType
}

/**
 * Clickable circular progress button with title
 */
class ProgressPieWithTheme extends React.Component<ProgressPieProps> {
  render() {
    const { value = 100, title, onClick, stroke, theme, ...rest } = this.props
    const strokeFromTheme = stroke ? theme.colors[stroke] : undefined
    const path: React.CSSProperties = {
      transform: "rotate(180deg)",
      transformOrigin: "center center",
      stroke: typeof strokeFromTheme === "string" ? strokeFromTheme : undefined
    }
    const styles = {
      background: {
        fill: "#fff"
      },
      path
    }
    const circularProgressbarProps = {
      background: true,
      backgroundPadding: 0,
      value,
      strokeWidth: 15,
      styles,
      ...rest
    }

    return (
      <Container onClick={onClick}>
        <ProgressPieContainer>
          <CircularProgressbar {...circularProgressbarProps} />
          <PercentageContainer color={stroke}>
            <PercentageTitle>{value}</PercentageTitle>%
          </PercentageContainer>
        </ProgressPieContainer>
        <Title>{title}</Title>
      </Container>
    )
  }
}

export const ProgressPie = withTheme(ProgressPieWithTheme)
