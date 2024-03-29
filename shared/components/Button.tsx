import React from "react"
import styled from "styled"

interface ButtonContainerProps {
  secondary: boolean
}
const ButtonContainer = styled("button")<ButtonContainerProps>`
  padding: 10px;
  background: ${props =>
    props.secondary
      ? props.theme.colors.battleshipGrey
      : props.theme.colors.green700};
  color: #fff;
  ${props => props.theme.typography.body}
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
  /** Use secondary styles */
  secondary?: boolean
  /** Button type */
  type?: "submit" | "reset" | "button"
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
      secondary = false,
      onClick
    } = this.props
    return (
      <ButtonContainer
        className={className}
        disabled={disabled}
        onClick={onClick}
        type={type}
        secondary={secondary}
      >
        {children}
      </ButtonContainer>
    )
  }
}

export const HeroButton = styled(Button)`
  padding: 15px 60px;
  ${props => props.theme.typography.body}

  @media screen and (max-width: ${props => props.theme.breakpoints.Tablet}px) {
    padding: 15px 0;
  }
`

export const LinkButton = styled(Button)`
  background-color: transparent;
  border: none;
  cursor: pointer;
  text-decoration: underline;
  display: inline;
  margin: 0;
  padding: 0;
`
