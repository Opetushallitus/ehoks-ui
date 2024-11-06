import React from "react"
import { MdCheck, MdClose } from "react-icons/md"
import styled from "styled"

const MdReady = styled(MdCheck)`
  color: ${(props) => props.theme.colors.ready};
`

const MdPlanned = styled(MdClose)`
  color: ${(props) => props.theme.colors.planned};
`

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
  background: ${(props) => (props.active ? "#3A7A10" : "#fff")};
  color: ${(props) => (props.active ? "#fff" : "#ddd")};
  border: ${(props) => (props.active ? "none" : "1px solid #ddd")};
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
  &::-moz-focus-inner {
    border: 0;
    padding: 0;
  }
  &:not(:disabled) {
    cursor: pointer;
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
  disabled?: boolean
  index?: number
  onClick?: (index: number) => void
  children?: React.ReactNode
}

export class Step extends React.Component<StepProps> {
  setIndex = () => {
    const { index = 0, onClick } = this.props
    if (typeof onClick === "function") {
      onClick(index)
    }
  }

  render() {
    const {
      active,
      children,
      completed = true,
      index = 0,
      disabled
    } = this.props
    return (
      <StepContainer onClick={this.setIndex} disabled={disabled}>
        <StatusContainer>
          <Circle active={active}>{index + 1}</Circle>
          {completed ? <MdReady /> : <MdPlanned />}
        </StatusContainer>
        <Description>{children}</Description>
      </StepContainer>
    )
  }
}
