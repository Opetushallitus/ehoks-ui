import React from "react"
import styled from "styled"

const ButtonContainer = styled("button")`
  background: ${props => props.theme.colors.waterBlue};
  font-family: "Source Sans Pro", sans-serif;
  font-weight: 600;
  color: #fff;
  padding: 10px;
  border: 0;
  border-radius: 2px;
  cursor: not-allowed;
  opacity: 0.7;
  &:not(:disabled) {
    cursor: pointer;
    opacity: unset;
  }
`

export interface ButtonProps {
  children?: React.ReactNode
  /** Custom class name to append to button */
  className?: string
  /** Disabled */
  disabled?: boolean
  /** Event handler to execute when clicked */
  onClick?: (event: React.MouseEvent) => void
  /** Button type */
  type?: string
}

/**
 *  Extendable styled button
 */
export class Button extends React.Component<ButtonProps> {
  render() {
    const {
      children,
      className,
      disabled = false,
      type = "button",
      onClick
    } = this.props
    return (
      <ButtonContainer
        className={className}
        disabled={disabled}
        onClick={onClick}
        type={type}
      >
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
