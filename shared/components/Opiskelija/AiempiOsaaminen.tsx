import { ContentArea } from "components/ContentArea"
import { EmptyItem } from "components/EmptyItem"
import { HeadingContainer, HelpHeading } from "components/Heading"
import { HelpPopup } from "components/HelpPopup"
import { StudiesContainer } from "components/StudiesContainer"
import { TutkinnonOsa } from "components/TutkinnonOsa"
import React from "react"
import { useIntl, FormattedMessage } from "react-intl"
import styled from "styled"
import { IAiemminHankittuTutkinnonOsa } from "../../models/helpers/TutkinnonOsa"
import { observer } from "mobx-react"

const Container = styled(StudiesContainer)`
  margin-top: 0;
`

export interface AiempiOsaaminenProps {
  children?: React.ReactChildren
  heading?: React.ReactNode
  aiemminHankitutTutkinnonOsat: IAiemminHankittuTutkinnonOsa[]
  essentialFactor?: React.ReactNode
}

export const AiempiOsaaminen = observer((props: AiempiOsaaminenProps) => {
  const intl = useIntl()

  const {
    aiemminHankitutTutkinnonOsat,
    heading = (
      <FormattedMessage
        id="aiempiOsaaminen.title"
        defaultMessage="Aiempi osaamiseni"
      />
    ),
    essentialFactor
  } = props
  const competencePointsTitle = intl.formatMessage({
    id: "opiskelusuunnitelma.osaamispisteLyhenne"
  })

  return (
    <React.Fragment>
      <HeadingContainer>
        <HelpHeading>{heading}</HelpHeading>
        <HelpPopup
          helpContent={
            <FormattedMessage
              id="aiempiOsaaminen.titleHelpLabel"
              defaultMessage="Tietoa aiemmasta osaamisesta"
            />
          }
        />
      </HeadingContainer>

      <ContentArea>
        <Container>
          {aiemminHankitutTutkinnonOsat.map((study, i) => {
            const renderExtraItem = (i + 1) % 4 === 0
            return (
              <React.Fragment key={i}>
                <TutkinnonOsa
                  accentColor="midGreen"
                  fadedColor="#ECF6ED"
                  title={study.opintoOtsikko(competencePointsTitle)}
                  osaamisenOsoittamiset={study.tarkentavatTiedotNaytto}
                  moduleId={study.moduleId}
                  tutkinnonOsaTyyppi={study.tutkinnonOsaTyyppi}
                  todentamisenProsessi={study.todentamisenProsessi}
                  objectives={study.tavoitteetJaSisallot}
                  koulutuksenJarjestaja={study.koulutuksenJarjestaja}
                  tarkentavatTiedotOsaamisenArvioija={
                    study.tarkentavatTiedotOsaamisenArvioija
                  }
                  olennainenSeikka={
                    study.olennainenSeikka ? essentialFactor : undefined
                  }
                />
                {renderExtraItem && <EmptyItem />}
              </React.Fragment>
            )
          })}
          {!aiemminHankitutTutkinnonOsat.length && (
            <div>
              <FormattedMessage
                id="aiempiOsaaminen.eiAiempaaOsaamista"
                defaultMessage="Ei aiempia opintoja"
              />
              .
            </div>
          )}
        </Container>
      </ContentArea>
    </React.Fragment>
  )
})
