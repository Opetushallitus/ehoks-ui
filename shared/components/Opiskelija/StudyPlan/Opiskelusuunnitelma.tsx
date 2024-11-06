import { Accordion } from "components/Accordion"
import { AccordionTitle } from "components/AccordionTitle"
import { Heading } from "components/Heading"
import { InfoTable } from "components/InfoTable"
import { observer } from "mobx-react"
import { IHOKS } from "models/HOKS"
import React, { useState, useEffect } from "react"
import { useIntl, FormattedMessage } from "react-intl"
import styled from "styled"
import { HelpPopup } from "components/HelpPopup"
import find from "lodash.find"
import { parseShareParams } from "utils/shareParams"
import { FormattedDate } from "components/FormattedDate"
import {
  ActiveAccordions,
  OpiskelusuunnitelmaState,
  StudyPartSubAccordions,
  StudyPartType
} from "./StudyPlanHelpers"
import { PlannedStudies } from "./PlannedStudies"
import { ScheduledStudies } from "./ScheduledStudies"
import { CompletedStudies } from "./CompletedStudies"
import { ShareType, TutkinnonOsaType } from "../../../models/helpers/ShareTypes"
import { DegreeProgress } from "./DegreeProgress"
import { useLocation } from "react-router"

const EssentialFactorContainer = styled("div")`
  margin: 10px 20px 20px 20px;
`

const HelpButton = styled(HelpPopup)`
  margin: 0 0 0 20px;
`

export interface OpiskelusuunnitelmaProps {
  children?: React.ReactChildren
  plan: IHOKS
  elements?: {
    heading?: React.ReactNode
    goals?: React.ReactNode
    essentialFactor?: React.ReactNode
  }
}

const OpiskeluvalmiuksiaTukevatOpinnot = ({ plan }: { plan: IHOKS }) => (
  <InfoTable>
    <tbody>
      <tr>
        <th>
          <FormattedMessage
            id="opiskelusuunnitelma.opintoTitle"
            defaultMessage="Opinto"
          />
        </th>
        <th>
          <FormattedMessage
            id="opiskelusuunnitelma.kuvausTitle"
            defaultMessage="Kuvaus"
          />
        </th>
        <th>
          <FormattedMessage
            id="opiskelusuunnitelma.aloituspaivaTitle"
            defaultMessage="Aloituspäivä"
          />
        </th>
        <th>
          <FormattedMessage
            id="opiskelusuunnitelma.lopetuspaivaTitle"
            defaultMessage="Lopetuspäivä"
          />
        </th>
      </tr>
      {plan.opiskeluvalmiuksiaTukevatOpinnot.map((study, i) => (
        <tr key={`study_${i}`}>
          <td>{study.nimi}</td>
          <td>{study.kuvaus}</td>
          <td>
            <FormattedDate date={study.alku} />
          </td>
          <td>
            <FormattedDate date={study.loppu} />
          </td>
        </tr>
      ))}
    </tbody>
  </InfoTable>
)

export const Opiskelusuunnitelma = observer(
  (props: OpiskelusuunnitelmaProps) => {
    const [state, setState] = useState<OpiskelusuunnitelmaState>({
      activeAccordions: {
        suunnitelma: false,
        suunnitelmat: {
          aikataulutetut: false,
          suunnitellut: false,
          valmiit: false
        },
        tavoitteet: false,
        tukevatOpinnot: false
      },
      share: {
        type: undefined,
        moduleId: undefined,
        tutkinnonOsaTyyppi: undefined,
        tutkinnonOsaModuleId: undefined,
        hoksEid: undefined
      }
    })
    const location = useLocation()

    useEffect(() => {
      const { share } = parseShareParams(location.search)
      if (share.type && share.tutkinnonOsaTyyppi) {
        setState((s) => ({
          ...s,
          share: {
            type: share.type,
            moduleId: share.moduleId,
            tutkinnonOsaTyyppi: share.tutkinnonOsaTyyppi,
            tutkinnonOsaModuleId: share.tutkinnonOsaModuleId,
            hoksEid: share.hoksEid
          }
        }))
        setInitialExpanded(share)
      }
    }, [])

    useEffect(() => {
      // TODO: set proper share state when opening another dialog
      // previous dialog should close and new dialog should open
      const { share } = parseShareParams(location.search)
      if (shareHasChanged(share)) {
        setState((s) => ({
          ...s,
          share: {
            type: share.type,
            moduleId: share.moduleId,
            tutkinnonOsaTyyppi: share.tutkinnonOsaTyyppi,
            tutkinnonOsaModuleId: share.tutkinnonOsaModuleId,
            hoksEid: share.hoksEid
          }
        }))
      }
    }, [location.search])

    const shareHasChanged = (share: {
      type?: ShareType
      moduleId: string | ""
      tutkinnonOsaTyyppi?: TutkinnonOsaType
      tutkinnonOsaModuleId: string | ""
      hoksEid: string | ""
    }) =>
      share.type !== state.share.type ||
      share.tutkinnonOsaTyyppi !== state.share.tutkinnonOsaTyyppi

    const isShareActive = () => {
      const { share } = state
      return !!share.type && !!share.moduleId
    }

    const hasActiveShare = (type: StudyPartType) => {
      const { aikataulutetutOpinnot, suunnitellutOpinnot, valmiitOpinnot } =
        props.plan
      const { share } = state
      const studies = {
        aikataulutetut: aikataulutetutOpinnot,
        suunnitellut: suunnitellutOpinnot,
        valmiit: valmiitOpinnot
      }
      return !!find(studies[type], (s) =>
        s.hasNayttoOrHarjoittelujakso(share.type, share.moduleId)
      )
    }

    const setInitialExpanded = (share: {
      type?: ShareType
      moduleId: string | ""
    }) => {
      setState({
        ...state,
        activeAccordions: {
          ...state.activeAccordions,
          suunnitelma: Boolean(share),
          suunnitelmat: {
            aikataulutetut: hasActiveShare("aikataulutetut"),
            suunnitellut: hasActiveShare("suunnitellut"),
            valmiit: hasActiveShare("valmiit")
          }
        }
      })
    }

    const showPlanSubAccordion =
      (subAccordion: StudyPartSubAccordions) => () => {
        setState({
          ...state,
          activeAccordions: {
            ...state.activeAccordions,
            suunnitelma: true,
            suunnitelmat: {
              ...state.activeAccordions.suunnitelmat,
              [subAccordion]: true
            }
          }
        })
        window.location.hash = `suunnitelma.${subAccordion}`
      }

    const toggleAccordion =
      (accordion: ActiveAccordions, subAccordion?: StudyPartSubAccordions) =>
      () => {
        setState({
          ...state,
          activeAccordions: {
            ...state.activeAccordions,
            [accordion]: !subAccordion
              ? !state.activeAccordions[accordion]
              : toggleSubAccordion(
                  state.activeAccordions[accordion],
                  subAccordion
                )
          }
        })
      }

    const toggleSubAccordion = (
      accordionState: boolean | { [subAccordionName: string]: boolean },
      subAccordion: string
    ) => {
      // no-op if accordion with sub-accordion has been accidentally initalized as boolean
      if (typeof accordionState === "boolean") {
        return accordionState
      } else {
        return {
          ...accordionState,
          [subAccordion]: !accordionState[subAccordion]
        }
      }
    }

    const intl = useIntl()
    const { activeAccordions, share } = state
    const { plan, elements: customElements = {} } = props
    const { suunnitellutOpinnot, aikataulutetutOpinnot, valmiitOpinnot } = plan
    const competencePointsTitle = intl.formatMessage({
      id: "opiskelusuunnitelma.osaamispisteLyhenne"
    })
    const elements = {
      heading: customElements.heading || (
        <FormattedMessage
          id="opiskelusuunnitelma.title"
          defaultMessage="Osaamisen hankkiminen"
        />
      ),
      goals: (
        <AccordionTitle>
          {customElements.goals || (
            <FormattedMessage
              id="opiskelusuunnitelma.tavoitteetTitle"
              defaultMessage="Opintojen eteneminen"
            />
          )}
        </AccordionTitle>
      ),
      essentialFactor: customElements.essentialFactor || (
        <EssentialFactorContainer>
          <FormattedMessage
            id="opiskelusuunnitelma.olennainenSeikkaDescription"
            defaultMessage="Tämän tutkinnon osan toteutukseen liittyy olennaista tietoa, jonka sisällön voit tarkistaa oppilaitoksestasi."
          />
          <HelpButton
            helpContent={
              <FormattedMessage
                id="opiskelusuunnitelma.olennainenSeikkaHelpLabel"
                defaultMessage="Tietoa olennaisesta seikasta"
              />
            }
          />
        </EssentialFactorContainer>
      )
    }

    const totalStudiesLength =
      suunnitellutOpinnot.length +
      aikataulutetutOpinnot.length +
      valmiitOpinnot.length

    return (
      <React.Fragment>
        <Heading>{elements.heading}</Heading>

        <Accordion
          id="tavoitteet"
          open={activeAccordions.tavoitteet}
          title={elements.goals}
          onToggle={toggleAccordion("tavoitteet")}
          helpIcon={true}
          helpContent={
            <FormattedMessage
              id="opiskelusuunnitelma.tavoitteetHelpLabel"
              defaultMessage="Tietoa tavoitteista ja opintojen etenemisestä"
            />
          }
        >
          <DegreeProgress
            totalStudiesLength={totalStudiesLength}
            suunnitellutOpinnot={suunnitellutOpinnot}
            aikataulutetutOpinnot={aikataulutetutOpinnot}
            valmiitOpinnot={valmiitOpinnot}
            showSuunnitellut={showPlanSubAccordion("suunnitellut")}
            showAikataulutetut={showPlanSubAccordion("aikataulutetut")}
            showValmiit={showPlanSubAccordion("valmiit")}
            competencePointsTitle={competencePointsTitle}
          />
        </Accordion>

        <Accordion
          id="suunnitelma"
          open={activeAccordions.suunnitelma || isShareActive()}
          title={
            <AccordionTitle>
              <FormattedMessage
                id="opiskelusuunnitelma.suunnitelmaTutkinnonosittainTitle"
                defaultMessage="Suunnitelma tutkinnonosittain"
              />
            </AccordionTitle>
          }
          onToggle={toggleAccordion("suunnitelma")}
          helpIcon={true}
          helpContent={
            <FormattedMessage
              id="opiskelusuunnitelma.suunnitelmaHelpLabel"
              defaultMessage="Tietoa tutkinnonosista"
            />
          }
          childContainer={false}
        >
          <PlannedStudies
            accordionIsOpen={activeAccordions.suunnitelmat.suunnitellut}
            competencePointsTitle={competencePointsTitle}
            hasActiveShare={hasActiveShare("suunnitellut")}
            share={share}
            hoksEid={plan.eid}
            suunnitellutOpinnot={suunnitellutOpinnot}
            elements={elements}
            toggleAccordion={toggleAccordion}
          />
          <ScheduledStudies
            accordionIsOpen={activeAccordions.suunnitelmat.aikataulutetut}
            share={share}
            hoksEid={plan.eid}
            hasActiveShare={hasActiveShare("aikataulutetut")}
            toggleAccordion={toggleAccordion}
            aikataulutetutOpinnot={aikataulutetutOpinnot}
            elements={elements}
            competencePointsTitle={competencePointsTitle}
          />
          <CompletedStudies
            accordionIsOpen={activeAccordions.suunnitelmat.valmiit}
            share={share}
            hoksEid={plan.eid}
            hasActiveShare={hasActiveShare("valmiit")}
            toggleAccordion={toggleAccordion}
            valmiitOpinnot={valmiitOpinnot}
            elements={elements}
            competencePointsTitle={competencePointsTitle}
          />
        </Accordion>

        <Accordion
          id="tukevatOpinnot"
          open={activeAccordions.tukevatOpinnot}
          title={
            <AccordionTitle>
              <FormattedMessage
                id="opiskelusuunnitelma.opiskeluvalmiuksiaTukevatOpinnotTitle"
                defaultMessage="Opiskeluvalmiuksia tukevat opinnot"
              />
            </AccordionTitle>
          }
          onToggle={toggleAccordion("tukevatOpinnot")}
          helpIcon={true}
          helpContent={
            <FormattedMessage
              id="opiskelusuunnitelma.tukevatOpinnotHelpLabel"
              defaultMessage="Tietoa opiskeluvalmiuksia tukevista opinnoista"
            />
          }
        >
          <OpiskeluvalmiuksiaTukevatOpinnot plan={plan} />
        </Accordion>
      </React.Fragment>
    )
  }
)
