import React from "react"
import { MdExpandLess, MdExpandMore, MdHelp } from "react-icons/md"
import { intlShape } from "react-intl"
import Popup from "reactjs-popup"
import styled from "styled"

const AccordionContainer = styled("div")`
  padding: 20px 0 10px 0;
`

const AccordionInlineContainer = styled("div")`
  margin-top: 10px;
  padding: 20px;
  background: #fff;
  border: 1px solid #a8a8a8;
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

const Content = styled("div")`
  margin: 10px 0 10px 50px;
  border-radius: 4px;
  border: 1px solid #a8a8a8;
  background: #fff;
  padding: 10px;

  @media screen and (max-width: ${props => props.theme.breakpoints.Tablet}px) {
    margin: 0;
    padding: 0;
    border-width: 0;
    background: transparent;
  }
`

const HelpToggle = styled(MdHelp)``

const HelpButton = styled("button")`
  appearance: none;
  background-color: transparent;
  border: none;
  cursor: pointer;
  margin: 0;
  padding: 0;
  width: auto;
  font: inherit;
  color: inherit;

  &::-moz-focus-inner {
    border: 0;
    padding: 0;
  }

  margin-right: 45%;
  @media screen and (max-width: ${props => props.theme.breakpoints.Large}px) {
    margin-right: 300px;
  }
  @media screen and (max-width: ${props => props.theme.breakpoints.Desktop}px) {
    margin-right: 100px;
  }
  @media screen and (max-width: ${props => props.theme.breakpoints.Tablet}px) {
    margin-right: unset;
  }
`

export interface AccordionProps {
  /** Unique identifier for accordion, required for accessibility features */
  id: string
  /** Defines Accordion children visibility */
  open?: boolean
  /** Action to execute whenever user clicks the toggle icon */
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

/**
 * Toggleable content panel with inline help popup
 */
export class Accordion extends React.Component<AccordionProps> {
  static contextTypes = {
    intl: intlShape
  }
  onEnter = (event: React.KeyboardEvent) => {
    const { id, onToggle } = this.props
    if (
      typeof onToggle === "function" &&
      event.key === "Enter" &&
      document.activeElement &&
      id === document.activeElement.id
    ) {
      onToggle()
    }
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
    const { intl } = this.context

    const Container = inline ? AccordionInlineContainer : AccordionContainer
    const Title = inline ? AccordionInlineTitle : AccordionTitle
    const Toggle = inline ? AccordionInlineToggle : AccordionToggle
    const childContent = childContainer ? (
      <Content data-testid="Content">{children}</Content>
    ) : (
      children
    )

    return (
      <Container>
        <TitleContainer>
          <TitleRow
            onClick={onToggle}
            aria-expanded={open}
            aria-controls={`${id}-content`}
            data-testid="Toggle"
          >
            <Toggle>
              {open ? (
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
          {helpIcon ? (
            <Popup
              trigger={
                <HelpButton
                  aria-label={intl.formatMessage({
                    defaultMessage: "Näytä ohjeteksti",
                    id: "accordion.showHelpLabel"
                  })}
                >
                  <HelpToggle size="28" color="#027fa9" />
                </HelpButton>
              }
              position={["left center", "bottom center", "right center"]}
              keepTooltipInside={true}
            >
              <div role="alert">{helpContent}</div>
            </Popup>
          ) : null}
        </TitleContainer>
        <div id={`${id}-content`}>{open ? childContent : null}</div>
      </Container>
    )
  }
}
