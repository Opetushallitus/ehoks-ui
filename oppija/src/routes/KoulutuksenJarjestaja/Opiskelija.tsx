import { Link, Location, navigate, Router } from "@reach/router"
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
import { inject, observer } from "mobx-react"
import React from "react"
import { MdEventNote, MdExtension } from "react-icons/md"
import { FormattedMessage } from "react-intl"
import { IRootStore } from "stores/RootStore"
import styled from "styled"

const LinkContainer = styled("div")`
  flex: 1;
  text-align: center;
`

const LeftLink = styled(LinkContainer)`
  text-align: left;
`

const RightLink = styled(LinkContainer)`
  text-align: right;
`

const BackLink = styled(Link)`
  color: ${props => props.theme.colors.waterBlue};
`

const StudentLink = styled(BackLink)`
  font-size: 20px;
  font-weight: 400;
`

const NaviContainer = styled(ProgressPies)`
  justify-content: flex-start;
`

const TopContainer = styled("div")`
  display: flex;
  justify-content: space-between;
`

const StudentDetails = styled("div")`
  flex: 1;

  h2 {
    font-weight: 400;
    font-size: 28px;
  }
`

const SectionItems = styled("div")`
  display: flex;
  flex: 2;
`

const Timestamp = styled("div")`
  font-size: 20px;
  margin-bottom: 10px;
`

export interface OpiskelijaProps {
  store?: IRootStore
  path?: string
  id?: string
}

@inject("store")
@observer
export class Opiskelija extends React.Component<OpiskelijaProps> {
  // TODO: redirect to root after logout, check implementation in src/routes/OmienOpintojenSuunnittelu.tsx
  componentDidMount() {
    const { id, store } = this.props
    if (id) {
      const suunnitelma = store!.hoks.suunnitelmat.find(s => s.eid === id)
      if (!suunnitelma) {
        store!.hoks.haeSuunnitelmat(store!.session.user!.oid)
      }
    }
  }

  componentDidUpdate(prevProps: OpiskelijaProps) {
    const { id, store } = this.props
    if (id && id !== prevProps.id) {
      const suunnitelma = store!.hoks.suunnitelmat.find(s => s.eid === id)
      if (!suunnitelma) {
        store!.hoks.haeSuunnitelmat(store!.session.user!.oid)
      }
    }
  }

  setActiveTab = (route: string) => () => {
    navigate(route)
  }

  render() {
    const { id, store } = this.props
    if (!id) {
      return null
    }
    const { koulutuksenJarjestaja, hoks } = store!
    const results = koulutuksenJarjestaja.search.sortedResults
    const searchResult = results.find(u => u.id.toString() === id)
    const student = koulutuksenJarjestaja.search.studentById(id)
    const studentIndex = searchResult ? results.indexOf(searchResult) : -1
    const previous = studentIndex > 0 ? results[studentIndex - 1] : null
    const next =
      studentIndex < results.length ? results[studentIndex + 1] : null

    return (
      <Location>
        {({ location }) => {
          return (
            <React.Fragment>
              <NavigationContainer>
                <Container>
                  <PaddedContent>
                    <TopContainer>
                      <LeftLink>
                        {previous && (
                          <StudentLink
                            to={`/ehoks/koulutuksenjarjestaja/${previous.id}`}
                          >
                            &lt;&lt; {previous.nimi}
                          </StudentLink>
                        )}
                      </LeftLink>
                      <LinkContainer>
                        <BackLink to="/ehoks/koulutuksenjarjestaja">
                          <FormattedMessage
                            id="koulutuksenJarjestaja.opiskelija.takaisinLink"
                            defaultMessage="Takaisin opiskelijalistaukseen"
                          />
                        </BackLink>
                      </LinkContainer>
                      <RightLink>
                        {next && (
                          <StudentLink
                            to={`/ehoks/koulutuksenjarjestaja/${next.id}`}
                          >
                            {next.nimi} &gt;&gt;
                          </StudentLink>
                        )}
                      </RightLink>
                    </TopContainer>

                    <NaviContainer>
                      <StudentDetails>
                        <h2>{searchResult && searchResult.nimi}</h2>

                        <Timestamp>
                          <FormattedMessage
                            id="koulutuksenJarjestaja.opiskelija.laadittuTitle"
                            defaultMessage="Laadittu"
                          />
                          &nbsp;{" "}
                          {searchResult &&
                            format(parseISO(searchResult.aloitus), "d.M.yyyy")}
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
                      </StudentDetails>
                      <SectionItems>
                        <SectionItem
                          selected={
                            location.pathname ===
                            `/ehoks/koulutuksenjarjestaja/${id}`
                          }
                          onClick={this.setActiveTab(
                            `/ehoks/koulutuksenjarjestaja/${id}`
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
                            `/ehoks/koulutuksenjarjestaja/${id}/osaaminen`
                          }
                          onClick={this.setActiveTab(
                            `/ehoks/koulutuksenjarjestaja/${id}/osaaminen`
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
                            `/ehoks/koulutuksenjarjestaja/${id}/opiskelusuunnitelma`
                          }
                          onClick={this.setActiveTab(
                            `/ehoks/koulutuksenjarjestaja/${id}/opiskelusuunnitelma`
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
                    <Router basepath={`/ehoks/koulutuksenjarjestaja/${id}`}>
                      <Tavoitteet
                        path="/"
                        student={student}
                        hoks={hoks}
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
                          hoks.suunnitelma
                            ? hoks.suunnitelma.olemassaOlevatTutkinnonOsat
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
                        plan={hoks.suunnitelma}
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
