import { Link, RouteComponentProps } from "@reach/router"
import { inject, observer } from "mobx-react"
import { Instance } from "mobx-state-tree"
import * as React from "react"
import { RootStore } from "../models/RootStore"

export interface ProfileProps {
  store?: Instance<typeof RootStore>
}

@inject("store")
@observer
export class Profile extends React.Component<
  ProfileProps & RouteComponentProps
> {
  render() {
    // const { store } = this.props
    return (
      <div>
        <h1>Omat tietoni</h1>

        <Link to="/">Etusivulle</Link>
      </div>
    )
  }
}
