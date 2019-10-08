import { navigate, RouteComponentProps, Router } from "@reach/router"
import { LoadingSpinner } from "components/LoadingSpinner"
import { IntroModalDialog } from "components/ModalDialogs/IntroModalDialog"
import { comparer, IReactionDisposer, reaction } from "mobx"
import { inject, observer } from "mobx-react"
import React from "react"
import { OmienOpintojenSuunnittelu } from "routes/OmienOpintojenSuunnittelu"
import { ValitseHOKS } from "routes/Suunnittelu/ValitseHOKS"
import { IRootStore } from "stores/RootStore"
import styled from "styled"

const LoadingContainer = styled("div")`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
`

interface ValitseHOKSProps {
  store?: IRootStore
  "*"?: string
}

interface ValitseHOKSState {
  allLoaded: boolean
}

@inject("store")
@observer
export class Suunnittelu extends React.Component<
  ValitseHOKSProps & RouteComponentProps,
  ValitseHOKSState
> {
  state: ValitseHOKSState = {
    allLoaded: false
  }
  disposeLoginReaction: IReactionDisposer
  componentDidMount() {
    const { store, uri } = this.props
    const session = store!.session

    this.disposeLoginReaction = reaction(
      () => {
        return {
          isLoggedIn: session.isLoggedIn,
          userDidLogout: session.userDidLogout,
          error: session.error
        }
      },
      async ({ isLoggedIn, userDidLogout, error }) => {
        // navigate to Opintopolku logout url after logging out
        if (!isLoggedIn) {
          // check that user did actually logout or there was an error (no session)
          if (userDidLogout || error) {
            window.location.href = store!.environment.opintopolkuLogoutUrl
          }
          // ensure that SessionStore's checkSession call has finished
        } else {
          await store!.session.fetchSettings()
          await store!.hoks.haeSuunnitelmat(session.user!.oid)
          this.setState({ allLoaded: true })
          const suunnitelmat = store!.hoks.suunnitelmat
          // navigate directly to HOKS if there's only one of them
          if (
            suunnitelmat.length === 1 &&
            uri === "/ehoks/suunnittelu" &&
            this.props["*"] === ""
          ) {
            navigate(`/ehoks/suunnittelu/${suunnitelmat[0].eid}`, {
              replace: true
            })
          }
        }
      },
      { fireImmediately: true, equals: comparer.structural }
    )
  }

  componentWillUnmount() {
    this.disposeLoginReaction()
  }

  render() {
    const store = this.props.store!

    if (!this.state.allLoaded) {
      return (
        <LoadingContainer>
          <LoadingSpinner />
        </LoadingContainer>
      )
    }

    return (
      <>
        <IntroModalDialog />
        <Router basepath={`/ehoks/suunnittelu`}>
          <ValitseHOKS path="/" suunnitelmat={store.hoks.suunnitelmat} />
          <OmienOpintojenSuunnittelu
            path=":id/*"
            student={store.session.user}
            suunnitelmat={store.hoks.suunnitelmat}
          />
        </Router>
      </>
    )
  }
}
