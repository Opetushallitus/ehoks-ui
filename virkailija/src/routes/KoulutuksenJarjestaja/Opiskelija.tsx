import { Routes, Route } from "react-router"
import { Link } from "react-router-dom"
import { reaction } from "mobx"
import { inject, observer } from "mobx-react"
import React, { useEffect } from "react"
import { FormattedMessage } from "react-intl"
import { IRootStore } from "stores/RootStore"
import styled from "styled"
import { KoulutuksenJarjestajaHOKS } from "./KoulutuksenJarjestajaHOKS"
import { ValitseHOKS } from "./ValitseHOKS"

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
  color: ${props => props.theme.colors.green700};
`

const StudentLink = styled(BackLink)`
  font-size: 20px;
  font-weight: 400;
`

const TopContainer = styled("div")`
  display: flex;
  justify-content: space-between;
  padding: 20px 40px;
`

export interface OpiskelijaProps {
  store?: IRootStore
  // From router path
  orgId?: string
  studentId?: string
}

export const Opiskelija = inject("store")(
  observer((props: OpiskelijaProps) => {
    useEffect(() => {
      const { studentId, store } = props
      const { koulutuksenJarjestaja, session } = store!
      const { search } = koulutuksenJarjestaja

      return () => {
        reaction(
          () => session.isLoggedIn && session.organisations.length > 0,
          async hasLoggedIn => {
            const orgId = props.orgId
            if (orgId && orgId !== session.selectedOrganisationOid) {
              session.changeSelectedOrganisationOid(orgId)
            }

            if (hasLoggedIn) {
              if (!search.results.length) {
                await search.fetchOppijat()
              }

              if (studentId) {
                const maybeOppija = search.oppija(studentId)
                if (!maybeOppija) {
                  await search.fetchOppija(studentId)
                }
                const oppija = search.oppija(studentId)
                if (oppija) {
                  await oppija.fetchOpiskeluoikeudet()
                }
              }
            }
          },
          { fireImmediately: true }
        )
      }
    }, [])

    const { studentId, orgId, store } = props
    if (!studentId) {
      return null
    }
    const { koulutuksenJarjestaja, session } = store!
    const results = koulutuksenJarjestaja.search.results
    const oppija = koulutuksenJarjestaja.search.oppija(studentId)
    const fromListView = koulutuksenJarjestaja.search.fromListView
    const suunnitelmat = oppija ? oppija.suunnitelmat : []
    const studentIndex = oppija ? results.indexOf(oppija) : -1
    const previous = studentIndex > 0 ? results[studentIndex - 1] : undefined
    const next =
      results.length && studentIndex !== -1 && studentIndex + 1 < results.length
        ? results[studentIndex + 1]
        : undefined
    const basePath = `/ehoks-virkailija-ui/koulutuksenjarjestaja/${orgId}/oppija`
    const selfPath = `${basePath}/${studentId}`

    return (
      <React.Fragment>
        {fromListView && (
          <TopContainer>
            <LeftLink>
              {previous && (
                <StudentLink to={`${basePath}/${previous.oid}`}>
                  &lt;&lt; {previous.nimi}
                </StudentLink>
              )}
            </LeftLink>
            <LinkContainer>
              <StudentLink to="/ehoks-virkailija-ui/koulutuksenjarjestaja">
                <FormattedMessage
                  id="koulutuksenJarjestaja.opiskelija.takaisinLink"
                  defaultMessage="Palaa listalle"
                />
              </StudentLink>
            </LinkContainer>
            <RightLink>
              {next && (
                <StudentLink to={`${basePath}/${next.oid}`}>
                  {next.nimi} &gt;&gt;
                </StudentLink>
              )}
            </RightLink>
          </TopContainer>
        )}
        <Routes>
          <Route
            path={`${selfPath}/`}
            element={
              <ValitseHOKS
                oppijaId={studentId}
                laitosId={orgId || "unknown"}
                nimi={oppija?.nimi}
                suunnitelmat={suunnitelmat}
                session={session}
              />
            }
          />
          <Route
            path={`${selfPath}/:hoksId/*`}
            element={
              <KoulutuksenJarjestajaHOKS
                suunnitelmat={suunnitelmat}
                oppija={oppija}
                laitosId={orgId || "unknown"}
              />
            }
          />
        </Routes>
      </React.Fragment>
    )
  })
)
