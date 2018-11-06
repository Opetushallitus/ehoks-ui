import { CompetenceRequirement } from "components/CompetenceRequirement"
import { HorizontalLine } from "components/HorizontalLine"
import React from "react"
import { FormattedMessage } from "react-intl"
import styled from "styled"
import { Collapse } from "./Collapse"
import { Expand } from "./Expand"
import { IconContainer } from "./IconContainer"

const Container = styled("div")`
  background: #fff;
`

interface ExpandContainerProps {
  fadedColor: string
  hasDetails: boolean
}
const ExpandContainer = styled("div")`
  display: flex;
  align-items: center;
  padding: 10px 10px 10px 20px;
  background: ${(props: ExpandContainerProps) =>
    !props.hasDetails && props.fadedColor ? props.fadedColor : "unset"};
`

const ToggleLink = styled("div")`
  font-size: 16px;
  text-decoration: underline;
  color: #0076d9;
  cursor: pointer;

  @media screen and (max-width: ${props => props.theme.breakpoints.Max}px) {
    font-size: 16px;
  }

  @media screen and (max-width: ${props => props.theme.breakpoints.Large}px) {
    font-size: 14px;
  }
`

const ToggleAllTitle = styled(ToggleLink)`
  padding-right: 10px;
`

const ExpandTitle = styled(ToggleLink)`
  flex: 1;
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
  align-items: flex-end;
  padding: 10px 10px 10px 20px;
`

const InfoContainer = styled("ul")`
  padding: 0;
  margin: 10px 20px 20px 20px;
  background: #fff;
  color: #2b2b2b;
  border-radius: 2px;
  border: 1px solid #999;
  list-style: none;

  li {
    padding: 6px 12px;
    &:nth-child(2n) {
      background: #fafafa;
    }
  }
`

const Line = styled(HorizontalLine)`
  width: unset;
  margin: 0 20px;
`

interface CompetencesProps {
  assessment?: Array<{
    [key: string]: string[]
  }>
  collapseAll: () => void
  competenceRequirements?: string[]
  expandAll: () => void
  expandCompetence: (index: number) => () => void
  expanded?: boolean
  expandedCompetences: number[]
  fadedColor?: string
  hasDetails?: boolean
  toggle: (name: "competences" | "details") => () => void
}

export class Competences extends React.Component<CompetencesProps> {
  render() {
    const {
      assessment,
      collapseAll,
      competenceRequirements,
      expandAll,
      expandCompetence,
      expanded,
      expandedCompetences,
      fadedColor,
      hasDetails,
      toggle
    } = this.props
    const allExpanded =
      expandedCompetences.length === competenceRequirements.length
    return (
      <Container>
        {expanded ? (
          <React.Fragment>
            <CollapseContainer>
              <CollapseHeaderContainer>
                <CollapseHeader>
                  <FormattedMessage
                    id="opiskelusuunnitelma.competenceRequirements"
                    defaultMessage="Ammattitaitovaatimukset"
                  />
                </CollapseHeader>
                <ToggleAllTitle onClick={allExpanded ? collapseAll : expandAll}>
                  {allExpanded ? (
                    <FormattedMessage
                      id="opiskelusuunnitelma.collapseAllAssessments"
                      defaultMessage="Piilota arviointikriteerit"
                    />
                  ) : (
                    <FormattedMessage
                      id="opiskelusuunnitelma.showAllAssessments"
                      defaultMessage="Näytä kaikki arviointikriteerit"
                    />
                  )}
                </ToggleAllTitle>
              </CollapseHeaderContainer>
              <IconContainer onClick={toggle("competences")}>
                <Collapse size={40} />
              </IconContainer>
            </CollapseContainer>
            <Line height="2px" backgroundColor="#000" />
          </React.Fragment>
        ) : (
          <ExpandContainer fadedColor={fadedColor} hasDetails={hasDetails}>
            <ExpandTitle onClick={toggle("competences")}>
              <FormattedMessage
                id="opiskelusuunnitelma.expandStudyInfo"
                defaultMessage="Ammattitaitovaatimukset ja arviointikriteerit"
              />
            </ExpandTitle>
            <Expand size={40} onClick={toggle("competences")} />
          </ExpandContainer>
        )}
        {expanded && (
          <InfoContainer>
            {competenceRequirements.map((competenceRequirement, i) => {
              return (
                <CompetenceRequirement
                  key={i}
                  text={competenceRequirement}
                  assessment={assessment[i]}
                  expanded={expandedCompetences.indexOf(i) > -1}
                  expand={expandCompetence(i)}
                />
              )
            })}
          </InfoContainer>
        )}
      </Container>
    )
  }
}
