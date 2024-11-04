import React from "react"
import { MdExpandLess, MdExpandMore } from "react-icons/md"
import styled from "styled"
import { ChildContentArea, ContentArea } from "./ContentArea"
import { HelpPopup } from "./HelpPopup"
import { AccordionTitle } from "components/AccordionTitle"

const AccordionContainer = styled("div")`
  padding: 20px 0 10px 0;
`

const AccordionToggle = styled("div")`
  border-radius: 15px;
  width: 30px;
  height: 30px;
  border: 1px solid #3a7a10;
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
  /** Defines help popup width */
  helpCssWidth?: string
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
  /**
   * Define initial open state, has no effect if onToggle and open props are used
   */
  initiallyOpen?: boolean
  children?: React.ReactNode
}

export interface AccordionState {
  isOpen: boolean
}

/**
 * Toggleable content panel with inline help popup
 */
export class Accordion extends React.Component<AccordionProps, AccordionState> {
  constructor(props: AccordionProps) {
    super(props)
    this.state = {
      // NOTE: this is only used if onToggle & open props are not provided
      isOpen: props.initiallyOpen !== undefined ? props.initiallyOpen : false
    }
  }

  onEnter = (event: React.KeyboardEvent) => {
    const { id, onToggle } = this.props
    if (
      event.key === "Enter" &&
      document.activeElement &&
      id === document.activeElement.id
    ) {
      if (typeof onToggle === "function") {
        onToggle()
      } else {
        this.defaultOnToggle(event)
      }
    }
  }

  defaultOnToggle = (event: React.MouseEvent | React.KeyboardEvent) => {
    event.preventDefault()
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
      helpCssWidth,
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
      <ChildContentArea>{children}</ChildContentArea>
    ) : (
      children
    )
    const onToggleFn =
      typeof onToggle === "function" ? onToggle : this.defaultOnToggle
    const isOpen = typeof open === "boolean" ? open : this.state.isOpen

    return (
      <Container id={id}>
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
                  color={inline ? "#000" : "#3A7A10"}
                  data-testid="Collapse"
                />
              ) : (
                <MdExpandMore
                  size="28"
                  color={inline ? "#000" : "#3A7A10"}
                  data-testid="Expand"
                />
              )}
            </Toggle>
            {typeof title === "string" ? (
              <Title data-testid="Title">{title}</Title>
            ) : (
              <div data-testid="Title">{title}</div>
            )}
          </TitleRow>
          {helpIcon ? (
            <HelpPopup helpContent={helpContent} cssWidth={helpCssWidth} />
          ) : null}
        </TitleContainer>
        <div data-testid="Content" id={`${id}-content`}>
          {isOpen ? childContent : null}
        </div>
      </Container>
    )
  }
}
