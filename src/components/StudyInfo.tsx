import { format } from "date-fns/esm"
import React from "react"
import styled from "react-emotion"
import { MdUnfoldLess, MdUnfoldMore } from "react-icons/md"
import { FormattedMessage, intlShape } from "react-intl"
import { breakpoints } from "utils"

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

const AdditionalInfo = styled("div")`
  padding: 20px;
  background: #f8f8f8;
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
  cursor: pointer;
`

const ToggleTitle = styled("div")`
  flex: 1;
  font-size: 18px;
  text-decoration: underline;
  color: #0076d9;

  @media screen and (max-width: ${breakpoints.Max}px) {
    font-size: 16px;
  }

  @media screen and (max-width: ${breakpoints.Large}px) {
    font-size: 14px;
  }
`

const ToggleHeader = styled("h2")`
  flex: 1;
  margin: 0;
  border-bottom: 1px solid #000;
`

const Expand = styled(MdUnfoldMore)`
  fill: #717171;
  transform: rotate(45deg);
`

const Collapse = styled(MdUnfoldLess)`
  fill: #717171;
  transform: rotate(45deg);
`

const InfoContainer = styled("ul")``

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
  assessment?: string[]
  /**
   * List of competence requirements
   * @default []
   */
  competenceRequirements?: string[]
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

/**
 * Toggleable content panel with inline help popup
 */
export class StudyInfo extends React.Component<StudyInfoProps> {
  static contextTypes = {
    intl: intlShape
  }
  state = {
    expanded: false
  }

  toggle = () => {
    this.setState({ expanded: !this.state.expanded })
  }

  render() {
    const { intl } = this.context
    const {
      accentColor,
      approved,
      assessment = [],
      competenceRequirements = [],
      href,
      learningEnvironments = [],
      period = [],
      title
    } = this.props

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
                <FormattedMessage
                  id="opiskelusuunnitelma.learningEnvironment"
                  defaultMessage="Oppimisympäristö"
                />
                : {learningEnvironments.join(", ")}
              </LearningEnvironments>
            )}
            {periodText && (
              <Period accentColor={accentColor}>{periodText}</Period>
            )}
          </Details>
          <AdditionalInfo>
            <InfoToggle onClick={this.toggle}>
              {this.state.expanded ? (
                <React.Fragment>
                  <ToggleHeader>
                    <FormattedMessage
                      id="opiskelusuunnitelma.competenceRequirements"
                      defaultMessage="Ammattitaitovaatimukset"
                    />
                  </ToggleHeader>
                  <Collapse size={40} />
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <ToggleTitle>
                    <FormattedMessage
                      id="opiskelusuunnitelma.expandStudyInfo"
                      defaultMessage="Lue lisää ammattitaito-vaatimuksista ja arvioinnista"
                    />
                  </ToggleTitle>
                  <Expand size={40} />
                </React.Fragment>
              )}
            </InfoToggle>
            {this.state.expanded && (
              <InfoContainer>
                {[...assessment, ...competenceRequirements].map(
                  (infoRow, i) => {
                    return <li key={i}>{infoRow}</li>
                  }
                )}
              </InfoContainer>
            )}
          </AdditionalInfo>
        </InnerContainer>
      </Container>
    )
  }
}
