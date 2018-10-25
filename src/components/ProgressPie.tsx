import React from "react"
import CircularProgressbar, {
  ProgressbarStyles
} from "react-circular-progressbar"
import styled from "styled"

const ProgressPieContainer = styled("div")`
  cursor: pointer;
  width: 85px;
  hyphens: manual;
  text-align: center;
  margin-right: 40px;

  &:last-of-type {
    margin-right: 0;
  }
`

const Title = styled("span")`
  @media screen and (max-width: ${props => props.theme.breakpoints.Tablet}px) {
    display: none;
  }
`

export interface ProgressPieProps {
  /**
   * Progress bar indicator fill percentage
   * @default 100
   */
  percentage?: number
  /** Text inside circle */
  step?: string
  /** Text below circle */
  title?: React.ReactNode
  /** Selected circle has solid background without progress indicator */
  selected?: boolean
  /** Click handler function */
  onClick?: () => void
}

/**
 * Clickable circular progress button with title
 */
export class ProgressPie extends React.Component<ProgressPieProps> {
  render() {
    const {
      percentage = 100,
      step,
      title,
      onClick,
      selected,
      ...rest
    } = this.props
    const defaultStyles: ProgressbarStyles = {
      background: {
        fill: "#fff"
      },
      path: {
        transform: "rotate(270deg)",
        transformOrigin: "center center"
      }
    }
    const selectedStyles = selected
      ? {
          background: {
            fill: "#027FA9"
          },
          text: {
            fill: "#fff"
          },
          trail: { stroke: "transparent" }
        }
      : {}
    const props = {
      background: true,
      backgroundPadding: 0,
      percentage: selected ? 0 : percentage,
      strokeWidth: 4,
      styles: { ...defaultStyles, ...selectedStyles },
      text: step,
      ...rest
    }

    return (
      <ProgressPieContainer onClick={onClick}>
        <CircularProgressbar {...props} />
        <Title>{title}</Title>
      </ProgressPieContainer>
    )
  }
}
