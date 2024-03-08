import { Link, navigate, RouteComponentProps, Router } from "@reach/router"
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
import get from "lodash.get"
import { IReactionDisposer, reaction } from "mobx"
import { inject, observer } from "mobx-react"
import { IHOKS } from "models/HOKS"
import React from "react"
import { MdEventNote, MdExtension } from "react-icons/md"
import { FormattedMessage } from "react-intl"
import { IOppija } from "stores/KoulutuksenJarjestajaStore"
import { IRootStore } from "stores/RootStore"
import styled from "styled"

const NaviContainer = styled(ProgressPies)`
  justify-content: flex-start;
`
const StudentLink = styled(Link)`
  color: ${props => props.theme.colors.green700};
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

export interface KoulutuksenJarjestajaHOKSProps
  extends RouteComponentProps<{
    location: {
      state: {
        fromRaportit: boolean
        oppijaoid: string | null
        hokseid: string | null
      }
    }
  }> {
  store?: IRootStore
  suunnitelmat: IHOKS[]
  oppija?: IOppija
  /* From router path */
  hoksId?: string
  laitosId?: string
}

@inject("store")
@observer
export class KoulutuksenJarjestajaHOKS extends React.Component<
  KoulutuksenJarjestajaHOKSProps
> {
  disposeReaction: IReactionDisposer
  componentDidMount() {
    const { koulutuksenJarjestaja } = this.props.store!
    const fromRaportit = get(
      this.props,
      "this.props.location.state.fromRaportit"
    )
    if (fromRaportit) {
      koulutuksenJarjestaja.search.setFromListView(false)
    }
    this.disposeReaction = reaction(
      () => this.props.suunnitelmat.length > 0,
      async (hasSuunnitelmat: boolean) => {
        if (hasSuunnitelmat || fromRaportit) {
          const oppijaoid = get(
            this.props,
            "this.props.location.state.oppijaoid"
          )
          const hokseid = get(this.props, "this.props.location.state.hokseid")
          let fromRaportitSuunnitelmat: IHOKS[] = []
          if (fromRaportit && oppijaoid) {
            const oppija = koulutuksenJarjestaja.search.oppija(oppijaoid)
            if (!oppija) {
              await koulutuksenJarjestaja.search.fetchOppija(oppijaoid)
            }
            fromRaportitSuunnitelmat = oppija ? oppija.suunnitelmat : []
          }
          const suunnitelma =
            fromRaportitSuunnitelmat.length > 0
              ? find(fromRaportitSuunnitelmat, h => h.eid === hokseid)
              : find(this.props.suunnitelmat, h => h.eid === this.props.hoksId)
          if (suunnitelma) {
            await suunnitelma.fetchDetails()
            await suunnitelma.fetchOpiskelijapalauteTilat()
            await suunnitelma.fetchOsaamispisteet()
          }
        }
      },
      { fireImmediately: true }
    )
  }

  componentWillUnmount() {
    this.disposeReaction()
  }

  // TODO: redirect to root after logout, check implementation in src/routes/OmienOpintojenSuunnittelu.tsx
  setActiveTab = (route: string) => () => {
    navigate(route)
  }

  render() {
    const { hoksId, location, suunnitelmat, oppija, laitosId } = this.props
    const suunnitelmaHoksId =
      this.props.location &&
      this.props.location.state &&
      this.props.location.state.fromRaportit
        ? this.props.location.state.hokseid
        : hoksId
    const suunnitelma = find(suunnitelmat, h => h.eid === suunnitelmaHoksId)
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
            <PaddedContent>
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
                    onClick={this.setActiveTab(hoksPath)}
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
                    onClick={this.setActiveTab(osaamisPath)}
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
                    onClick={this.setActiveTab(opsPath)}
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
            </PaddedContent>
          </Container>
        </NavigationContainer>

        <BackgroundContainer>
          <Container>
            <PaddedContent>
              <Router basepath={hoksPath}>
                <Tavoitteet
                  path="/"
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
                <AiempiOsaaminen
                  path="osaaminen"
                  aiemminHankitutTutkinnonOsat={
                    suunnitelma ? suunnitelma.aiemminHankitutTutkinnonOsat : []
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
                <Opiskelusuunnitelma
                  path="opiskelusuunnitelma"
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
              </Router>
            </PaddedContent>
          </Container>
        </BackgroundContainer>
      </React.Fragment>
    )
  }
}
