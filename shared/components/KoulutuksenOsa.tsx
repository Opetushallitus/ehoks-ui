import React from "react"
import styled from "styled"
import {
  Osaamisvaatimus,
  TodentamisenProsessi,
  IOsaamisenHankkimistapa,
  IOsaamisenOsoittaminen,
  IOrganisaatio,
  ITarkentavatTiedotOsaamisenArvioija
} from "models/helpers/TutkinnonOsa"
import { FormattedMessage } from "react-intl"
import { AppContext } from "components/AppContext"
import { OneRowTable } from "./TutkinnonOsa/Shared"
import { ColorType } from "theme"
import { ShareType, TutkinnonOsaType } from "../models/helpers/ShareTypes"

interface ContainerProps {
  accentColor?: ColorType
  width: string
}
const Container = styled("div")<ContainerProps>`
  display: flex;
  flex: 1;
  max-width: ${props => `calc(${props.width} - 15px)`};
  width: unset;
  border-top-style: solid;
  border-top-width: 4px;
  border-top-color: ${props =>
    !!props.accentColor ? props.theme.colors[props.accentColor] : "#979797"};
  box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.4);
  margin-left: 20px;
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
  flex-direction: column;
  align-items: start;
`

const Title = styled("h2")`
  flex: 1;
  color: #000;
  display: block;
  margin: 10px 20px;
  ${props => props.theme.typography.heading3}
`
export interface KoulutuksenOsaProps {
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
  opetusJaOhjausMaara?: number
  /** Color of additional info container */
  fadedColor?: string
  /**
   * KoodiURI for this study
   */
  koodiUri?: string
  moduleId?: string
  hoksEid?: string
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
  ajanjakso?: string
  laajuus?: string
}

export interface KoulutuksenOsaState {
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
export class KoulutuksenOsa extends React.Component<
  KoulutuksenOsaProps,
  KoulutuksenOsaState
> {
  static contextType = AppContext
  declare context: React.ContextType<typeof AppContext>

  state: KoulutuksenOsaState = {
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
    nextProps: KoulutuksenOsaProps,
    prevState: KoulutuksenOsaState
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

  render() {
    const { accentColor, title, width = "25%", ajanjakso, laajuus } = this.props

    return (
      <Container accentColor={accentColor} width={width}>
        <InnerContainer>
          <TitleContainer>
            <Title data-testid="Title">{title}</Title>
          </TitleContainer>
          <SubTitleContainer>
            <OneRowTable
              th={
                <FormattedMessage
                  id="koulutuksenOsa.ajanjakso"
                  defaultMessage="Ajanjakso"
                />
              }
            >
              {ajanjakso}
            </OneRowTable>
            <OneRowTable
              th={
                <FormattedMessage
                  id="opiskelusuunnitelma.laajuusTitle"
                  defaultMessage="Laajuus"
                />
              }
            >
              {laajuus} viikkoa
            </OneRowTable>
            <OneRowTable
              th={
                <FormattedMessage
                  id="koulutuksenOsa.ajanjakso"
                  defaultMessage="Ajanjakso"
                />
              }
            >
              {ajanjakso}
            </OneRowTable>
            <OneRowTable
              th={
                <FormattedMessage
                  id="koulutuksenOsa.kuvaus"
                  defaultMessage="Kuvaus"
                />
              }
            >
              linkki
            </OneRowTable>
          </SubTitleContainer>
        </InnerContainer>
      </Container>
    )
  }
}
