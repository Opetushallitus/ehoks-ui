import React from "react"
import styled from "../../styled"
import { FormattedMessage, intlShape } from "react-intl"
import { Expand } from "./Expand"
import { IconContainer } from "./IconContainer"
import { Collapse } from "./Collapse"
import { HorizontalLine } from "../HorizontalLine"
import { InfoContainer, InfoTextContainer } from "./Shared"

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

const RequirementsAndDeviationsContainer = styled("div")`
  border-top: 1px solid #c9cdcf;
  border-bottom: 1px solid #c9cdcf;
`

const ExpandContainer = styled("div")`
  display: flex;
  align-items: center;
  padding: 10px 10px 10px 20px;

  @media screen and (max-width: ${props => props.theme.breakpoints.Tablet}px) {
    padding: 10px 10px 10px 20px;
  }
`

const ExpandTitle = styled("div")`
  flex: 1;
  cursor: pointer;
`

const CollapseContainer = styled("div")`
  display: flex;
  padding: 20px 10px 10px 20px;

  @media screen and (max-width: ${props => props.theme.breakpoints.Tablet}px) {
    align-items: center;
    padding-bottom: 0;
  }
`

const CollapseTitle = styled("h2")`
  margin: 0;
  flex: 1;
  cursor: pointer;
  ${props => props.theme.typography.heading3}

  @media screen and (max-width: ${props => props.theme.breakpoints.Tablet}px) {
    flex: unset;
    font-size: 16px;
  }
`

const Requirements = styled(InfoContainer)`
  margin: 10px 20px 20px 20px;
`

const Deviations = styled(InfoTextContainer)`
  margin: 10px 20px 20px 20px;
`

interface RequirementsAndDeviationsProps {
  expanded: boolean
  toggle: () => void
  requirements?: string[]
  deviations?: string
}

function doesntHaveRequirementsAndDeviations(
  requirements: string[] | undefined,
  deviations: string | undefined
) {
  return !((requirements && requirements.length > 0) || deviations)
}

export class RequirementsAndDeviations extends React.Component<
  RequirementsAndDeviationsProps
> {
  static contextTypes = {
    intl: intlShape
  }

  render() {
    const { expanded, toggle, requirements, deviations } = this.props
    const { intl } = this.context

    if (doesntHaveRequirementsAndDeviations(requirements, deviations)) {
      return null
    }

    return (
      <Container>
        {expanded ? (
          <RequirementsAndDeviationsContainer>
            <CollapseContainer>
              <CollapseTitle onClick={toggle}>
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

            {deviations && (
              <>
                <Prefix>
                  <FormattedMessage
                    id="opiskelusuunnitelma.poiketaanPrefix"
                    defaultMessage="Poiketaan"
                    tagName="i"
                  />
                </Prefix>
                <Deviations>{deviations}</Deviations>
              </>
            )}

            {requirements && requirements.length > 0 && (
              <>
                <Prefix>
                  <FormattedMessage
                    id="opiskelusuunnitelma.yksilollisetArviointikriteeritPrefix"
                    defaultMessage="Yksilölliset arviointikriteerisi"
                    tagName="i"
                  />
                </Prefix>
                <Requirements>
                  {requirements &&
                    requirements.map((requirement, i) => {
                      return <li key={i}>{requirement}</li>
                    })}
                </Requirements>
              </>
            )}
          </RequirementsAndDeviationsContainer>
        ) : (
          <RequirementsAndDeviationsContainer>
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
          </RequirementsAndDeviationsContainer>
        )}
      </Container>
    )
  }
}
