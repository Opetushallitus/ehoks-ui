import { AccordionTitle } from "../../AccordionTitle"
import { FormattedMessage } from "react-intl"
import { StudiesContainer } from "../../StudiesContainer"
import { StudyInfo } from "../../StudyInfo"
import { EmptyItem } from "../../EmptyItem"
import { Accordion } from "../../Accordion"
import { ShareType } from "../../../stores/NotificationStore"
import { ActiveAccordions, StudyPartSubAccordions } from "./StudyPlanHelpers"
import { IHankittavaTutkinnonOsa } from "../../../models/helpers/TutkinnonOsa"
import { theme } from "../../../theme"
import React from "react"

export interface ScheduledStudiesProps {
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
                <StudyInfo
                  accentColor={theme.colors.scheduled}
                  competenceRequirements={study.osaamisvaatimukset}
                  demonstrations={study.osaamisenOsoittaminen}
                  extraContent={
                    study.olennainenSeikka ? elements.essentialFactor : null
                  }
                  fadedColor="#FDF6E9"
                  koodiUri={study.tutkinnonOsaKoodiUri}
                  learningPeriods={study.osaamisenHankkimistavat}
                  share={share}
                  title={study.opintoOtsikko(competencePointsTitle)}
                  objectives={study.tavoitteetJaSisallot}
                  educationOrganizer={study.koulutuksenJarjestaja}
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
