import { RouteComponentProps } from "@reach/router"
import { Container, PaddedContent } from "components/Container"
import { Heading } from "components/Heading"
import { NavigationContainer } from "components/NavigationContainer"
import { Suunnitelma } from "components/Opiskelija/Suunnitelma"
import { BackgroundContainer } from "components/SectionContainer"
import partition from "lodash.partition"
import { observer } from "mobx-react"
import { IHOKS } from "models/HOKS"
import React from "react"
import { FormattedMessage } from "react-intl"

interface ValitseHOKSProps {
  nimi: string
  oppijaId: string
  suunnitelmat: IHOKS[]
}

@observer
export class ValitseHOKS extends React.Component<
  ValitseHOKSProps & RouteComponentProps
> {
  render() {
    const { nimi, suunnitelmat, oppijaId } = this.props
    const [paattyneet, voimassaOlevat] = partition(
      suunnitelmat,
      suunnitelma => !!suunnitelma.paattymispaiva
    )

    return (
      <React.Fragment>
        <NavigationContainer>
          <Container>
            <PaddedContent>
              <Heading>{nimi}</Heading>
            </PaddedContent>
          </Container>
        </NavigationContainer>

        <BackgroundContainer>
          <Container>
            {voimassaOlevat.length > 0 && (
              <PaddedContent>
                <Heading>
                  <FormattedMessage
                    id="koulutuksenJarjestaja.opiskelija.voimassaOlevatSuunnitelmatTitle"
                    defaultMessage="Voimassa olevat suunnitelmat"
                  />
                </Heading>

                {voimassaOlevat.map((suunnitelma, i) => {
                  return (
                    <Suunnitelma
                      hoksPath={`/ehoks-ui/koulutuksenjarjestaja/${oppijaId}/`}
                      suunnitelma={suunnitelma}
                      key={i}
                    />
                  )
                })}
              </PaddedContent>
            )}
            {paattyneet.length > 0 && (
              <PaddedContent>
                <Heading>
                  <FormattedMessage
                    id="koulutuksenJarjestaja.opiskelija.paattyneidenOpintojenSuunnitelmatTitle"
                    defaultMessage="Päättyneiden opintojen suunnitelmat"
                  />
                </Heading>

                {paattyneet.map((suunnitelma, i) => {
                  return (
                    <Suunnitelma
                      hoksPath={`/ehoks-ui/koulutuksenjarjestaja/${oppijaId}/`}
                      suunnitelma={suunnitelma}
                      key={i}
                    />
                  )
                })}
              </PaddedContent>
            )}
          </Container>
        </BackgroundContainer>
      </React.Fragment>
    )
  }
}
