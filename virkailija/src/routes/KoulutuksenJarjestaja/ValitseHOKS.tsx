import { AppContext } from "components/AppContext"
import { Container, PaddedContent } from "components/Container"
import { Heading } from "components/Heading"
import { NavigationContainer } from "components/NavigationContainer"
import { Suunnitelma } from "components/Opiskelija/Suunnitelma"
import { BackgroundContainer } from "components/SectionContainer"
import partition from "lodash.partition"
import { observer } from "mobx-react"
import { HOKS, IHOKS } from "models/HOKS"
import React, { useContext } from "react"
import { FormattedMessage } from "react-intl"
import { ISessionStore } from "stores/SessionStore"
import { Instance } from "mobx-state-tree"

interface ValitseHOKSProps {
  nimi?: string
  oppijaId: string
  laitosId: string
  suunnitelmat: IHOKS[]
  session: ISessionStore
}

export const ValitseHOKS = observer((props: ValitseHOKSProps) => {
  const { nimi, suunnitelmat, oppijaId, laitosId, session } = props
  const { app } = useContext(AppContext)
  const [paattyneet, voimassaOlevat] = partition<IHOKS>(
    suunnitelmat,
    suunnitelma => !!suunnitelma.paattymispaiva
  )

  const isHoksEditIconVisible = (suunnitelma: Instance<typeof HOKS>) =>
    app === "virkailija" &&
    oppijaId !== "" &&
    suunnitelma.manuaalisyotto &&
    session.hasEditPrivilege === true

  const hoksPath = `/ehoks-virkailija-ui/koulutuksenjarjestaja/${laitosId}/oppija/${oppijaId}/`

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

              {voimassaOlevat.map((suunnitelma, i) => (
                <Suunnitelma
                  hoksPath={hoksPath}
                  suunnitelma={suunnitelma}
                  oppijaId={oppijaId}
                  showEditIcon={isHoksEditIconVisible(suunnitelma)}
                  key={i}
                />
              ))}
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

              {paattyneet.map((suunnitelma, i) => (
                <Suunnitelma
                  hoksPath={hoksPath}
                  suunnitelma={suunnitelma}
                  oppijaId={oppijaId}
                  showEditIcon={isHoksEditIconVisible(suunnitelma)}
                  key={i}
                />
              ))}
            </PaddedContent>
          )}
        </Container>
      </BackgroundContainer>
    </React.Fragment>
  )
})
