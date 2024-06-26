import { Container, PaddedContent } from "components/Container"
import { Heading } from "components/Heading"
import { NavigationContainer } from "components/NavigationContainer"
import { Suunnitelma } from "components/Opiskelija/Suunnitelma"
import { BackgroundContainer } from "components/SectionContainer"
import { observer } from "mobx-react"
import React from "react"
import { FormattedMessage } from "react-intl"
import { IRootStore } from "stores/RootStore"

interface ValitseHOKSProps {
  suunnitelmat: IRootStore["hoks"]["suunnitelmat"]
}

export const ValitseHOKS = observer((props: ValitseHOKSProps) => {
  const { suunnitelmat } = props

  return (
    <React.Fragment>
      <NavigationContainer>
        <Container>
          <PaddedContent>
            <Heading>
              <FormattedMessage
                id="valinta.title"
                defaultMessage="Ammattillisten opintojen henkilökohtaistaminen"
              />
            </Heading>
          </PaddedContent>
        </Container>
      </NavigationContainer>

      <BackgroundContainer>
        <Container>
          <PaddedContent>
            <Heading>
              <FormattedMessage
                id="valinta.voimassaOlevatSuunnitelmasiTitle"
                defaultMessage="Voimassa olevat suunnitelmasi"
              />
            </Heading>

            {suunnitelmat.map((suunnitelma, i) => (
              <Suunnitelma
                hoksPath="/ehoks/suunnittelu/"
                suunnitelma={suunnitelma}
                key={i}
              />
            ))}
          </PaddedContent>
        </Container>
      </BackgroundContainer>
    </React.Fragment>
  )
})
