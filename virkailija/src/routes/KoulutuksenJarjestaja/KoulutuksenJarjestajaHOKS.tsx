import {
  Location,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams
} from "react-router"
import { Link } from "react-router-dom"
import { Container, PaddedContent } from "components/Container"
import { HelpPopup } from "components/HelpPopup"
import { HOKSInfo } from "./HOKSInfo"
import Flag from "components/icons/Flag"
import { NavigationContainer } from "components/NavigationContainer"
import { AiempiOsaaminen } from "components/Opiskelija/AiempiOsaaminen"
import { Opiskelusuunnitelma } from "components/Opiskelija/StudyPlan/Opiskelusuunnitelma"
import { Tavoitteet } from "components/Opiskelija/Tavoitteet"
import { ProgressPies } from "components/ProgressPies"
import { BackgroundContainer } from "components/SectionContainer"
import { SectionItem } from "components/SectionItem"
import find from "lodash.find"
import { inject, observer } from "mobx-react"
import { IHOKS } from "models/HOKS"
import React, { useEffect, useState } from "react"
import { MdEventNote, MdExtension } from "react-icons/md"
import { FormattedMessage } from "react-intl"
import { IOppija } from "stores/KoulutuksenJarjestajaStore"
import { IRootStore } from "stores/RootStore"
import styled from "styled"
import { LoadingSpinner } from "components/LoadingSpinner"

const NaviContainer = styled(ProgressPies)`
  justify-content: flex-start;
`
const StudentLink = styled(Link)`
  color: ${(props) => props.theme.colors.green700};
  font-size: 18px;
  font-weight: 400;
`

const SectionItems = styled("div")`
  display: flex;
  flex: 2;
`

const Timestamp = styled("div")`
  font-size: 20px;
  margin-bottom: 10px;
`

const EssentialFactorContainer = styled("div")`
  margin: 10px 20px 20px 20px;
`

const HelpButton = styled(HelpPopup)`
  margin: 0 0 0 20px;
`

const RelativePaddedContent = styled(PaddedContent)`
  position: relative;
`

const Spinner = styled(LoadingSpinner)`
  position: absolute;
  top: 20px;
  right: 20px;
`

export interface KoulutuksenJarjestajaHOKSProps {
  store?: IRootStore
  suunnitelmat: IHOKS[]
  oppija?: IOppija
  laitosId?: string
}

export const KoulutuksenJarjestajaHOKS = inject("store")(
  observer((props: KoulutuksenJarjestajaHOKSProps) => {
    const navigate = useNavigate()
    const location: Location<{
      fromRaportit: boolean
      oppijaoid: string | null
      hokseid: string | null
    }> = useLocation()
    const { hoksId } = useParams()
    const { fromRaportit = false, oppijaoid, hokseid } = location?.state ?? {}
    const { suunnitelmat, oppija, laitosId, store } = props
    const {
      koulutuksenJarjestaja: { search }
    } = store!
    const [loading, setLoading] = useState(false)

    useEffect(() => {
      if (fromRaportit) {
        search.setFromListView(false)
      }
      if (suunnitelmat.length > 0 || fromRaportit) {
        const asyncEffect = async () => {
          setLoading(true)
          let fromRaportitSuunnitelmat: IHOKS[] = []
          if (fromRaportit && oppijaoid) {
            let maybeOppija = search.oppija(oppijaoid)
            if (!maybeOppija) {
              await search.fetchOppija(oppijaoid)
            }
            maybeOppija = search.oppija(oppijaoid)
            fromRaportitSuunnitelmat = maybeOppija
              ? maybeOppija.suunnitelmat
              : []
          }
          const suunnitelma =
            fromRaportitSuunnitelmat.length > 0
              ? find(fromRaportitSuunnitelmat, (h) => h.eid === hokseid)
              : find(suunnitelmat, (h) => h.eid === hoksId)
          if (suunnitelma) {
            await suunnitelma.fetchDetails()
            await suunnitelma.fetchOpiskelijapalauteTilat()
            await suunnitelma.fetchOsaamispisteet()
          }
          setLoading(false)
        }
        asyncEffect()
      }
    }, [search, hoksId, suunnitelmat, fromRaportit, oppijaoid, hokseid])

    // TODO: redirect to root after logout, check implementation in src/routes/OmienOpintojenSuunnittelu.tsx
    const setActiveTab = (route: string) => () => navigate(route)

    const suunnitelmaHoksId =
      location && location.state && location.state.fromRaportit
        ? location.state.hokseid
        : hoksId
    const suunnitelma = find(suunnitelmat, (h) => h.eid === suunnitelmaHoksId)
    if (!oppija || !suunnitelma) {
      return null
    }
    const oppijaPath = `/ehoks-virkailija-ui/koulutuksenjarjestaja/${laitosId}/oppija/${oppija.oid}`
    const hoksPath = `${oppijaPath}/${suunnitelma.eid}`
    const osaamisPath = `${hoksPath}/osaaminen`
    const opsPath = `${hoksPath}/opiskelusuunnitelma`

    return (
      <React.Fragment>
        <NavigationContainer>
          <Container>
            <RelativePaddedContent>
              {loading && <Spinner />}
              {suunnitelmat.length > 1 && (
                <Timestamp>
                  <StudentLink to={oppijaPath}>
                    <FormattedMessage
                      id="koulutuksenJarjestaja.opiskelija.naytaKaikkiLink"
                      defaultMessage="Näytä kaikki tämän opiskelijan suunnitelmat"
                    />
                  </StudentLink>
                </Timestamp>
              )}
              <NaviContainer>
                <HOKSInfo suunnitelma={suunnitelma} oppija={oppija} />
                <SectionItems>
                  <SectionItem
                    selected={location?.pathname === hoksPath}
                    onClick={setActiveTab(hoksPath)}
                    title={
                      <FormattedMessage
                        id="koulutuksenJarjestaja.opiskelija.tavoiteTitle"
                        defaultMessage="Opiskelijan tavoite ja perustiedot"
                      />
                    }
                  >
                    <Flag />
                  </SectionItem>
                  <SectionItem
                    selected={location?.pathname === osaamisPath}
                    onClick={setActiveTab(osaamisPath)}
                    title={
                      <FormattedMessage
                        id="koulutuksenJarjestaja.opiskelija.aiempiOsaaminenTitle"
                        defaultMessage="Aiempi osaaminen"
                      />
                    }
                  >
                    <MdExtension />
                  </SectionItem>
                  <SectionItem
                    selected={location?.pathname === opsPath}
                    onClick={setActiveTab(opsPath)}
                    title={
                      <FormattedMessage
                        id="koulutuksenJarjestaja.opiskelija.opiskelusuunnitelmaTitle"
                        defaultMessage="Opiskelu&shy;suunnitelma"
                      />
                    }
                  >
                    <MdEventNote />
                  </SectionItem>
                </SectionItems>
              </NaviContainer>
            </RelativePaddedContent>
          </Container>
        </NavigationContainer>

        <BackgroundContainer>
          <Container>
            <PaddedContent>
              <Routes>
                <Route
                  index
                  element={
                    <Tavoitteet
                      student={oppija.henkilotiedot}
                      hoks={suunnitelma}
                      showOpiskelijapalaute={!suunnitelma.isTuvaHoks}
                      titles={{
                        heading: (
                          <FormattedMessage
                            id="koulutuksenJarjestaja.tavoite.title"
                            defaultMessage="Opiskelijan tavoite ja perustiedot"
                          />
                        ),
                        goals: (
                          <FormattedMessage
                            id="koulutuksenJarjestaja.tavoite.opiskelijanTavoitteetTitle"
                            defaultMessage="Opiskelijan tavoitteet"
                          />
                        ),
                        personalDetails: (
                          <FormattedMessage
                            id="koulutuksenJarjestaja.tavoite.henkilotiedotTitle"
                            defaultMessage="Henkilötiedot"
                          />
                        )
                      }}
                    />
                  }
                />

                <Route
                  path="osaaminen"
                  element={
                    <AiempiOsaaminen
                      aiemminHankitutTutkinnonOsat={
                        suunnitelma
                          ? suunnitelma.aiemminHankitutTutkinnonOsat
                          : []
                      }
                      heading={
                        <FormattedMessage
                          id="koulutuksenJarjestaja.aiempiOsaaminen.title"
                          defaultMessage="Aiempi osaaminen"
                        />
                      }
                      essentialFactor={
                        <EssentialFactorContainer>
                          <FormattedMessage
                            id="koulutuksenJarjestaja.opiskelusuunnitelma.aiemminHankittuOlennainenSeikkaVirkailijaDescription"
                            defaultMessage="Tämän tutkinnon osan osaamisen tunnistamiseen ja tunnustamiseen liittyy olennaista tietoa. "
                          />
                          <HelpButton
                            helpContent={
                              <FormattedMessage
                                id="koulutuksenJarjestaja.opiskelusuunnitelma.aiemminHankittuOlennainenSeikkaVirkailijaHelpLabel"
                                defaultMessage="Olennainen seikka aputeksti virkailija"
                              />
                            }
                          />
                        </EssentialFactorContainer>
                      }
                    />
                  }
                />

                <Route
                  path="opiskelusuunnitelma"
                  element={
                    <Opiskelusuunnitelma
                      plan={suunnitelma}
                      elements={{
                        heading: (
                          <FormattedMessage
                            id="koulutuksenJarjestaja.opiskelusuunnitelma.title"
                            defaultMessage="Opiskelusuunnitelma"
                          />
                        ),
                        goals: (
                          <FormattedMessage
                            id="koulutuksenJarjestaja.opiskelusuunnitelma.tavoitteetTitle"
                            defaultMessage="Opintojen eteneminen"
                          />
                        ),
                        essentialFactor: (
                          <EssentialFactorContainer>
                            <FormattedMessage
                              id="koulutuksenJarjestaja.opiskelusuunnitelma.olennainenSeikkaDescription"
                              defaultMessage="Tämän tutkinnon osan toteutukseen liittyy olennaista tietoa."
                            />
                            <HelpButton
                              helpContent={
                                <FormattedMessage
                                  id="koulutuksenJarjestaja.opiskelusuunnitelma.olennainenSeikkaHelpLabel"
                                  defaultMessage="Olennainen seikka aputeksti virkailija"
                                />
                              }
                            />
                          </EssentialFactorContainer>
                        )
                      }}
                    />
                  }
                />
              </Routes>
            </PaddedContent>
          </Container>
        </BackgroundContainer>
      </React.Fragment>
    )
  })
)
