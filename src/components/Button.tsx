import React from "react"
import styled from "react-emotion"

const ButtonContainer = styled("button")`
  background: ${props => props.theme.colors.waterBlue};
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
  /** Custom class name to append to button */
  className?: string
  /** Event handler to execute when clicked */
  onClick: (event: React.MouseEvent) => void
}

/**
 *  Extendable styled button
 */
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
  padding: 15px 60px;
  font-size: 16px;
  font-weight: 400;

  @media screen and (max-width: ${props => props.theme.breakpoints.Tablet}px) {
    padding: 15px 0;
  }
`
