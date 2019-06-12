import React from "react"
import styled from "styled"
import { Competences } from "./StudyInfo/Competences"
import { Details } from "./StudyInfo/Details"
import {
  Osaamisvaatimus,
  Naytto,
  Harjoittelujakso,
  TodentamisenProsessi
} from "models/helpers/TutkinnonOsa"
import { ShareType } from "stores/NotificationStore"
import { MdShare } from "react-icons/md"
import { HeroButton } from "components/Button"
import { FormattedMessage } from "react-intl"
import { navigate } from "@reach/router"
import { stringifyShareParams } from "utils/shareParams"
import { FetchShareLinks } from "stores/ShareLinkStore"

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
  padding: 10px 70px 10px 10px;
  min-height: 74px;
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

export interface StudyInfoProps {
  /** Color of top border */
  accentColor?: string
  /**
   * List of competence requirements
   * @default []
   */
  competenceRequirements?: Array<Osaamisvaatimus>
  /** List of competence demonstrations */
  demonstrations?: Array<Naytto>
  /** extraContent is passed through to Details component */
  extraContent?: React.ReactNode
  /** Color of additional info container */
  fadedColor?: string
  /** Method that fetches shared links from backend */
  fetchShareLinks: FetchShareLinks
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
      demonstrations = [],
      extraContent = null,
      fadedColor,
      fetchShareLinks,
      learningPeriods = [],
      koodiUri,
      share,
      title,
      verificationProcess,
      width = "25%"
    } = this.props
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
      expanded.details && hasLearningPeriods && !hasActiveShare

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
              <Button onClick={this.share}>
                <FormattedMessage
                  id="jakaminen.jaaTutkinnonosanTiedotButtonTitle"
                  defaultMessage="Tutkinnonosan tietojen jakaminen"
                />
                <ShareIcon size={24} />
              </Button>
            )}
          </TitleContainer>
          {hasDetails && (
            <Details
              fadedColor={fadedColor}
              fetchShareLinks={fetchShareLinks}
              demonstrations={demonstrations}
              extraContent={extraContent}
              expanded={detailsExpanded}
              learningPeriods={learningPeriods}
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
        </InnerContainer>
      </Container>
    )
  }
}
