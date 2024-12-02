import React, { useState, useEffect } from "react"
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
import { FormattedMessage, FormattedNumber } from "react-intl"
import { ToggleableItems } from "./TutkinnonOsa/TutkinnonOsaHelpers"
import { Objectives } from "./TutkinnonOsa/Objectives"
import { Details } from "./TutkinnonOsa/Details"
import { OneRowTable } from "./TutkinnonOsa/Shared"
import { ColorType } from "theme"
import { ShareType, TutkinnonOsaType } from "../models/helpers/ShareTypes"
import { RequirementsAndDeviations } from "./TutkinnonOsa/RequirementsAndDeviations"

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
  vaatimuksistaTaiTavoitteistaPoikkeaminen?: string
}

export interface TutkinnonOsaState {
  expanded: {
    competences: boolean
    details: boolean
    objectives: boolean
    requirementsAndDeviations: boolean
  }
  expandedCompetences: number[]
}

/**
 * Shows information about single study
 */
export const TutkinnonOsa: React.FC<TutkinnonOsaProps> = ({
  share,
  moduleId,
  accentColor,
  competenceRequirements = [],
  osaamisenOsoittamiset = [],
  olennainenSeikka,
  opetusJaOhjausMaara,
  fadedColor,
  osaamisenHankkimistavat = [],
  koodiUri,
  hoksEid,
  tutkinnonOsaTyyppi,
  title,
  todentamisenProsessi,
  width = "25%",
  objectives,
  koulutuksenJarjestaja,
  tarkentavatTiedotOsaamisenArvioija,
  vaatimuksistaTaiTavoitteistaPoikkeaminen
}) => {
  const [state, setState] = useState<TutkinnonOsaState>({
    expanded: {
      competences: false,
      details: false,
      objectives: false,
      requirementsAndDeviations: false
    },
    expandedCompetences: []
  })
  useEffect(() => {
    if (typeof share !== "undefined" && moduleId === share.moduleId) {
      setState(s => ({
        ...s,
        expanded: {
          ...s.expanded,
          details: true
        }
      }))
    }
  }, [share, moduleId])

  const toggle = (name: ToggleableItems) => () => {
    if (name) {
      setState(s => ({
        ...s,
        expanded: { ...s.expanded, [name]: !s.expanded[name] }
      }))
    }
  }

  const expandCompetence = (index: number) => () => {
    setState(s => ({
      ...s,
      expandedCompetences:
        s.expandedCompetences.indexOf(index) > -1
          ? s.expandedCompetences.filter(i => i !== index)
          : [...s.expandedCompetences, index]
    }))
  }

  const expandAll = () => {
    setState(s => ({
      ...s,
      expandedCompetences: (competenceRequirements || []).map((_, i) => i)
    }))
  }

  const collapseAll = () => {
    setState(s => ({ ...s, expandedCompetences: [] }))
  }

  const koulutuksenJarjestajaShouldBeShown = () =>
    state.expanded.details ||
    state.expanded.competences ||
    state.expanded.objectives ||
    state.expanded.requirementsAndDeviations

  const hasOsaamisenHakkimistavat =
    osaamisenHankkimistavat && osaamisenHankkimistavat.length > 0
  const hasDetails =
    hasOsaamisenHakkimistavat ||
    osaamisenOsoittamiset.length > 0 ||
    todentamisenProsessi ||
    vaatimuksistaTaiTavoitteistaPoikkeaminen
  const hasActiveShare =
    typeof share !== "undefined" && moduleId === share.tutkinnonOsaModuleId
  const detailsExpanded = state.expanded.details || hasActiveShare
  return (
    <Container
      accentColor={accentColor}
      expanded={state.expanded.competences || detailsExpanded}
      width={width}
    >
      <InnerContainer>
        <TitleContainer>
          <Title data-testid="Title">{title}</Title>
        </TitleContainer>
        {koulutuksenJarjestajaShouldBeShown() && (
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
            {(!!opetusJaOhjausMaara || opetusJaOhjausMaara === 0) && (
              <OneRowTable
                th={
                  <FormattedMessage
                    id="tutkinnonOsa.opetusJaOhjausMaaraTitle"
                    defaultMessage="Opetus ja ohjaus"
                  />
                }
              >
                {opetusJaOhjausMaara !== 1 ? (
                  <FormattedMessage
                    id="tutkinnonOsa.opetusJaOhjausMaaraHours"
                    defaultMessage="{hours} tuntia"
                    values={{
                      hours: <FormattedNumber value={opetusJaOhjausMaara} />
                    }}
                  />
                ) : (
                  <FormattedMessage
                    id="tutkinnonOsa.opetusJaOhjausMaaraOneHour"
                    defaultMessage="1 tunti"
                  />
                )}
              </OneRowTable>
            )}
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
            hoksEid={hoksEid}
            moduleId={moduleId}
            tutkinnonOsaTyyppi={tutkinnonOsaTyyppi}
            toggle={toggle("details")}
            koulutuksenJarjestaja={koulutuksenJarjestaja}
            tarkentavatTiedotOsaamisenArvioija={
              tarkentavatTiedotOsaamisenArvioija
            }
          />
        )}
        <Competences
          collapseAll={collapseAll}
          competenceRequirements={competenceRequirements}
          expandAll={expandAll}
          expandCompetence={expandCompetence}
          expanded={state.expanded.competences}
          expandedCompetences={state.expandedCompetences}
          tutkinnonOsaTyyppi={tutkinnonOsaTyyppi}
          toggle={toggle("competences")}
        />
        {!!vaatimuksistaTaiTavoitteistaPoikkeaminen && (
          <RequirementsAndDeviations
            toggle={toggle("requirementsAndDeviations")}
            expanded={state.expanded.requirementsAndDeviations}
            requirements={[]}
            deviations={vaatimuksistaTaiTavoitteistaPoikkeaminen}
          />
        )}
        {objectives && (
          <Objectives
            expanded={state.expanded.objectives}
            toggle={toggle("objectives")}
            objectives={objectives}
          />
        )}
      </InnerContainer>
    </Container>
  )
}
