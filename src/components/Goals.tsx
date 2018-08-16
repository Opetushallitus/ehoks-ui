import { Link, RouteComponentProps } from "@reach/router"
import { inject, observer } from "mobx-react"
import { Instance } from "mobx-state-tree"
import * as React from "react"
import { RootStore } from "../models/RootStore"

export interface GoalsProps {
  store?: Instance<typeof RootStore>
}

@inject("store")
@observer
export class Goals extends React.Component<GoalsProps & RouteComponentProps> {
  render() {
    // const { store } = this.props
    return (
      <div>
        <h1>Omat tavoitteeni</h1>

        <Link to="/">Etusivulle</Link>
      </div>
    )
  }
}
