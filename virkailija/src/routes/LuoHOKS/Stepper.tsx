import React, { Children, cloneElement } from "react"
import { Step, StepProps } from "routes/LuoHOKS/Step"
import styled from "styled"

const Container = styled("div")`
  display: flex;
  cursor: pointer;
`

interface StepperProps {
  currentStep: number
  updateStep: (index: number) => void
  completed: () => { [index: string]: boolean }
  children?: Array<React.ReactElement<Step>>
  disabled?: boolean
}

export class Stepper extends React.Component<StepperProps> {
  render() {
    const {
      children,
      completed,
      currentStep,
      disabled,
      updateStep
    } = this.props
    return (
      <Container>
        {Children.map(
          children,
          (child: React.ReactElement<StepProps>, index: number) =>
            cloneElement(child, {
              active: currentStep === index,
              completed: completed()[index],
              disabled,
              index,
              onClick: updateStep
            })
        )}
      </Container>
    )
  }
}
