import React from "react"
import styled from "../../styled"
import { FormattedMessage, intlShape } from "react-intl"
import { Expand } from "./Expand"
import { IconContainer } from "./IconContainer"
import { ToggleableItems } from "./StudyInfoHelpers"

const RequirementsAndReportsContainer = styled("div")`
  display: flex;
  background: #fff;
  border-top: 1px solid #c9cdcf;
  border-bottom: 1px solid #c9cdcf;
`

const ExpandContainer = styled("div")`
  padding: 20px 10px 20px 20px;

  @media screen and (max-width: ${props => props.theme.breakpoints.Tablet}px) {
    padding: 10px 10px 10px 20px;
  }
`

const ExpandTitle = styled("div")`
  flex: 1;
  cursor: pointer;
`

interface RequirementsAndReportsProps {
  toggle: (name: ToggleableItems) => () => void
}

export class RequirementsAndReports extends React.Component<RequirementsAndReportsProps> {
  static contextTypes = {
    intl: intlShape
  }

  render() {
    // const { toggle } = this.props
    const { intl } = this.context

    return (
      <RequirementsAndReportsContainer>
        <ExpandContainer>
          <ExpandTitle>
            <FormattedMessage
              id="opiskelusuunnitelma.naytaPoikkeamatJaArviointikriteeritLink"
              defaultMessage="Poikkeaminen ammattitaitovaatimuksista ja yksilölliset arviointikriteerisi"
            />
          </ExpandTitle>
          <IconContainer
            // onClick={toggle("TODO")}
            aria-label={intl.formatMessage({
              id: "opiskelusuunnitelma.naytaPoikkeamatJaArviointikriteeritAriaLabel"
            })}
          >
            <Expand size={40} />
          </IconContainer>
        </ExpandContainer>
      </RequirementsAndReportsContainer>
    )
  }
}
