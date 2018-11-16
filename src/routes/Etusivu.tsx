import { RouteComponentProps } from "@reach/router"
import { reaction } from "mobx"
import { inject, observer } from "mobx-react"
import React from "react"
import { Kirjautumaton } from "routes/Etusivu/Kirjautumaton"
import { OmienOpintojenSuunnittelu } from "routes/Etusivu/OmienOpintojenSuunnittelu"
import { IRootStore } from "stores/RootStore"

export interface EtusivuProps {
  store?: IRootStore
}

@inject("store")
@observer
export class Etusivu extends React.Component<
  EtusivuProps & RouteComponentProps
> {
  componentDidMount() {
    const { store } = this.props
    reaction(
      () => store!.session.isLoggedIn,
      isLoggedIn => {
        // navigate to Opintopolku logout url after logging out
        if (!isLoggedIn) {
          window.location.href = this.props.store!.environment.opintopolkuLogoutUrl
        }
      }
    )
    window.requestAnimationFrame(() => {
      window.scrollTo(0, 0)
    })
  }

  render() {
    const { store } = this.props
    return (
      <React.Fragment>
        {store!.session.isLoggedIn ? (
          <OmienOpintojenSuunnittelu />
        ) : (
          <Kirjautumaton />
        )}
      </React.Fragment>
    )
  }
}
