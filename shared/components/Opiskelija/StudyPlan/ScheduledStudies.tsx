import { AccordionTitle } from "../../AccordionTitle"
import { FormattedMessage } from "react-intl"
import { StudiesContainer } from "../../StudiesContainer"
import { TutkinnonOsa } from "../../TutkinnonOsa"
import { EmptyItem } from "../../EmptyItem"
import { Accordion } from "../../Accordion"
import { ActiveAccordions, StudyPartSubAccordions } from "./StudyPlanHelpers"
import { IHankittavaTutkinnonOsa } from "../../../models/helpers/TutkinnonOsa"
import React from "react"
import { ShareType, TutkinnonOsaType } from "../../../models/helpers/ShareTypes"

export interface ScheduledStudiesProps {
  accordionIsOpen: boolean
  share: {
    type?: ShareType
    moduleId?: string
    tutkinnonOsaTyyppi?: TutkinnonOsaType
    tutkinnonOsaModuleId?: string
    hoksEid?: string
  }
  hoksEid?: string
  hasActiveShare: boolean
  toggleAccordion: (
    accordion: ActiveAccordions,
    subAccordion?: StudyPartSubAccordions
  ) => () => void
  aikataulutetutOpinnot: IHankittavaTutkinnonOsa[]
  elements?: {
    heading?: React.ReactNode
    goals?: React.ReactNode
    essentialFactor?: React.ReactNode
  }
  competencePointsTitle: string
}

export class ScheduledStudies extends React.Component<ScheduledStudiesProps> {
  render() {
    const {
      accordionIsOpen,
      share,
      hoksEid,
      hasActiveShare,
      toggleAccordion,
      aikataulutetutOpinnot,
      elements = {},
      competencePointsTitle
    } = this.props

    return (
      <Accordion
        id="suunnitelma.aikataulutetut"
        open={accordionIsOpen || hasActiveShare}
        onToggle={toggleAccordion("suunnitelmat", "aikataulutetut")}
        title={
          <AccordionTitle>
            <FormattedMessage
              id="opiskelusuunnitelma.aikataulutetutOpintoniTitle"
              defaultMessage="Aikataulutetut opintoni ({amount})"
              values={{ amount: aikataulutetutOpinnot.length }}
            />
          </AccordionTitle>
        }
        inline={true}
        childContainer={false}
      >
        <StudiesContainer>
          {aikataulutetutOpinnot.map((study, i) => {
            const renderExtraItem = (i + 1) % 4 === 0
            return (
              <React.Fragment key={`${study.id}_${i}`}>
                <TutkinnonOsa
                  accentColor="scheduled"
                  competenceRequirements={study.osaamisvaatimukset}
                  osaamisenOsoittamiset={study.osaamisenOsoittaminen}
                  olennainenSeikka={
                    study.olennainenSeikka
                      ? elements.essentialFactor
                      : undefined
                  }
                  fadedColor="#FDF6E9"
                  koodiUri={study.tutkinnonOsaKoodiUri}
                  moduleId={study.moduleId}
                  tutkinnonOsaTyyppi={study.tutkinnonOsaTyyppi}
                  osaamisenHankkimistavat={study.osaamisenHankkimistavat}
                  share={share}
                  hoksEid={hoksEid}
                  title={study.opintoOtsikko(competencePointsTitle)}
                  objectives={study.tavoitteetJaSisallot}
                  koulutuksenJarjestaja={study.koulutuksenJarjestaja}
                />
                {renderExtraItem && <EmptyItem />}
              </React.Fragment>
            )
          })}
          {!aikataulutetutOpinnot.length && (
            <div>
              <FormattedMessage
                id="opiskelusuunnitelma.eiAikataulutettujaOpintojaTitle"
                defaultMessage="Ei aikataulutettuja opintoja"
              />
              .
            </div>
          )}
        </StudiesContainer>
      </Accordion>
    )
  }
}
