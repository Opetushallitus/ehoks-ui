import React from "react"
import styled from "react-emotion"

const ButtonContainer = styled("button")`
  padding: 10px;
  background: #000;
  color: #fff;
  border: 0;
  cursor: pointer;
`

export interface ButtonProps {
  children?: React.ReactNode
  className?: string
  onClick: () => void
}

export class Button extends React.Component<ButtonProps> {
  render() {
    const { children, className, onClick } = this.props
    return (
      <ButtonContainer className={className} onClick={onClick}>
        {children}
      </ButtonContainer>
    )
  }
}
