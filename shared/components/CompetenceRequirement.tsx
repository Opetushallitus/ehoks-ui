import React from "react"
import { FormattedMessage } from "react-intl"
import styled from "styled"
import { SnapshotOrInstance } from "mobx-state-tree"
import { Osaamisvaatimus } from "models/Osaamisvaatimus"

const Container = styled("li")`
  display: flex;
  flex-direction: column;
`

const TitleRow = styled("div")`
  display: flex;
  flex: 1;

  @media screen and (max-width: ${props => props.theme.breakpoints.Tablet}px) {
    flex-direction: column;
  }
`

const Assessment = styled("div")`
  border-radius: 2px;
  border: 1px solid #999;
  margin: 10px 0 0 10px;
  flex: 1;
`

const AssessmentItem = styled("div")`
  border-bottom: 1px solid #999;
  background: #f8f8f8;

  &:last-child {
    border-bottom-width: 0;
  }

  &:nth-child(2n) {
    background: #fff;
  }
`

const AssessmentHeader = styled("div")`
  font-weight: 600;
  padding: 6px 10px;
`

const AssessmentContent = styled("div")`
  padding: 6px 10px;
`

interface TextProps {
  expanded: boolean
}
const Text = styled("div")`
  flex: 1;
  font-weight: ${(props: TextProps) => (props.expanded ? "600" : "400")};
`

const ToggleAssessment = styled("button")`
  cursor: pointer;
  color: #0076d9;
  text-decoration: underline;
  appearance: none;
  border: none;
  text-align: left;
  padding: 0;
  background: transparent;
  font-size: 15px;
`

interface CompetenceRequirementProps {
  competenceRequirement: SnapshotOrInstance<typeof Osaamisvaatimus>
  expanded: boolean
  expand: () => void
}
export class CompetenceRequirement extends React.Component<CompetenceRequirementProps> {
  render() {
    const { competenceRequirement, expanded, expand } = this.props
    const kriteerit = competenceRequirement.kriteerit || []
    return (
      <Container>
        <TitleRow>
          <Text expanded={expanded}>{competenceRequirement.kuvaus}</Text>
          <ToggleAssessment onClick={expand} data-testid="ToggleAssessment">
            {expanded ? (
              <FormattedMessage
                id="opiskelusuunnitelma.piilotaKriteeritLink"
                defaultMessage="Piilota arviointikriteerit"
              />
            ) : (
              <FormattedMessage
                id="opiskelusuunnitelma.naytaKriteeritLink"
                defaultMessage="Näytä arviointikriteerit"
              />
            )}
          </ToggleAssessment>
        </TitleRow>
        {expanded ? (
          <Assessment data-testid="Assessment">
            {kriteerit.map(arviointikriteeri => (
              <AssessmentItem key={arviointikriteeri.kuvaus}>
                <AssessmentHeader>{arviointikriteeri.kuvaus}</AssessmentHeader>
                {(arviointikriteeri.kriteerit || []).map((kriteeri, i) => (
                  <AssessmentContent key={i}>{kriteeri}</AssessmentContent>
                ))}
              </AssessmentItem>
            ))}
          </Assessment>
        ) : null}
      </Container>
    )
  }
}
