import React from "react"
import { FormattedMessage } from "react-intl"
import styled from "styled"

const Container = styled("li")`
  display: flex;
  flex-direction: column;
`

const TitleRow = styled("div")`
  display: flex;
  flex: 1;
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

const ToggleAssessment = styled("div")`
  cursor: pointer;
  color: #0076d9;
  text-decoration: underline;
`

interface CompetenceRequirementProps {
  text: string
  assessment: {
    [key: string]: string[]
  }
  expanded: boolean
  expand: () => void
}
export class CompetenceRequirement extends React.Component<
  CompetenceRequirementProps
> {
  render() {
    const { assessment = {}, expanded, expand, text } = this.props
    return (
      <Container>
        <TitleRow>
          <Text expanded={expanded}>{text}</Text>
          <ToggleAssessment onClick={expand}>
            {expanded ? (
              <FormattedMessage
                id="opiskelusuunnitelma.hideAssessment"
                defaultMessage="Piilota arviointikriteerit"
              />
            ) : (
              <FormattedMessage
                id="opiskelusuunnitelma.showAssessment"
                defaultMessage="Näytä arviointikriteerit"
              />
            )}
          </ToggleAssessment>
        </TitleRow>
        {expanded ? (
          <Assessment>
            {Object.keys(assessment).map(title => {
              return (
                <AssessmentItem key={title}>
                  <AssessmentHeader>{title}</AssessmentHeader>
                  {assessment[title].map((criterion, i) => {
                    return (
                      <AssessmentContent key={i}>{criterion}</AssessmentContent>
                    )
                  })}
                </AssessmentItem>
              )
            })}
          </Assessment>
        ) : null}
      </Container>
    )
  }
}
