import React from "react"
import CircularProgressbar, {
  ProgressbarStyles
} from "react-circular-progressbar"
import styled from "styled"

interface TitleProps {
  color?: string
}

const Container = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  width: 150px;
`

const ProgressPieContainer = styled("div")`
  position: relative;
  width: 90px;
  hyphens: manual;
  text-align: center;
  margin-right: 40px;

  &:last-of-type {
    margin-right: 0;
  }
`

const PercentageContainer = styled("div")`
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
  color: ${(props: TitleProps) => (props.color ? props.color : "#000")};
`

const PercentageTitle = styled("div")`
  font-weight: bold;
  font-size: 22px;
`

const Title = styled("span")`
  margin-top: 10px;
  text-align: center;
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
  /** Text below circle */
  title?: React.ReactNode
  /** Click handler function */
  onClick?: () => void
  /**
   * Color of circle's filled path
   * @default #027FA9
   */
  stroke?: string
}

/**
 * Clickable circular progress button with title
 */
export class ProgressPie extends React.Component<ProgressPieProps> {
  render() {
    const {
      percentage = 100,
      title,
      onClick,
      stroke = "#027FA9",
      ...rest
    } = this.props
    const styles: ProgressbarStyles = {
      background: {
        fill: "#fff"
      },
      path: {
        transform: "rotate(180deg)",
        transformOrigin: "center center",
        stroke
      }
    }
    const props = {
      background: true,
      backgroundPadding: 0,
      percentage,
      strokeWidth: 15,
      styles,
      ...rest
    }

    return (
      <Container onClick={onClick}>
        <ProgressPieContainer>
          <CircularProgressbar {...props} />
          <PercentageContainer color={stroke}>
            <PercentageTitle>{percentage}</PercentageTitle>%
          </PercentageContainer>
        </ProgressPieContainer>
        <Title>{title}</Title>
      </Container>
    )
  }
}
