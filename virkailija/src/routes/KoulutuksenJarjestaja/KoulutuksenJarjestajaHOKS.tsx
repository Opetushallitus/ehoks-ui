import {
  Link,
  navigate,
  RouteComponentProps,
  Router,
  WindowLocation
} from "@reach/router"
import { Container, PaddedContent } from "components/Container"
import Flag from "components/icons/Flag"
import { NavigationContainer } from "components/NavigationContainer"
import { AiempiOsaaminen } from "components/Opiskelija/AiempiOsaaminen"
import { Opiskelusuunnitelma } from "components/Opiskelija/Opiskelusuunnitelma"
import { Tavoitteet } from "components/Opiskelija/Tavoitteet"
import { ProgressPies } from "components/ProgressPies"
import { BackgroundContainer } from "components/SectionContainer"
import { SectionItem } from "components/SectionItem"
import format from "date-fns/format"
import parseISO from "date-fns/parseISO"
import find from "lodash.find"
import { observer } from "mobx-react"
import { IHOKS } from "models/HOKS"
import React from "react"
import { MdEventNote, MdExtension } from "react-icons/md"
import { FormattedMessage } from "react-intl"
import { IOppija } from "stores/KoulutuksenJarjestajaStore"
import styled from "styled"

const StudentName = styled("h2")`
  margin-top: 0;
`

const NaviContainer = styled(ProgressPies)`
  justify-content: flex-start;
`

const StudentDetails = styled("div")`
  flex: 1;

  h2 {
    font-weight: 400;
    font-size: 28px;
  }
`

const StudentLink = styled(Link)`
  color: ${props => props.theme.colors.waterBlue};
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

export interface HOKSProps {
  suunnitelmat: IHOKS[]
  oppija?: IOppija
  location?: WindowLocation
  hoksId?: string
}

@observer
export class KoulutuksenJarjestajaHOKS extends React.Component<
  HOKSProps & RouteComponentProps
> {
  componentDidMount() {
    const suunnitelma = find(this.props.suunnitelmat, h => {
      return h.eid === this.props.hoksId
    })
    if (suunnitelma) {
      suunnitelma.fetchDetails()
    }
  }

  // TODO: redirect to root after logout, check implementation in src/routes/OmienOpintojenSuunnittelu.tsx
  setActiveTab = (route: string) => () => {
    navigate(route)
  }

  render() {
    const { hoksId, location, suunnitelmat, oppija } = this.props

    const suunnitelma = find(suunnitelmat, h => {
      return h.eid === hoksId
    })

    if (!oppija || !suunnitelma) {
      return null
    }

    return (
      <React.Fragment>
        <NavigationContainer>
          <Container>
            <PaddedContent>
              <NaviContainer>
                <StudentDetails>
                  <StudentName>{oppija && oppija.nimi}</StudentName>

                  <Timestamp>
                    <FormattedMessage
                      id="koulutuksenJarjestaja.opiskelija.hoksPaivamaaratTitle"
                      defaultMessage="HOKS päivämäärät"
                    />
                    :
                  </Timestamp>
                  <Timestamp>
                    <FormattedMessage
                      id="koulutuksenJarjestaja.opiskelija.hyvaksyttyTitle"
                      defaultMessage="Ens. hyväksytty"
                    />
                    &nbsp;{" "}
                    {oppija.hyvaksytty
                      ? format(parseISO(oppija.hyvaksytty), "d.M.yyyy")
                      : "-"}
                  </Timestamp>
                  <Timestamp>
                    <FormattedMessage
                      id="koulutuksenJarjestaja.opiskelija.paivitettyTitle"
                      defaultMessage="Päivitetty"
                    />
                    &nbsp;{" "}
                    {oppija.paivitetty
                      ? format(parseISO(oppija.paivitetty), "d.M.yyyy")
                      : "-"}
                  </Timestamp>
                  {suunnitelmat.length > 1 && (
                    <Timestamp>
                      <StudentLink
                        to={`/ehoks-virkailija-ui/koulutuksenjarjestaja/${
                          oppija.oid
                        }`}
                      >
                        <FormattedMessage
                          id="koulutuksenJarjestaja.opiskelija.naytaKaikkiLink"
                          defaultMessage="Näytä kaikki tämän opiskelijan suunnitelmat"
                        />
                      </StudentLink>
                    </Timestamp>
                  )}
                </StudentDetails>
                <SectionItems>
                  <SectionItem
                    selected={
                      location!.pathname ===
                      `/ehoks-virkailija-ui/koulutuksenjarjestaja/${
                        oppija.oid
                      }/${suunnitelma.eid}`
                    }
                    onClick={this.setActiveTab(
                      `/ehoks-virkailija-ui/koulutuksenjarjestaja/${
                        oppija.oid
                      }/${suunnitelma.eid}`
                    )}
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
                    selected={
                      location!.pathname ===
                      `/ehoks-virkailija-ui/koulutuksenjarjestaja/${
                        oppija.oid
                      }/${suunnitelma.eid}/osaaminen`
                    }
                    onClick={this.setActiveTab(
                      `/ehoks-virkailija-ui/koulutuksenjarjestaja/${
                        oppija.oid
                      }/${suunnitelma.eid}/osaaminen`
                    )}
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
                    selected={
                      location!.pathname ===
                      `/ehoks-virkailija-ui/koulutuksenjarjestaja/${
                        oppija.oid
                      }/${suunnitelma.eid}/opiskelusuunnitelma`
                    }
                    onClick={this.setActiveTab(
                      `/ehoks-virkailija-ui/koulutuksenjarjestaja/${
                        oppija.oid
                      }/${suunnitelma.eid}/opiskelusuunnitelma`
                    )}
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
              <Router
                basepath={`/ehoks-virkailija-ui/koulutuksenjarjestaja/${
                  oppija.oid
                }/${suunnitelma.eid}`}
              >
                <Tavoitteet
                  path="/"
                  student={oppija.henkilotiedot}
                  hoks={suunnitelma}
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
                  studies={
                    suunnitelma ? suunnitelma.aiemminHankitutTutkinnonOsat : []
                  }
                  heading={
                    <FormattedMessage
                      id="koulutuksenJarjestaja.aiempiOsaaminen.title"
                      defaultMessage="Aiempi osaaminen"
                    />
                  }
                />
                <Opiskelusuunnitelma
                  path="opiskelusuunnitelma"
                  plan={suunnitelma}
                  titles={{
                    heading: (
                      <FormattedMessage
                        id="koulutuksenJarjestaja.opiskelusuunnitelma.title"
                        defaultMessage="Opiskelusuunnitelma"
                      />
                    ),
                    goals: (
                      <FormattedMessage
                        id="koulutuksenJarjestaja.opiskelusuunnitelma.tavoitteetTitle"
                        defaultMessage="Opiskelijan tavoitteet ja opintojen eteneminen"
                      />
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
