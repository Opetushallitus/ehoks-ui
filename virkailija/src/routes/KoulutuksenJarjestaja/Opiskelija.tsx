import { Routes, Route, useParams } from "react-router"
import { Link } from "react-router-dom"
import { inject, observer } from "mobx-react"
import React, { useEffect, useState } from "react"
import { FormattedMessage } from "react-intl"
import { IRootStore } from "stores/RootStore"
import styled from "styled"
import { KoulutuksenJarjestajaHOKS } from "./KoulutuksenJarjestajaHOKS"
import { ValitseHOKS } from "./ValitseHOKS"
import { IOppija } from "../../stores/KoulutuksenJarjestajaStore"
import { LoadingSpinner } from "components/LoadingSpinner"

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

const Spinner = styled(LoadingSpinner)`
  position: absolute;
  right: 0;
  top: 20px;
`

export interface OpiskelijaProps {
  store?: IRootStore
}

export const Opiskelija = inject("store")(
  observer((props: OpiskelijaProps) => {
    const { store } = props
    const { orgId, studentId } = useParams()
    const { koulutuksenJarjestaja, session } = store!
    const { search } = koulutuksenJarjestaja
    const [oppija, setOppija] = useState<IOppija | undefined>(undefined)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
      if (orgId && orgId !== session.selectedOrganisationOid) {
        session.changeSelectedOrganisationOid(orgId)
      }
      if (orgId && session.isLoggedIn && session.organisations.length > 0) {
        const asyncEffect = async () => {
          setLoading(true)
          if (!search.results.length) {
            await search.fetchOppijat()
          }

          if (studentId) {
            const maybeOppija = search.oppija(studentId)
            if (!maybeOppija) {
              await search.fetchOppija(studentId)
            }
            const o = search.oppija(studentId)
            if (o) {
              await o.fetchOpiskeluoikeudet()
              setOppija(o)
            }
          }
          setLoading(false)
        }
        asyncEffect()
      }
    }, [
      search,
      session,
      session.selectedOrganisationOid,
      session.isLoggedIn,
      session.organisations.length,
      studentId,
      orgId
    ])

    if (!studentId) {
      return null
    }
    const results = search.results
    const fromListView = search.fromListView
    const studentIndex = oppija ? results.indexOf(oppija) : -1
    const previous = studentIndex > 0 ? results[studentIndex - 1] : undefined
    const next =
      results.length && studentIndex !== -1 && studentIndex + 1 < results.length
        ? results[studentIndex + 1]
        : undefined
    const basePath = `/ehoks-virkailija-ui/koulutuksenjarjestaja/${orgId}/oppija`

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
        {loading && <Spinner />}
        <Routes>
          <Route
            index
            element={
              <ValitseHOKS
                oppijaId={studentId}
                laitosId={orgId || "unknown"}
                nimi={oppija?.nimi}
                suunnitelmat={oppija?.suunnitelmat ?? []}
                session={session}
              />
            }
          />
          <Route
            path=":hoksId/*"
            element={
              <KoulutuksenJarjestajaHOKS
                suunnitelmat={oppija?.suunnitelmat ?? []}
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
