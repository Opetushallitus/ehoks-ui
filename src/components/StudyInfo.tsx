import React from "react"
import { MdUnfoldLess, MdUnfoldMore } from "react-icons/md"
import { FormattedMessage } from "react-intl"
import styled from "styled"
import { CompetenceRequirement } from "./CompetenceRequirement"
import { HorizontalLine } from "./HorizontalLine"
import { Demonstration } from "./StudyInfo/Demonstration"
import { DemonstrationDates } from "./StudyInfo/DemonstrationDates"
import { LearningPeriod } from "./StudyInfo/LearningPeriod"
import { LearningPeriodDates } from "./StudyInfo/LearningPeriodDates"
import { Period } from "./StudyInfo/Period"

interface ContainerProps {
  accentColor?: string
  expanded: boolean
  width: string
}
const Container = styled("div")`
  display: ${(props: ContainerProps) => (props.expanded ? "block" : "flex")};
  flex: ${(props: ContainerProps) => (props.expanded ? "unset" : 1)};
  max-width: ${(props: ContainerProps) =>
    props.expanded ? "100%" : `calc(${props.width} - 15px)`};
  width: ${(props: ContainerProps) => (props.expanded ? "100%" : "unset")};
  border-top-style: solid;
  border-top-width: 4px;
  border-top-color: ${(props: ContainerProps) =>
    props.accentColor ? props.accentColor : "#979797"};
  box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.4);
  margin-left: ${(props: ContainerProps) => (props.expanded ? "0" : "20px")};
  margin-bottom: 20px;

  &:first-of-type {
    margin-left: 0;
  }

  @media screen and (max-width: 1060px) {
    margin-left: 0;
    max-width: unset;
  }

  &:nth-child(5n + 1) {
    margin-left: 0;
  }
`

const InnerContainer = styled("div")`
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: space-between;
`

interface DetailsProps {
  fadedColor: string
}
const Details = styled("div")`
  display: flex;
  flex-direction: row;
  height: 100%;
  padding: 10px 10px 20px 20px;
  justify-content: space-between;
  background: ${(props: DetailsProps) =>
    props.fadedColor ? props.fadedColor : "#fef8f3"};
  border-top: 1px solid #c9cdcf;
  border-bottom: 1px solid #c9cdcf;
`

const DetailsExpanded = styled(Details)`
  padding: 10px 10px 0 20px;
`

const DetailsContent = styled("div")`
  flex: 1;
  display: flex;
  flex-direction: column;
`

const AdditionalInfo = styled("div")`
  background: #fff;
`

const Title = styled("h2")`
  color: #000;
  font-weight: 600;
  font-size: 20px;
  display: block;
  margin: 10px 20px;
`

const LearningEnvironments = styled("div")`
  margin: 10px 0 20px 0;
`

const ExpandContainer = styled("div")`
  display: flex;
  align-items: center;
  padding: 10px 10px 10px 20px;
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

const Expand = styled(MdUnfoldMore)`
  fill: #717171;
  transform: rotate(45deg);
  cursor: pointer;
`

const Collapse = styled(MdUnfoldLess)`
  fill: #717171;
  transform: rotate(45deg);
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

const IconContainer = styled("div")`
  cursor: pointer;
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

// TODO: use type from mobx-state-tree
export interface TempLearningPeriod {
  approved?: string
  period?: [string, string]
  instructor?: string
  assignments?: string[]
}

// TODO: use type from mobx-state-tree
export interface TempDemonstration {
  period: string[]
  organisation: string
  environment: string
  assessors: string[]
  assignments: string[]
}

export interface StudyInfoProps {
  /** Color of top border */
  accentColor?: string
  /**
   * List of assessment criteria
   * @default []
   */
  assessment?: Array<{
    [key: string]: string[]
  }>
  /**
   * List of competence requirements
   * @default []
   */
  competenceRequirements?: string[]
  /** List of competence demonstrations */
  demonstrations?: TempDemonstration[]
  /** Color of additional info container */
  fadedColor?: string
  /**
   * List of learning periods
   * @default []
   */
  learningPeriods?: TempLearningPeriod[]
  /**
   * List of locations
   * @default []
   */
  locations?: string[]
  /** Title of the accordion, always visible */
  title?: React.ReactNode
  /**
   * Width of the element for desktop resolutions
   * @default 25%
   */
  width?: string
}

export interface StudyInfoState {
  expanded: {
    competences: boolean
    details: boolean
  }
  expandedCompetences: number[]
}

/**
 * Shows information about single study
 */
export class StudyInfo extends React.Component<StudyInfoProps, StudyInfoState> {
  state: StudyInfoState = {
    expanded: {
      competences: false,
      details: false
    },
    expandedCompetences: []
  }

  toggle = (name: "competences" | "details") => () => {
    this.setState(state => ({
      ...state,
      expanded: { ...state.expanded, [name]: !state.expanded[name] }
    }))
  }

  expandCompetence = (index: number) => () => {
    this.setState((state: StudyInfoState) => ({
      expandedCompetences:
        state.expandedCompetences.indexOf(index) > -1
          ? state.expandedCompetences.filter(i => i !== index)
          : [...state.expandedCompetences, index]
    }))
  }

  expandAll = () => {
    this.setState({
      expandedCompetences: (this.props.competenceRequirements || []).map(
        (_, i) => i
      )
    })
  }

  collapseAll = () => {
    this.setState({ expandedCompetences: [] })
  }

  render() {
    const {
      accentColor,
      assessment = [],
      competenceRequirements = [],
      demonstrations = [],
      fadedColor,
      locations = [],
      learningPeriods: periods,
      title,
      width = "25%"
    } = this.props
    const learningPeriods: TempLearningPeriod[] =
      periods && periods.length
        ? this.props.learningPeriods
        : [{ approved: "", period: ["", ""] }]
    const { expandedCompetences, expanded } = this.state
    const allExpanded =
      this.state.expandedCompetences.length === competenceRequirements.length

    const learningPeriod = learningPeriods[0]

    return (
      <Container
        accentColor={accentColor}
        expanded={expanded.competences || expanded.details}
        width={width}
      >
        <InnerContainer>
          <Title>{title}</Title>
          {expanded.details ? (
            <DetailsExpanded fadedColor={fadedColor}>
              <DetailsContent>
                {locations.length > 0 && (
                  <LearningEnvironments>
                    {locations.join(", ")}
                  </LearningEnvironments>
                )}
                {learningPeriods.map((period, i) => {
                  return (
                    <LearningPeriod
                      key={i}
                      learningPeriod={period}
                      accentColor={accentColor}
                    />
                  )
                })}
                {demonstrations.map((demonstration, i) => {
                  return (
                    <Demonstration
                      key={i}
                      demonstration={demonstration}
                      accentColor={accentColor}
                    />
                  )
                })}
              </DetailsContent>
              <IconContainer onClick={this.toggle("details")}>
                <Collapse size={40} />
              </IconContainer>
            </DetailsExpanded>
          ) : (
            <Details fadedColor={fadedColor}>
              <DetailsContent>
                {locations.length > 0 && (
                  <LearningEnvironments>
                    {locations.join(", ")}
                  </LearningEnvironments>
                )}
                <Period accentColor={accentColor}>
                  <LearningPeriodDates learningPeriod={learningPeriod} />
                  {demonstrations.length > 0 && (
                    <React.Fragment>
                      {", "}
                      <DemonstrationDates demonstration={demonstrations[0]} />
                    </React.Fragment>
                  )}
                </Period>
              </DetailsContent>
              <IconContainer onClick={this.toggle("details")}>
                <Expand size={40} />
              </IconContainer>
            </Details>
          )}
          <AdditionalInfo>
            {expanded.competences ? (
              <React.Fragment>
                <CollapseContainer>
                  <CollapseHeaderContainer>
                    <CollapseHeader>
                      <FormattedMessage
                        id="opiskelusuunnitelma.competenceRequirements"
                        defaultMessage="Ammattitaitovaatimukset"
                      />
                    </CollapseHeader>
                    <ToggleAllTitle
                      onClick={allExpanded ? this.collapseAll : this.expandAll}
                    >
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
                  <IconContainer onClick={this.toggle("competences")}>
                    <Collapse size={40} />
                  </IconContainer>
                </CollapseContainer>
                <Line height="2px" backgroundColor="#000" />
              </React.Fragment>
            ) : (
              <ExpandContainer>
                <ExpandTitle onClick={this.toggle("competences")}>
                  <FormattedMessage
                    id="opiskelusuunnitelma.expandStudyInfo"
                    defaultMessage="Ammattitaitovaatimukset ja arviointikriteerit"
                  />
                </ExpandTitle>
                <Expand size={40} onClick={this.toggle("competences")} />
              </ExpandContainer>
            )}
            {expanded.competences && (
              <InfoContainer>
                {competenceRequirements.map((competenceRequirement, i) => {
                  return (
                    <CompetenceRequirement
                      key={i}
                      text={competenceRequirement}
                      assessment={assessment[i]}
                      expanded={expandedCompetences.indexOf(i) > -1}
                      expand={this.expandCompetence(i)}
                    />
                  )
                })}
              </InfoContainer>
            )}
          </AdditionalInfo>
        </InnerContainer>
      </Container>
    )
  }
}
