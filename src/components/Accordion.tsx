import React from "react"
import { MdExpandLess, MdExpandMore } from "react-icons/md"

import styled from "styled"
import { ChildContentArea, ContentArea } from "./ContentArea"
import { HelpPopup } from "./HelpPopup"

const AccordionContainer = styled("div")`
  padding: 20px 0 10px 0;
`

const AccordionToggle = styled("div")`
  border-radius: 15px;
  width: 30px;
  height: 30px;
  border: 1px solid #027fa9;
  cursor: pointer;
  user-select: none;
`

const AccordionInlineToggle = styled(AccordionToggle)`
  border: 1px solid #000;
`

const TitleContainer = styled("div")`
  display: flex;
`

const TitleRow = styled("button")`
  display: flex;
  align-items: center;
  background: transparent;
  border: none;
  width: 100%;
  padding: 0;
  text-align: left;
`

const AccordionTitle = styled("h2")`
  flex: 1;
  margin: 0 20px 0 20px;
  font-size: 20px;
  font-weight: 400;
  cursor: pointer;
`

const AccordionInlineTitle = styled(AccordionTitle)`
  font-weight: 600;
`

export interface AccordionProps {
  /** Unique identifier for accordion, required for accessibility features */
  id: string
  /** Defines Accordion children visibility, will use local state if not provided */
  open?: boolean
  /** Action to execute whenever user clicks the toggle icon, will toggle local state if not provided */
  onToggle?: () => void
  /** Title of the accordion, always visible */
  title?: React.ReactNode
  /**
   * Defines help icon visibility
   * @default false
   */
  helpIcon?: boolean
  /** Defines help popup content */
  helpContent?: React.ReactNode
  /**
   * Renders with alternative inline styles
   * @default false
   */
  inline?: boolean
  /**
   * Render container for children
   * @default true
   */
  childContainer?: boolean
}

export interface AccordionState {
  isOpen: boolean
}

/**
 * Toggleable content panel with inline help popup
 */
export class Accordion extends React.Component<AccordionProps, AccordionState> {
  state = {
    isOpen: false // NOTE: this is only used if onToggle & open props are not provided
  }
  onEnter = (event: React.KeyboardEvent) => {
    const { id, onToggle } = this.props
    if (
      event.key === "Enter" &&
      document.activeElement &&
      id === document.activeElement.id
    ) {
      typeof onToggle === "function" ? onToggle() : this.defaultOnToggle()
    }
  }

  defaultOnToggle = () => {
    this.setState((state: AccordionState) => ({
      ...state,
      isOpen: !state.isOpen
    }))
  }

  render() {
    const {
      children,
      childContainer = true,
      helpIcon = false,
      helpContent,
      id,
      inline = false,
      onToggle,
      open,
      title
    } = this.props

    const Container = inline ? ContentArea : AccordionContainer
    const Title = inline ? AccordionInlineTitle : AccordionTitle
    const Toggle = inline ? AccordionInlineToggle : AccordionToggle
    const childContent = childContainer ? (
      <ChildContentArea data-testid="Content">{children}</ChildContentArea>
    ) : (
      children
    )
    const onToggleFn =
      typeof onToggle === "function" ? onToggle : this.defaultOnToggle
    const isOpen = typeof open === "boolean" ? open : this.state.isOpen

    return (
      <Container>
        <TitleContainer>
          <TitleRow
            onClick={onToggleFn}
            aria-expanded={isOpen}
            aria-controls={`${id}-content`}
            data-testid="Toggle"
          >
            <Toggle>
              {isOpen ? (
                <MdExpandLess
                  size="28"
                  color={inline ? "#000" : "#027fa9"}
                  data-testid="Collapse"
                />
              ) : (
                <MdExpandMore
                  size="28"
                  color={inline ? "#000" : "#027fa9"}
                  data-testid="Expand"
                />
              )}
            </Toggle>
            <Title data-testid="Title">{title}</Title>
          </TitleRow>
          {helpIcon ? <HelpPopup helpContent={helpContent} /> : null}
        </TitleContainer>
        <div id={`${id}-content`}>{isOpen ? childContent : null}</div>
      </Container>
    )
  }
}
