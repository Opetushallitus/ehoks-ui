import React from "react"
import styled from "../../styled"
import { FormattedMessage, intlShape } from "react-intl"
import { Expand } from "./Expand"
import { IconContainer } from "./IconContainer"
import { Collapse } from "./Collapse"
import { HorizontalLine } from "../HorizontalLine"

const Line = styled(HorizontalLine)`
  width: unset;
  margin: 0;

  @media screen and (max-width: ${props => props.theme.breakpoints.Tablet}px) {
    display: none;
  }
`

const Prefix = styled("div")`
  margin: 10px 0 10px 20px;
`

const Container = styled("div")`
  background: #fff;
`

const RequirementsAndReportsContainer = styled("div")`
  border-top: 1px solid #c9cdcf;
  border-bottom: 1px solid #c9cdcf;
`

const ExpandContainer = styled("div")`
  display: flex;
  padding: 20px 10px 20px 20px;

  @media screen and (max-width: ${props => props.theme.breakpoints.Tablet}px) {
    padding: 10px 10px 10px 20px;
  }
`

const ExpandTitle = styled("div")`
  flex: 1;
  cursor: pointer;
`

const CollapseContainer = styled("div")`
  flex: 1;
  display: flex;
  padding: 20px 10px 10px 20px;

  @media screen and (max-width: ${props => props.theme.breakpoints.Tablet}px) {
    align-items: center;
    padding-bottom: 0;
  }
`

const CollapseTitle = styled("h2")`
  margin: 0;
  font-size: 22px;
  font-weight: 600;

  @media screen and (max-width: ${props => props.theme.breakpoints.Tablet}px) {
    flex: unset;
    font-size: 16px;
  }
`


interface RequirementsAndReportsProps {
  expanded: boolean
  toggle: () => void
}

export class RequirementsAndReports extends React.Component<
  RequirementsAndReportsProps
> {
  static contextTypes = {
    intl: intlShape
  }

  render() {
    const { expanded, toggle } = this.props
    const { intl } = this.context

    return (
      <Container>
        {expanded ? (
          <RequirementsAndReportsContainer>
            <CollapseContainer>
              <CollapseTitle>
                <FormattedMessage
                  id="opiskelusuunnitelma.poikkeamatJaArviointikriteerit"
                  defaultMessage="Poikkeaminen ammattitaitovaatimuksista ja yksilölliset arviointikriteerisi"
                />
              </CollapseTitle>
              <IconContainer
                onClick={toggle}
                aria-label={intl.formatMessage({
                  id:
                    "opiskelusuunnitelma.piilotaPoikkeamatJaArviointikriteeritAriaLabel"
                })}
              >
                <Collapse size={40} />
              </IconContainer>
            </CollapseContainer>
            <Line height="2px" backgroundColor="#000" />
          </RequirementsAndReportsContainer>
        ) : (
          <RequirementsAndReportsContainer>
            <ExpandContainer>
              <ExpandTitle onClick={toggle}>
                <FormattedMessage
                  id="opiskelusuunnitelma.poikkeamatJaArviointikriteerit"
                  defaultMessage="Poikkeaminen ammattitaitovaatimuksista ja yksilölliset arviointikriteerisi"
                />
              </ExpandTitle>
              <IconContainer
                onClick={toggle}
                aria-label={intl.formatMessage({
                  id:
                    "opiskelusuunnitelma.naytaPoikkeamatJaArviointikriteeritAriaLabel"
                })}
              >
                <Expand size={40} />
              </IconContainer>
            </ExpandContainer>
          </RequirementsAndReportsContainer>
        )}
        {expanded && (
          <React.Fragment>
            <Prefix>
              <FormattedMessage
                id="opiskelusuunnitelma.poiketaanPrefix"
                defaultMessage="Poiketaan"
                tagName="i"
              />
            </Prefix>
          </React.Fragment>
        )}
      </Container>
    )
  }
}
