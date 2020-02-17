import { CompetenceRequirement } from "components/CompetenceRequirement"
import { HorizontalLine } from "components/HorizontalLine"
import React from "react"
import { FormattedMessage, intlShape } from "react-intl"
import { HMediaQuery } from "responsive"
import styled from "styled"
import { Collapse } from "./Collapse"
import { Expand } from "./Expand"
import { IconContainer } from "./IconContainer"
import { MobileCompetences } from "./MobileCompetences"
import { ToggleLink } from "./ToggleLink"
import { Osaamisvaatimus } from "models/Osaamisvaatimus"
import { SnapshotOrInstance } from "mobx-state-tree"
import { ToggleableItems } from "./StudyInfoHelpers"

const Container = styled("div")`
  background: #fff;
`

const ExpandContainer = styled("div")`
  display: flex;
  align-items: center;
  padding: 10px 10px 10px 20px;
  border-top: 1px solid #c9cdcf;
`

const ToggleAllTitle = styled(ToggleLink)`
  padding-left: 10px;
  padding-right: 10px;

  @media screen and (max-width: ${props => props.theme.breakpoints.Tablet}px) {
    display: none;
  }
`

const ExpandTitle = styled("div")`
  flex: 1;
  cursor: pointer;
`

const CollapseHeaderContainer = styled("div")`
  display: flex;
  flex: 1;

  @media screen and (max-width: ${props => props.theme.breakpoints.Tablet}px) {
    flex-direction: column;
  }
`

const CollapseHeader = styled("h2")`
  flex: 1;
  margin: 0;
  font-size: 22px;
  font-weight: 600;

  @media screen and (max-width: ${props => props.theme.breakpoints.Tablet}px) {
    flex: unset;
    font-size: 16px;
  }
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

const InfoContainer = styled("ul")`
  padding: 0;
  margin: 0;
  background: #fff;
  color: #2b2b2b;
  border-radius: 2px;
  list-style: none;

  li {
    padding: 10px 20px;
    &:nth-child(2n) {
      background: #fafafa;
    }
  }
`

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

interface CompetencesProps {
  collapseAll: () => void
  competenceRequirements?: Array<SnapshotOrInstance<typeof Osaamisvaatimus>>
  expandAll: () => void
  expandCompetence: (index: number) => () => void
  expanded?: boolean
  expandedCompetences: number[]
  toggle: (name: ToggleableItems) => () => void
}

export class Competences extends React.Component<CompetencesProps> {
  static contextTypes = {
    intl: intlShape
  }
  render() {
    const {
      collapseAll,
      competenceRequirements = [],
      expandAll,
      expandCompetence,
      expanded,
      expandedCompetences,
      toggle
    } = this.props
    const { intl } = this.context
    const allExpanded =
      expandedCompetences.length === competenceRequirements.length

    if (!competenceRequirements.length) {
      return <Container data-testid="StudyInfo.Competences" />
    }

    return (
      <Container data-testid="StudyInfo.Competences">
        {expanded ? (
          <React.Fragment>
            <CollapseContainer data-testid="StudyInfo.Competences.CollapseContainer">
              <CollapseHeaderContainer>
                <CollapseHeader>
                  <FormattedMessage
                    id="opiskelusuunnitelma.ammattitaitovaatimuksetTitle"
                    defaultMessage="Ammattitaitovaatimukset"
                  />
                </CollapseHeader>
                <ToggleAllTitle onClick={allExpanded ? collapseAll : expandAll}>
                  {allExpanded ? (
                    <FormattedMessage
                      id="opiskelusuunnitelma.piilotaKaikkiKriteeritLink"
                      defaultMessage="Piilota arviointikriteerit"
                    />
                  ) : (
                    <FormattedMessage
                      id="opiskelusuunnitelma.naytaKaikkiKriteeritLink"
                      defaultMessage="Näytä kaikki arviointikriteerit"
                    />
                  )}
                </ToggleAllTitle>
              </CollapseHeaderContainer>
              <IconContainer
                onClick={toggle("competences")}
                aria-label={intl.formatMessage({
                  id:
                    "opiskelusuunnitelma.piilotaAmmattitaitovaatimuksetAriaLabel"
                })}
                data-testid="StudyInfo.Competences.CollapseCompetences"
              >
                <Collapse size={40} />
              </IconContainer>
            </CollapseContainer>
            <Line height="2px" backgroundColor="#000" />
          </React.Fragment>
        ) : (
          <ExpandContainer>
            <ExpandTitle onClick={toggle("competences")}>
              <FormattedMessage
                id="opiskelusuunnitelma.naytaAmmattitaitovaatimuksetLink"
                defaultMessage="Ammattitaitovaatimukset ja arviointikriteerit"
              />
            </ExpandTitle>
            <IconContainer
              onClick={toggle("competences")}
              aria-label={intl.formatMessage({
                id: "opiskelusuunnitelma.naytaAmmattitaitovaatimuksetAriaLabel"
              })}
              data-testid="StudyInfo.Competences.ExpandCompetences"
            >
              <Expand size={40} />
            </IconContainer>
          </ExpandContainer>
        )}
        {expanded && (
          <React.Fragment>
            <HMediaQuery.SmallTablet>
              <MobileCompetences
                competenceRequirements={competenceRequirements}
              />
            </HMediaQuery.SmallTablet>
            <HMediaQuery.MinWidth breakpoint="SmallTablet">
              <Prefix>
                <FormattedMessage
                  id="opiskelusuunnitelma.opiskelijaOsaaPrefix"
                  defaultMessage="Opiskelija osaa"
                  tagName="i"
                />
              </Prefix>

              <InfoContainer data-testid="StudyInfo.Competences.CompetenceRequirements">
                {competenceRequirements.map((competenceRequirement, i) => {
                  return (
                    <CompetenceRequirement
                      key={i}
                      competenceRequirement={competenceRequirement}
                      expanded={expandedCompetences.indexOf(i) > -1}
                      expand={expandCompetence(i)}
                    />
                  )
                })}
              </InfoContainer>
            </HMediaQuery.MinWidth>
          </React.Fragment>
        )}
      </Container>
    )
  }
}
