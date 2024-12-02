import React from "react"
import { MdDone } from "react-icons/md"
import styled from "styled"

const Container = styled("div")`
  display: flex;
  align-items: center;
`

interface BoxProps {
  "aria-checked": boolean
}
const Box = styled("div")<BoxProps>`
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 15px;
  background: ${props => (props["aria-checked"] ? "#3A7210" : "#fff")};
  margin-right: 10px;
  border: ${props => (props["aria-checked"] ? "unset" : "1px solid #a5acb0")};
  box-shadow:
    0 0 2px 0 rgba(0, 0, 0, 0),
    inset 0 1px 2px 0 rgba(0, 0, 0, 0.2);
  border-radius: 2px;
  width: 20px;
  height: 20px;
`

const Check = styled("div")`
  position: absolute;
  pointer-events: none;
  user-select: none;
`

export interface CheckboxProps {
  /** Label identifier, required for accessibility */
  id: string
  /** Checkbox state */
  checked: boolean
  /** Function to call after user changes the checkbox state */
  onToggle?: () => void
  children?: React.ReactNode
}

/**
 * Accessible checkbox component
 * TODO this is not accessible, should use label with input type="checkbox" opacity: 0
 */
export class Checkbox extends React.Component<CheckboxProps> {
  checkboxRef = React.createRef<HTMLDivElement>()

  handleKeyPress = (event: React.KeyboardEvent) => {
    if (
      typeof this.props.onToggle === "function" &&
      (event.key === "Enter" || event.key === " ")
    ) {
      this.props.onToggle()
    }
  }

  focusCheckbox = () => {
    if (this.checkboxRef.current) {
      this.checkboxRef.current.focus()
    }
    if (typeof this.props.onToggle === "function") {
      this.props.onToggle()
    }
  }

  render() {
    const { children, checked, id, onToggle } = this.props
    return (
      <Container>
        <Box
          role="checkbox"
          tabIndex={0}
          aria-checked={checked}
          aria-labelledby={id}
          onClick={onToggle}
          onKeyPress={this.handleKeyPress}
          ref={this.checkboxRef}
        >
          {checked && (
            <Check>
              <MdDone fill="#fff" size={24} />
            </Check>
          )}
        </Box>
        <label
          id={id}
          onClick={this.focusCheckbox}
          onKeyPress={this.focusCheckbox}
          role="button" // eslint-disable-line
        >
          {children}
        </label>
      </Container>
    )
  }
}
