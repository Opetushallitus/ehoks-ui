import React from "react"
import { ActiveAccordions, StudyPartSubAccordions } from "./StudyPlanHelpers"
import { IHankittavaTutkinnonOsa } from "../../../models/helpers/TutkinnonOsa"
import { AccordionTitle } from "../../AccordionTitle"
import { FormattedMessage } from "react-intl"
import { StudiesContainer } from "../../StudiesContainer"
import { TutkinnonOsa } from "../../TutkinnonOsa"
import { KoulutuksenOsa } from "../../KoulutuksenOsa"
import { EmptyItem } from "../../EmptyItem"
import { Accordion } from "../../Accordion"
import { ShareType, TutkinnonOsaType } from "../../../models/helpers/ShareTypes"

export interface CompletedStudiesProps {
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
      competencePointsTitle,
      hoksEid
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
            const isKoulutuksenOsa =
              study.tyyppi === TutkinnonOsaType.HankittavaKoulutuksenOsa
            if (!isKoulutuksenOsa) {
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
                    opetusJaOhjausMaara={study.opetusJaOhjausMaara}
                    fadedColor="#ECF6ED"
                    koodiUri={study.tutkinnonOsaKoodiUri}
                    moduleId={study.moduleId}
                    hoksEid={hoksEid}
                    tutkinnonOsaTyyppi={study.tutkinnonOsaTyyppi}
                    tutkinnonOsaModuleId={study.tutkinnonOsaModuleId}
                    osaamisenHankkimistavat={study.osaamisenHankkimistavat}
                    share={share}
                    title={study.opintoOtsikko(competencePointsTitle)}
                    objectives={study.tavoitteetJaSisallot}
                    koulutuksenJarjestaja={study.koulutuksenJarjestaja}
                  />
                  {renderExtraItem && <EmptyItem />}
                </React.Fragment>
              )
            } else {
              return (
                <React.Fragment key={`${study.id}_${i}`}>
                  <KoulutuksenOsa
                    accentColor="ready"
                    title={study.opintoOtsikko(competencePointsTitle)}
                    alku={study.alku}
                    loppu={study.loppu}
                    laajuus={study.laajuus}
                    viiteId={study.tutkinnonOsa?.koulutuksenOsaViiteId}
                  />
                  {renderExtraItem && <EmptyItem />}
                </React.Fragment>
              )
            }
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
