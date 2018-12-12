import React from "react"
import { MdHelp } from "react-icons/md"
import { intlShape } from "react-intl"
import Popup from "reactjs-popup"
import styled from "styled"

const HelpToggle = styled(MdHelp)``

const HelpButton = styled("button")`
  appearance: none;
  background-color: transparent;
  border: none;
  cursor: pointer;
  margin: 0;
  padding: 0;
  width: auto;
  height: 28px;
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

interface HelpPopupProps {
  /** Defines help popup content */
  helpContent?: React.ReactNode
}

export class HelpPopup extends React.Component<HelpPopupProps> {
  static contextTypes = {
    intl: intlShape
  }
  render() {
    const { intl } = this.context
    const { helpContent } = this.props
    return (
      <Popup
        trigger={
          <HelpButton
            aria-label={intl.formatMessage({
              id: "accordion.naytaOhjetekstiAriaLabel"
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
    )
  }
}
