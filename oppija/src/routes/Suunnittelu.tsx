import { navigate, RouteComponentProps, Router } from "@reach/router"
import { autorun, IReactionDisposer } from "mobx"
import { inject, observer } from "mobx-react"
import React from "react"
import { OmienOpintojenSuunnittelu } from "routes/OmienOpintojenSuunnittelu"
import { ValitseHOKS } from "routes/Suunnittelu/ValitseHOKS"
import { IRootStore } from "stores/RootStore"

interface ValitseHOKSProps {
  store?: IRootStore
}

@inject("store")
@observer
export class Suunnittelu extends React.Component<
  ValitseHOKSProps & RouteComponentProps
> {
  disposeLoginReaction: IReactionDisposer
  componentDidMount() {
    const { store } = this.props
    const session = store!.session
    this.disposeLoginReaction = autorun(async () => {
      // navigate to Opintopolku logout url after logging out
      if (!session.isLoggedIn) {
        // check that user did actually logout or there was an error (no session)
        if (session.userDidLogout || session.error) {
          window.location.href = store!.environment.opintopolkuLogoutUrl
        }
        // ensure that SessionStore's checkSession call has finished
      } else if (!session.isLoading && session.user!.oid) {
        await store!.hoks.haeSuunnitelmat(session.user!.oid)
        const suunnitelmat = store!.hoks.suunnitelmat
        // navigate directly to HOKS if there's only one of them
        if (suunnitelmat.length === 1) {
          navigate(`/ehoks/suunnittelu/${suunnitelmat[0].eid}`)
        }
      }
    })
    //
    window.requestAnimationFrame(() => {
      window.scrollTo(0, 0)
    })
  }

  componentWillUnmount() {
    this.disposeLoginReaction()
  }

  render() {
    const store = this.props.store!

    return (
      <Router basepath={`/ehoks/suunnittelu`}>
        <ValitseHOKS path="/" suunnitelmat={store.hoks.suunnitelmat} />
        <OmienOpintojenSuunnittelu
          path=":id/*"
          student={store.session.user}
          suunnitelmat={store.hoks.suunnitelmat}
        />
      </Router>
    )
  }
}
