import React from "react"
import { MdCheck, MdClose } from "react-icons/md"
import styled from "styled"
import { theme } from "theme"

interface CircleProps {
  active?: boolean
}
const Circle = styled("div")<CircleProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 15px;
  background: ${props => (props.active ? "#1976d2" : "#fff")};
  color: ${props => (props.active ? "#fff" : "#ddd")};
  border: ${props => (props.active ? "none" : "1px solid #ddd")};
`

const StepContainer = styled("button")`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-right: 10px;
  appearance: none;
  background-color: transparent;
  border: none;
  font: inherit;
  padding: 0;
  text-align: left;
  cursor: pointer;
  &::-moz-focus-inner {
    border: 0;
    padding: 0;
  }
`

const StatusContainer = styled("div")`
  display: flex;
  align-items: center;
  flex-direction: column;
  padding-right: 10px;
`

const Description = styled("div")`
  flex: 1;
`

export interface StepProps {
  active?: boolean
  completed?: boolean
  index?: number
  onClick?: (index: number) => void
}

export class Step extends React.Component<StepProps> {
  setIndex = () => {
    const { index = 0, onClick } = this.props
    if (typeof onClick === "function") {
      onClick(index)
    }
  }

  render() {
    const { active, children, completed = true, index = 0 } = this.props
    return (
      <StepContainer onClick={this.setIndex}>
        <StatusContainer>
          <Circle active={active}>{index + 1}</Circle>
          {completed ? (
            <MdCheck color={theme.colors.ready} />
          ) : (
            <MdClose color={theme.colors.planned} />
          )}
        </StatusContainer>
        <Description>{children}</Description>
      </StepContainer>
    )
  }
}
