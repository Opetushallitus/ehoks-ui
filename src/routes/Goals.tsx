import { RouteComponentProps } from "@reach/router"
import { Header } from "components/Header"
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
        <Header>Omat tavoitteeni</Header>
      </div>
    )
  }
}
