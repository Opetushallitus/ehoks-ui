import React from "react"
import styled from "react-emotion"

const ButtonContainer = styled("button")`
  background: #1976d2;
  font-family: "Source Sans Pro", sans-serif;
  font-weight: 600;
  color: #fff;
  padding: 10px;
  border: 0;
  border-radius: 2px;
  cursor: pointer;
`

export interface ButtonProps {
  children?: React.ReactNode
  className?: string
  onClick: (event: React.MouseEvent) => void
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

export const HeroButton = styled(Button)`
  padding: 15px 50px;
  font-size: 16px;
`
