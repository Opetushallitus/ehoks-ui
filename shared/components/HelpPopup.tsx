import React from "react"
import { MdHelp } from "react-icons/md"
import { useIntl } from "react-intl"
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
`

const AlertDiv = styled("div")`
  role: alert;
  overflow-wrap: break-word;
`

interface HelpPopupProps {
  /** Defines help popup content */
  helpContent?: React.ReactNode
  /** Custom classname for button */
  className?: string
  cssWidth?: string
  toggleSize?: string
}

export const HelpPopup = (props: HelpPopupProps) => {
  const intl = useIntl()
  const { helpContent, className, cssWidth, toggleSize } = props
  return (
    <Popup
      trigger={
        <HelpButton
          aria-label={intl.formatMessage({
            id: "accordion.naytaOhjetekstiAriaLabel"
          })}
          className={className}
        >
          <HelpToggle size={toggleSize ? toggleSize : "28"} color="#3A7A10" />
        </HelpButton>
      }
      position={["left center", "bottom center", "right center"]}
      keepTooltipInside={true}
      contentStyle={cssWidth ? { width: cssWidth } : {}}
    >
      <AlertDiv>{helpContent}</AlertDiv>
    </Popup>
  )
}
