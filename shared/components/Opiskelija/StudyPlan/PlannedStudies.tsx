import React from "react"
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

export interface PlannedStudiesProps {
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
  suunnitellutOpinnot: IHankittavaTutkinnonOsa[]
  elements?: {
    heading?: React.ReactNode
    goals?: React.ReactNode
    essentialFactor?: React.ReactNode
  }
  competencePointsTitle: string
}

export class PlannedStudies extends React.Component<PlannedStudiesProps> {
  render() {
    const {
      accordionIsOpen,
      share,
      hasActiveShare,
      toggleAccordion,
      suunnitellutOpinnot,
      elements = {},
      competencePointsTitle
    } = this.props

    return (
      <Accordion
        id="suunnitelma.suunnitellut"
        open={accordionIsOpen || hasActiveShare}
        onToggle={toggleAccordion("suunnitelmat", "suunnitellut")}
        title={
          <AccordionTitle>
            <FormattedMessage
              id="opiskelusuunnitelma.suunnitellutOpintoniTitle"
              defaultMessage="Suunnitellut opintoni ({amount})"
              values={{ amount: suunnitellutOpinnot.length }}
            />
          </AccordionTitle>
        }
        inline={true}
        childContainer={false}
      >
        <StudiesContainer>
          {suunnitellutOpinnot.map((study, i) => {
            const renderExtraItem = (i + 1) % 4 === 0
            return (
              <React.Fragment key={`${study.id}_${i}`}>
                <StudyInfo
                  accentColor={theme.colors.planned}
                  competenceRequirements={study.osaamisvaatimukset}
                  demonstrations={study.osaamisenOsoittaminen}
                  extraContent={
                    study.olennainenSeikka ? elements.essentialFactor : null
                  }
                  fadedColor="#FDF1E6"
                  koodiUri={study.tutkinnonOsaKoodiUri}
                  learningPeriods={study.osaamisenHankkimistavat}
                  share={share}
                  title={study.opintoOtsikko(competencePointsTitle)}
                  objectives={study.tavoitteetJaSisallot}
                  koulutuksenJarjestaja={study.koulutuksenJarjestaja}
                />
                {renderExtraItem && <EmptyItem />}
              </React.Fragment>
            )
          })}
          {!suunnitellutOpinnot.length && (
            <div>
              <FormattedMessage
                id="opiskelusuunnitelma.eiSuunniteltujaOpintojaTitle"
                defaultMessage="Ei suunniteltuja opintoja"
              />
              .
            </div>
          )}
        </StudiesContainer>
      </Accordion>
    )
  }
}
