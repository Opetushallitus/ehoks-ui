import { RouteComponentProps, Router } from "@reach/router"
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
    this.disposeLoginReaction = autorun(() => {
      // navigate to Opintopolku logout url after logging out
      if (!session.isLoggedIn) {
        window.location.href = this.props.store!.environment.opintopolkuLogoutUrl
      }
    })
    store!.hoks.haeSuunnitelmat()
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
