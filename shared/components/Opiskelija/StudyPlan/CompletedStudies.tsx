import React from "react"
import { ShareType } from "../../../stores/NotificationStore"
import { ActiveAccordions, StudyPartSubAccordions } from "./StudyPlanHelpers"
import { HankittavaTutkinnonOsa } from "../../../models/helpers/TutkinnonOsa"
import { AccordionTitle } from "../../AccordionTitle"
import { FormattedMessage } from "react-intl"
import { StudiesContainer } from "../../StudiesContainer"
import { StudyInfo } from "../../StudyInfo"
import { EmptyItem } from "../../EmptyItem"
import { Accordion } from "../../Accordion"
import { theme } from "../../../theme"

export interface CompletedStudiesProps {
  accordionIsOpen: boolean
  share: {
    koodiUri: string
    type: ShareType | ""
  }
  hasActiveShare: boolean
  toggleAccordion: (
    accordion: ActiveAccordions,
    subAccordion?: StudyPartSubAccordions
  ) => () => void
  valmiitOpinnot: HankittavaTutkinnonOsa[]
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
                <StudyInfo
                  accentColor={theme.colors.ready}
                  competenceRequirements={study.osaamisvaatimukset}
                  demonstrations={study.osaamisenOsoittaminen}
                  extraContent={
                    study.olennainenSeikka ? elements.essentialFactor : null
                  }
                  fadedColor="#ECF6ED"
                  koodiUri={study.tutkinnonOsaKoodiUri}
                  learningPeriods={study.osaamisenHankkimistavat}
                  share={share}
                  title={study.opintoOtsikko(competencePointsTitle)}
                  objectives={study.tavoitteetJaSisallot}
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
