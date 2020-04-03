import React from "react"
import styled from "styled"
import { Competences } from "./StudyInfo/Competences"
import {
  Osaamisvaatimus,
  TodentamisenProsessi,
  IOsaamisenHankkimistapa,
  IOsaamisenOsoittaminen,
  IOrganisaatio,
  ITarkentavatTiedotOsaamisenArvioija
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
import { Details } from "./StudyInfo/Details"
import { OneRowTable } from "./StudyInfo/Shared"
import { ColorType } from "theme"

interface ContainerProps {
  accentColor?: ColorType
  expanded: boolean
  width: string
}
const Container = styled("div")<ContainerProps>`
  display: ${props => (props.expanded ? "block" : "flex")};
  flex: ${props => (props.expanded ? "unset" : 1)};
  max-width: ${props =>
    props.expanded ? "100%" : `calc(${props.width} - 15px)`};
  width: ${props => (props.expanded ? "100%" : "unset")};
  border-top-style: solid;
  border-top-width: 4px;
  border-top-color: ${props =>
    !!props.accentColor ? props.theme.colors[props.accentColor] : "#979797"};
  box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.4);
  margin-left: ${props => (props.expanded ? "0" : "20px")};
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

const SubTitleContainer = styled(TitleContainer)`
  margin: 0px 0px 15px 20px;
`

const Title = styled("h2")`
  flex: 1;
  color: #000;
  display: block;
  margin: 10px 20px;
  ${props => props.theme.typography.heading3}
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
  accentColor?: ColorType
  /**
   * List of competence requirements
   * @default []
   */
  competenceRequirements?: Array<Osaamisvaatimus>
  /** List of competence demonstrations */
  osaamisenOsoittamiset?: Array<IOsaamisenOsoittaminen>
  /** olennainenSeikka is passed through to Details component */
  olennainenSeikka?: React.ReactNode
  /** Color of additional info container */
  fadedColor?: string
  /**
   * KoodiURI for this study
   */
  koodiUri?: string
  /**
   * List of learning periods.
   * @default []
   */
  osaamisenHankkimistavat?: Array<IOsaamisenHankkimistapa>
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
  koulutuksenJarjestaja?: IOrganisaatio
  tarkentavatTiedotOsaamisenArvioija?: ITarkentavatTiedotOsaamisenArvioija
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
  declare context: React.ContextType<typeof AppContext>

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

  private koulutuksenJarjestajaShouldBeShown() {
    return (
      this.state.expanded.details ||
      this.state.expanded.competences ||
      this.state.expanded.objectives
    )
  }

  render() {
    const {
      accentColor,
      competenceRequirements = [],
      osaamisenOsoittamiset = [],
      olennainenSeikka,
      fadedColor,
      osaamisenHankkimistavat = [],
      koodiUri,
      share,
      title,
      verificationProcess,
      width = "25%",
      objectives,
      koulutuksenJarjestaja,
      tarkentavatTiedotOsaamisenArvioija
    } = this.props
    const { featureFlags } = this.context
    const { expandedCompetences, expanded } = this.state
    const hasOsaamisenHakkimistavat =
      osaamisenHankkimistavat && osaamisenHankkimistavat.length > 0
    const hasDetails =
      hasOsaamisenHakkimistavat ||
      osaamisenOsoittamiset.length > 0 ||
      verificationProcess
    const hasActiveShare =
      typeof share !== "undefined" &&
      koodiUri === share.koodiUri &&
      share.type === "tyossaoppiminen"
    const detailsExpanded = expanded.details || hasActiveShare
    const showShareButton =
      expanded.details &&
      hasOsaamisenHakkimistavat &&
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
          {this.koulutuksenJarjestajaShouldBeShown() && (
            <SubTitleContainer>
              <OneRowTable
                th={
                  <FormattedMessage
                    id="tutkinnonOsa.toteuttavaKoulutuksenJarjestajaTitle"
                    defaultMessage="Toteuttava koulutuksenjärjestäjä"
                  />
                }
              >
                {koulutuksenJarjestaja?.organizationName}
              </OneRowTable>
            </SubTitleContainer>
          )}
          {hasDetails && (
            <Details
              fadedColor={fadedColor}
              osaamisenOsoittamiset={osaamisenOsoittamiset}
              olennainenSeikka={olennainenSeikka}
              expanded={detailsExpanded}
              osaamisenHankkimistavat={osaamisenHankkimistavat}
              verificationProcess={verificationProcess}
              koodiUri={koodiUri}
              share={share}
              toggle={this.toggle}
              koulutuksenJarjestaja={koulutuksenJarjestaja}
              tarkentavatTiedotOsaamisenArvioija={
                tarkentavatTiedotOsaamisenArvioija
              }
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
            <Objectives
              expanded={expanded.objectives}
              toggle={this.toggle}
              objectives={objectives}
            />
          )}
        </InnerContainer>
      </Container>
    )
  }
}
