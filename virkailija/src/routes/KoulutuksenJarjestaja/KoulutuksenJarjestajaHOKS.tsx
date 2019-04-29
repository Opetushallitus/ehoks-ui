import {
  Link,
  Location,
  navigate,
  RouteComponentProps,
  Router
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
import { inject, observer } from "mobx-react"
import React from "react"
import { MdEventNote, MdExtension } from "react-icons/md"
import { FormattedMessage } from "react-intl"
import { IRootStore } from "stores/RootStore"
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
  hoksId?: string
  studentId?: string
  store?: IRootStore
}

@inject("store")
@observer
export class KoulutuksenJarjestajaHOKS extends React.Component<
  HOKSProps & RouteComponentProps
> {
  // TODO: redirect to root after logout, check implementation in src/routes/OmienOpintojenSuunnittelu.tsx
  setActiveTab = (route: string) => () => {
    navigate(route)
  }

  render() {
    const { hoksId, studentId, store } = this.props
    if (!studentId || !hoksId) {
      return null
    }
    const { koulutuksenJarjestaja, hoks } = store!
    const results = koulutuksenJarjestaja.search.sortedResults
    const searchResult = results.find(u => u.id.toString() === studentId)
    const student = koulutuksenJarjestaja.search.studentById(studentId)

    const suunnitelma = find(hoks.suunnitelmat, h => {
      return h.eid === hoksId
    })

    if (!suunnitelma) {
      return null
    }

    return (
      <Location>
        {({ location }) => {
          return (
            <React.Fragment>
              <NavigationContainer>
                <Container>
                  <PaddedContent>
                    <NaviContainer>
                      <StudentDetails>
                        <StudentName>
                          {searchResult && searchResult.nimi}
                        </StudentName>

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
                          {searchResult &&
                            format(
                              parseISO(searchResult.hyvaksytty),
                              "d.M.yyyy"
                            )}
                        </Timestamp>
                        <Timestamp>
                          <FormattedMessage
                            id="koulutuksenJarjestaja.opiskelija.paivitettyTitle"
                            defaultMessage="Päivitetty"
                          />
                          &nbsp;{" "}
                          {searchResult &&
                            format(
                              parseISO(searchResult.paivitetty),
                              "d.M.yyyy"
                            )}
                        </Timestamp>
                        {hoks.suunnitelmat.length > 1 && (
                          <Timestamp>
                            <StudentLink
                              to={`/koulutuksenjarjestaja/${studentId}`}
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
                            location.pathname ===
                            `/koulutuksenjarjestaja/${studentId}/${hoksId}`
                          }
                          onClick={this.setActiveTab(
                            `/koulutuksenjarjestaja/${studentId}/${hoksId}`
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
                            location.pathname ===
                            `/koulutuksenjarjestaja/${studentId}/${hoksId}/osaaminen`
                          }
                          onClick={this.setActiveTab(
                            `/koulutuksenjarjestaja/${studentId}/${hoksId}/osaaminen`
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
                            location.pathname ===
                            `/koulutuksenjarjestaja/${studentId}/${hoksId}/opiskelusuunnitelma`
                          }
                          onClick={this.setActiveTab(
                            `/koulutuksenjarjestaja/${studentId}/${hoksId}/opiskelusuunnitelma`
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
                      basepath={`/koulutuksenjarjestaja/${studentId}/${hoksId}`}
                    >
                      <Tavoitteet
                        path="/"
                        student={student}
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
                          suunnitelma
                            ? suunnitelma.olemassaOlevatTutkinnonOsat
                            : []
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
        }}
      </Location>
    )
  }
}
