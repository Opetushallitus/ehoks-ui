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
import { ColorType } from "theme"
import { MdEventNote } from "react-icons/md"
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
  margin
`

const TitleContainer = styled("div")`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const ContentContainer = styled("div")`
  display: flex;
  margin: 0px 0px 15px 20px;
`

const Title = styled("h2")`
  flex: 1;
  color: #000;
  display: block;
  margin: 10px 20px;
  ${props => props.theme.typography.heading3}
`
const DetailsContainer = styled("div")`
  flex: 1;
  flex-direction: column;
  margin: 0px 0px 15px 20px;
`

const Detail = styled("div")`
  font-weight: 600;
  color: #636769;
  line-height: small;
`

const Icon = styled("div")`
  margin-right: 10px;
  padding-top: 3px;
  color: #000;
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
  laajuus?: number
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
          <ContentContainer>
            <Icon>
              <MdEventNote size="24" fill="#636769" />
            </Icon>
            <DetailsContainer>
              <div style={{ display: "inline-block", width: "auto" }}>
                <Detail>{ajanjakso}</Detail>
              </div>
              <Detail>
                <FormattedMessage
                  id="opiskelusuunnitelma.laajuusTitle"
                  defaultMessage="Laajuus"
                />
                {":"}&nbsp; {laajuus}
                <FormattedMessage
                  id="opiskelusuunnitelma.viikkoa"
                  defaultMessage="viikkoa"
                />
              </Detail>
              <Detail>
                {" "}
                <a
                  href="https://eperusteet.opintopolku.fi/#/fi/tutkintoonvalmentava/7534950/linkkisivu/7535290"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FormattedMessage
                    id="opiskelusuunnitelma.ePerusteLinkki"
                    defaultMessage="Linkki ePerusteisiin"
                  />
                </a>
              </Detail>
            </DetailsContainer>
          </ContentContainer>
        </InnerContainer>
      </Container>
    )
  }
}
