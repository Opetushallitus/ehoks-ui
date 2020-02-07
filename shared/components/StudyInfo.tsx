import React from "react"
import styled from "styled"
import { Competences } from "./StudyInfo/Competences"
import { Details } from "./StudyInfo/Details"
import {
  Osaamisvaatimus,
  Naytto,
  Harjoittelujakso,
  TodentamisenProsessi,
  OsaamisenHankkimistapa
} from "models/helpers/TutkinnonOsa"
import { ShareType } from "stores/NotificationStore"
import { MdShare } from "react-icons/md"
import { HeroButton } from "components/Button"
import { FormattedMessage } from "react-intl"
import { navigate } from "@reach/router"
import { stringifyShareParams } from "utils/shareParams"
import { AppContext } from "components/AppContext"
import { ToggleableItems } from "./StudyInfo/StudyInfoHelpers"
import { Objectives } from "./StudyInfo/Objectives"

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

const TitleContainer = styled("div")`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const Title = styled("h2")`
  flex: 1;
  color: #000;
  font-weight: 600;
  font-size: 20px;
  display: block;
  margin: 10px 20px;
`

const ShareIcon = styled(MdShare)`
  margin-left: 6px;
`

const Button = styled(HeroButton)`
  display: inline-flex;
`

const ShareButton = styled("div")`
  padding: 10px 70px 10px 0;
`

export interface StudyInfoProps {
  /** Color of top border */
  accentColor?: string
  /**
   * List of competence requirements
   * @default []
   */
  competenceRequirements?: Array<Osaamisvaatimus>
  /**
   * List of competence acquiring methods
   * @default []
   */
  competenceAcquiringMethods?: Array<OsaamisenHankkimistapa>
  /** List of competence demonstrations */
  demonstrations?: Array<Naytto>
  /** extraContent is passed through to Details component */
  extraContent?: React.ReactNode
  /** Color of additional info container */
  fadedColor?: string
  /**
   * KoodiURI for this study
   */
  koodiUri?: string
  /**
   * List of learning periods
   * @default []
   */
  learningPeriods?: Array<Harjoittelujakso>
  /**
   * Current share state from url
   */
  share?: { koodiUri: string; type: ShareType | "" }
  /** Title of the study, always visible */
  title?: React.ReactNode
  /**
   * Verification process details
   */
  verificationProcess?: TodentamisenProsessi
  /**
   * Width of the element for desktop resolutions
   * @default 25%
   */
  width?: string
  objectives?: string
}

export interface StudyInfoState {
  expanded: {
    competences: boolean
    details: boolean
    objectives: boolean
  }
  expandedCompetences: number[]
}

/**
 * Shows information about single study
 */
export class StudyInfo extends React.Component<StudyInfoProps, StudyInfoState> {
  static contextType = AppContext
  context!: React.ContextType<typeof AppContext>

  state: StudyInfoState = {
    expanded: {
      competences: false,
      details: false,
      objectives: false
    },
    expandedCompetences: []
  }

  componentDidMount() {
    const { koodiUri, share } = this.props
    if (typeof share !== "undefined" && koodiUri === share.koodiUri) {
      this.setState(state => ({
        ...state,
        expanded: {
          ...state.expanded,
          details: true
        }
      }))
    }
  }

  static getDerivedStateFromProps(
    nextProps: StudyInfoProps,
    prevState: StudyInfoState
  ) {
    const { koodiUri, share } = nextProps
    if (typeof share !== "undefined" && koodiUri === share.koodiUri) {
      return {
        ...prevState,
        expanded: {
          ...prevState.expanded,
          details: true
        }
      }
    } else {
      return null
    }
  }

  toggle = (name: ToggleableItems) => () => {
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

  share = () => {
    const { koodiUri } = this.props
    if (koodiUri) {
      navigate(
        `${window.location.pathname}?${stringifyShareParams({
          share: koodiUri,
          type: "tyossaoppiminen"
        })}`
      )
    }
  }

  render() {
    const {
      accentColor,
      competenceRequirements = [],
      competenceAcquiringMethods = [],
      demonstrations = [],
      extraContent = null,
      fadedColor,
      learningPeriods = [],
      koodiUri,
      share,
      title,
      verificationProcess,
      width = "25%",
      objectives
    } = this.props
    const { featureFlags } = this.context
    const { expandedCompetences, expanded } = this.state
    const hasLearningPeriods = learningPeriods && learningPeriods.length > 0
    const hasDetails =
      hasLearningPeriods || demonstrations.length > 0 || verificationProcess
    const hasActiveShare =
      typeof share !== "undefined" &&
      koodiUri === share.koodiUri &&
      share.type === "tyossaoppiminen"
    const detailsExpanded = expanded.details || hasActiveShare
    const showShareButton =
      expanded.details &&
      hasLearningPeriods &&
      !hasActiveShare &&
      featureFlags.shareDialog

    return (
      <Container
        accentColor={accentColor}
        expanded={expanded.competences || detailsExpanded}
        width={width}
      >
        <InnerContainer>
          <TitleContainer>
            <Title data-testid="Title">{title}</Title>
            {showShareButton && (
              <ShareButton>
                <Button onClick={this.share}>
                  <FormattedMessage
                    id="jakaminen.jaaTutkinnonosanTiedotButtonTitle"
                    defaultMessage="Tutkinnonosan tietojen jakaminen"
                  />
                  <ShareIcon size={24} />
                </Button>
              </ShareButton>
            )}
          </TitleContainer>
          {hasDetails && (
            <Details
              fadedColor={fadedColor}
              demonstrations={demonstrations}
              extraContent={extraContent}
              expanded={detailsExpanded}
              learningPeriods={learningPeriods}
              competenceAcquiringMethods={competenceAcquiringMethods}
              verificationProcess={verificationProcess}
              koodiUri={koodiUri}
              share={share}
              toggle={this.toggle}
            />
          )}
          <Competences
            collapseAll={this.collapseAll}
            competenceRequirements={competenceRequirements}
            expandAll={this.expandAll}
            expandCompetence={this.expandCompetence}
            expanded={expanded.competences}
            expandedCompetences={expandedCompetences}
            toggle={this.toggle}
          />
          {objectives && (
            <Objectives expanded={expanded.objectives} toggle={this.toggle} objectives={objectives}/>
          )}
        </InnerContainer>
      </Container>
    )
  }
}
