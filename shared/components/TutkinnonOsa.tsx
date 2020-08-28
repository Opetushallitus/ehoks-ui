import React from "react"
import styled from "styled"
import { Competences } from "./TutkinnonOsa/Competences"
import {
  Osaamisvaatimus,
  TodentamisenProsessi,
  IOsaamisenHankkimistapa,
  IOsaamisenOsoittaminen,
  IOrganisaatio,
  ITarkentavatTiedotOsaamisenArvioija
} from "models/helpers/TutkinnonOsa"
import { FormattedMessage } from "react-intl"
import { navigate } from "@reach/router"
import { stringifyShareParams } from "utils/shareParams"
import { AppContext } from "components/AppContext"
import { ToggleableItems } from "./TutkinnonOsa/TutkinnonOsaHelpers"
import { Objectives } from "./TutkinnonOsa/Objectives"
import { Details } from "./TutkinnonOsa/Details"
import { OneRowTable } from "./TutkinnonOsa/Shared"
import { ColorType } from "theme"
import { ShareType, TutkinnonOsaType } from "../models/helpers/ShareTypes"

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
export interface TutkinnonOsaProps {
  /** Color of top border */
  accentColor?: ColorType
  /**
   * List of competence requirements
   * @default []
   */
  competenceRequirements?: Osaamisvaatimus[]
  /** List of competence demonstrations */
  osaamisenOsoittamiset?: IOsaamisenOsoittaminen[]
  /** olennainenSeikka is passed through to Details component */
  olennainenSeikka?: React.ReactNode
  /** Color of additional info container */
  fadedColor?: string
  /**
   * KoodiURI for this study
   */
  koodiUri?: string
  moduleId?: string
  /**
   * List of learning periods.
   * @default []
   */
  osaamisenHankkimistavat?: IOsaamisenHankkimistapa[]
  /**
   * Current share state from url
   */
  share?: {
    type?: ShareType
    moduleId?: string
    tutkinnonOsaTyyppi?: TutkinnonOsaType
    tutkinnonOsaModuleId?: string
    hoksEid?: string
  }
  /** Title of the study, always visible */
  title?: React.ReactNode
  /**
   * Verification process details
   */
  todentamisenProsessi?: TodentamisenProsessi
  tutkinnonOsaModuleId?: string
  tutkinnonOsaTyyppi?: TutkinnonOsaType
  /**
   * Width of the element for desktop resolutions
   * @default 25%
   */
  width?: string
  objectives?: string
  koulutuksenJarjestaja?: IOrganisaatio
  tarkentavatTiedotOsaamisenArvioija?: ITarkentavatTiedotOsaamisenArvioija
}

export interface TutkinnonOsaState {
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
export class TutkinnonOsa extends React.Component<
  TutkinnonOsaProps,
  TutkinnonOsaState
> {
  static contextType = AppContext
  declare context: React.ContextType<typeof AppContext>

  state: TutkinnonOsaState = {
    expanded: {
      competences: false,
      details: false,
      objectives: false
    },
    expandedCompetences: []
  }

  componentDidMount() {
    const { share, moduleId } = this.props
    if (typeof share !== "undefined" && moduleId === share.moduleId) {
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
    nextProps: TutkinnonOsaProps,
    prevState: TutkinnonOsaState
  ) {
    const { moduleId, share } = nextProps
    if (typeof share !== "undefined" && moduleId === share.moduleId) {
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
    this.setState((state: TutkinnonOsaState) => ({
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
    const { moduleId, tutkinnonOsaTyyppi } = this.props
    if (moduleId && tutkinnonOsaTyyppi) {
      navigate(
        `${window.location.pathname}?${stringifyShareParams({
          moduleId,
          type: "osaamisenhankkimistapa",
          tutkinnonOsaTyyppi,
          tutkinnonOsaModuleId: moduleId,
          hoksEid: hoksEid
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
      moduleId,
      tutkinnonOsaTyyppi,
      share,
      title,
      todentamisenProsessi,
      width = "25%",
      objectives,
      koulutuksenJarjestaja,
      tarkentavatTiedotOsaamisenArvioija
    } = this.props
    const { expandedCompetences, expanded } = this.state
    const hasOsaamisenHakkimistavat =
      osaamisenHankkimistavat && osaamisenHankkimistavat.length > 0
    const hasDetails =
      hasOsaamisenHakkimistavat ||
      osaamisenOsoittamiset.length > 0 ||
      todentamisenProsessi
    const hasActiveShare =
      typeof share !== "undefined" && moduleId === share.moduleId
    const detailsExpanded = expanded.details || hasActiveShare

    return (
      <Container
        accentColor={accentColor}
        expanded={expanded.competences || detailsExpanded}
        width={width}
      >
        <InnerContainer>
          <TitleContainer>
            <Title data-testid="Title">{title}</Title>
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
              todentamisenProsessi={todentamisenProsessi}
              koodiUri={koodiUri}
              share={share}
              moduleId={moduleId}
              tutkinnonOsaTyyppi={tutkinnonOsaTyyppi}
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
            tutkinnonOsaTyyppi={tutkinnonOsaTyyppi}
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
