import { Link, navigate, RouteComponentProps, Router } from "@reach/router"
import { IReactionDisposer, reaction } from "mobx"
import { inject, observer } from "mobx-react"
import React from "react"
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
  color: ${props => props.theme.colors.waterBlue};
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
  /* From router path */
  studentId?: string
}

@inject("store")
@observer
export class Opiskelija extends React.Component<
  OpiskelijaProps & RouteComponentProps
> {
  disposeLoginReaction: IReactionDisposer
  // TODO: redirect to root after logout, check implementation in src/routes/OmienOpintojenSuunnittelu.tsx
  async componentDidMount() {
    const { studentId, store } = this.props
    const { koulutuksenJarjestaja, session } = store!
    const { search } = koulutuksenJarjestaja

    this.disposeLoginReaction = reaction(
      () => {
        return session.isLoggedIn && session.organisations.length > 0
      },
      async hasLoggedIn => {
        if (hasLoggedIn) {
          if (!search.results.length) {
            await search.fetchOppijat()
          }

          if (studentId) {
            const oppija = search.oppija(studentId)
            if (oppija) {
              await oppija.fetchOpiskeluoikeudet()
            }
            this.redirectToOnlyHOKS()
          }
        }
      },
      { fireImmediately: true }
    )
  }

  componentWillUnmount() {
    this.disposeLoginReaction()
  }

  async componentDidUpdate(prevProps: OpiskelijaProps) {
    const { studentId } = this.props
    if (studentId && studentId !== prevProps.studentId) {
      this.redirectToOnlyHOKS()
    }
  }

  redirectToOnlyHOKS = () => {
    const { studentId, store } = this.props
    // navigate directly to HOKS if there's only one of them
    const { search } = store!.koulutuksenJarjestaja
    const oppija = search.oppija(studentId!)
    if (oppija && oppija.suunnitelmat.length === 1) {
      const hoks = oppija.suunnitelmat[0]
      navigate(
        `/ehoks-virkailija-ui/koulutuksenjarjestaja/${studentId}/${hoks.eid}`
      )
    }
  }

  setActiveTab = (route: string) => () => {
    navigate(route)
  }

  render() {
    const { studentId, store } = this.props
    if (!studentId) {
      return null
    }
    const { koulutuksenJarjestaja, session } = store!
    const results = koulutuksenJarjestaja.search.results
    const oppija = koulutuksenJarjestaja.search.oppija(studentId)
    const suunnitelmat = oppija ? oppija.suunnitelmat : []
    const studentIndex = oppija ? results.indexOf(oppija) : -1
    const previous = studentIndex > 0 ? results[studentIndex - 1] : undefined
    const next =
      results.length && studentIndex !== -1 && studentIndex < results.length
        ? results[studentIndex + 1]
        : undefined

    return (
      <React.Fragment>
        <TopContainer>
          <LeftLink>
            {previous && (
              <StudentLink
                to={`/ehoks-virkailija-ui/koulutuksenjarjestaja/${previous.oid}`}
              >
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
              <StudentLink
                to={`/ehoks-virkailija-ui/koulutuksenjarjestaja/${next.oid}`}
              >
                {next.nimi} &gt;&gt;
              </StudentLink>
            )}
          </RightLink>
        </TopContainer>
        <Router
          basepath={`/ehoks-virkailija-ui/koulutuksenjarjestaja/${studentId}`}
        >
          <ValitseHOKS
            path="/"
            oppijaId={studentId}
            nimi={oppija ? oppija.nimi : ""}
            suunnitelmat={suunnitelmat}
            session={session}
          />
          <KoulutuksenJarjestajaHOKS
            path=":hoksId/*"
            suunnitelmat={suunnitelmat}
            oppija={oppija}
          />
        </Router>
      </React.Fragment>
    )
  }
}
