import format from "date-fns/format"
import React from "react"
import styled from "react-emotion"
import { MdUnfoldLess, MdUnfoldMore } from "react-icons/md"
import { FormattedMessage, intlShape } from "react-intl"
import { CompetenceRequirement } from "./CompetenceRequirement"

interface ContainerProps {
  accentColor?: string
  expanded: boolean
}
const Container = styled("div")`
  display: ${(props: ContainerProps) => (props.expanded ? "block" : "flex")};
  flex: ${(props: ContainerProps) => (props.expanded ? "unset" : 1)};
  max-width: ${(props: ContainerProps) =>
    props.expanded ? "100%" : "calc(25% - 15px)"};
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

export const EmptyItem = styled("div")`
  flex-basis: 100%;
  width: 0px;
  height: 0px;
  overflow: hidden;
`

const InnerContainer = styled("div")`
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: space-between;
`

const Details = styled("div")`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 20px;
  justify-content: space-between;
`

interface AdditionalInfoProps {
  fadedColor: string
}
const AdditionalInfo = styled("div")`
  padding: 20px;
  background: ${(props: AdditionalInfoProps) =>
    props.fadedColor ? props.fadedColor : "#fef8f3"};
  border-top: 1px solid #c8cdcf;
  min-height: 87px;
`

const Title = styled("a")`
  color: #0076d9;
  font-weight: 600;
  font-size: 18px;
  display: block;
`

const LearningEnvironments = styled("div")`
  margin: 20px 0;
`

const InfoToggle = styled("div")`
  display: flex;
`

const ToggleLink = styled("div")`
  font-size: 18px;
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

const ShowAllTitle = styled(ToggleLink)`
  padding-right: 20px;
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

const CollapseHeader = styled("h2")`
  flex: 1;
  margin: 0;
  font-size: 22px;
  font-weight: 600;
`

const CollapseContainer = styled("div")`
  flex: 1;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #000;
`

const IconContainer = styled("div")`
  cursor: pointer;
`

const InfoContainer = styled("ul")`
  padding: 0;
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

interface PeriodProps {
  accentColor?: string
}
const Period = styled("div")`
  color: ${(props: PeriodProps) =>
    props.accentColor ? props.accentColor : "#979797"};
`

export interface StudyInfoProps {
  /** Color of top border */
  accentColor?: string
  /** Approval date */
  approved?: Date
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
  /** Color of additional info container */
  fadedColor?: string
  /** URI to link to */
  href: string
  /**
   * List of learning environments
   * @default []
   */
  learningEnvironments?: string[]
  /**
   * Starting and ending dates
   * @default []
   */
  period?: Date[]
  /** Title of the accordion, always visible */
  title?: React.ReactNode
}

export interface StudyInfoState {
  expanded: boolean
  expandedCompetences: number[]
}

/**
 * Toggleable content panel with inline help popup
 */
export class StudyInfo extends React.Component<StudyInfoProps, StudyInfoState> {
  static contextTypes = {
    intl: intlShape
  }
  state: StudyInfoState = {
    expanded: false,
    expandedCompetences: []
  }

  toggle = () => {
    this.setState({ expanded: !this.state.expanded })
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

  render() {
    const { intl } = this.context
    const {
      accentColor,
      approved,
      assessment = [],
      competenceRequirements = [],
      fadedColor,
      href,
      learningEnvironments = [],
      period = [],
      title
    } = this.props
    const { expandedCompetences } = this.state

    const [startDate, endDate] = period
    const periodText = approved
      ? `${intl.formatMessage({
          defaultMessage: "Hyväksytty",
          id: "opiskelusuunnitelma.approved"
        })} ${format(approved, "d.M.YYYY")}`
      : startDate && endDate
        ? `${format(startDate, "d.M.YYYY")}-${format(endDate, "d.M.YYYY")}`
        : null

    return (
      <Container accentColor={accentColor} expanded={this.state.expanded}>
        <InnerContainer>
          <Details>
            <Title href={href} target="_blank">
              {title}
            </Title>
            {learningEnvironments.length > 0 && (
              <LearningEnvironments>
                {learningEnvironments.join(", ")}
              </LearningEnvironments>
            )}
            {periodText && (
              <Period accentColor={accentColor}>{periodText}</Period>
            )}
          </Details>
          <AdditionalInfo fadedColor={fadedColor}>
            <InfoToggle>
              {this.state.expanded ? (
                <CollapseContainer>
                  <CollapseHeader>
                    <FormattedMessage
                      id="opiskelusuunnitelma.competenceRequirements"
                      defaultMessage="Ammattitaitovaatimukset"
                    />
                  </CollapseHeader>
                  <ShowAllTitle onClick={this.expandAll}>
                    <FormattedMessage
                      id="opiskelusuunnitelma.showAllAssessments"
                      defaultMessage="Näytä kaikki arvioinnit"
                    />
                  </ShowAllTitle>
                  <IconContainer onClick={this.toggle}>
                    <Collapse size={40} />
                  </IconContainer>
                </CollapseContainer>
              ) : (
                <React.Fragment>
                  <ExpandTitle onClick={this.toggle}>
                    <FormattedMessage
                      id="opiskelusuunnitelma.expandStudyInfo"
                      defaultMessage="Lue lisää ammattitaito-vaatimuksista ja arvioinnista"
                    />
                  </ExpandTitle>
                  <Expand size={40} onClick={this.toggle} />
                </React.Fragment>
              )}
            </InfoToggle>
            {this.state.expanded && (
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
