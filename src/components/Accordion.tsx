import React from "react"
import { MdExpandLess, MdExpandMore, MdHelp } from "react-icons/md"
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

const TitleRow = styled("div")`
  display: flex;
  align-items: center;
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

const HelpToggle = styled(MdHelp)`
  cursor: pointer;
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
  render() {
    const {
      children,
      childContainer = true,
      helpIcon = false,
      helpContent,
      inline = false,
      onToggle,
      open,
      title
    } = this.props

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
        <TitleRow>
          <Toggle onClick={onToggle} data-testid="Toggle">
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
          <Title onClick={onToggle} data-testid="Title">
            {title}
          </Title>
          {helpIcon ? (
            <Popup
              trigger={<HelpToggle size="28" color="#027fa9" />}
              position={["left center", "bottom center", "right center"]}
              keepTooltipInside={true}
            >
              <div>{helpContent}</div>
            </Popup>
          ) : null}
        </TitleRow>
        {open ? childContent : null}
      </Container>
    )
  }
}
