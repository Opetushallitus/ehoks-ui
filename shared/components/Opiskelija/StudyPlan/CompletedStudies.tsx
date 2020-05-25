import React from "react"
import { ActiveAccordions, StudyPartSubAccordions } from "./StudyPlanHelpers"
import { IHankittavaTutkinnonOsa } from "../../../models/helpers/TutkinnonOsa"
import { AccordionTitle } from "../../AccordionTitle"
import { FormattedMessage } from "react-intl"
import { StudiesContainer } from "../../StudiesContainer"
import { TutkinnonOsa } from "../../TutkinnonOsa"
import { EmptyItem } from "../../EmptyItem"
import { Accordion } from "../../Accordion"
import { ShareType, TutkinnonOsaType } from "../../../models/helpers/ShareTypes"

export interface CompletedStudiesProps {
  accordionIsOpen: boolean
  share: {
    type?: ShareType
    moduleId?: string
    tutkinnonOsaTyyppi?: TutkinnonOsaType
    tutkinnonOsaId?: string
  }
  hasActiveShare: boolean
  toggleAccordion: (
    accordion: ActiveAccordions,
    subAccordion?: StudyPartSubAccordions
  ) => () => void
  valmiitOpinnot: IHankittavaTutkinnonOsa[]
  elements?: {
    heading?: React.ReactNode
    goals?: React.ReactNode
    essentialFactor?: React.ReactNode
  }
  competencePointsTitle: string
}

export class CompletedStudies extends React.Component<CompletedStudiesProps> {
  render() {
    const {
      accordionIsOpen,
      share,
      hasActiveShare,
      toggleAccordion,
      valmiitOpinnot,
      elements = {},
      competencePointsTitle
    } = this.props

    return (
      <Accordion
        id="suunnitelma.valmiit"
        open={accordionIsOpen || hasActiveShare}
        onToggle={toggleAccordion("suunnitelmat", "valmiit")}
        title={
          <AccordionTitle>
            <FormattedMessage
              id="opiskelusuunnitelma.valmiitOpintoniTitle"
              defaultMessage="Valmiit opintoni ({amount})"
              values={{ amount: valmiitOpinnot.length }}
            />
          </AccordionTitle>
        }
        inline={true}
        childContainer={false}
      >
        <StudiesContainer>
          {valmiitOpinnot.map((study, i) => {
            const renderExtraItem = (i + 1) % 4 === 0
            return (
              <React.Fragment key={`${study.id}_${i}`}>
                <TutkinnonOsa
                  accentColor="ready"
                  competenceRequirements={study.osaamisvaatimukset}
                  osaamisenOsoittamiset={study.osaamisenOsoittaminen}
                  olennainenSeikka={
                    study.olennainenSeikka
                      ? elements.essentialFactor
                      : undefined
                  }
                  fadedColor="#ECF6ED"
                  koodiUri={study.tutkinnonOsaKoodiUri}
                  moduleId={study.moduleId}
                  tutkinnonOsaTyyppi={study.tutkinnonOsaTyyppi}
                  tutkinnonOsaId={study.tutkinnonOsaId}
                  osaamisenHankkimistavat={study.osaamisenHankkimistavat}
                  share={share}
                  title={study.opintoOtsikko(competencePointsTitle)}
                  objectives={study.tavoitteetJaSisallot}
                  koulutuksenJarjestaja={study.koulutuksenJarjestaja}
                />
                {renderExtraItem && <EmptyItem />}
              </React.Fragment>
            )
          })}
          {!valmiitOpinnot.length && (
            <div>
              <FormattedMessage
                id="opiskelusuunnitelma.eiValmiitaOpintojaTitle"
                defaultMessage="Ei valmiita opintoja"
              />
              .
            </div>
          )}
        </StudiesContainer>
      </Accordion>
    )
  }
}
