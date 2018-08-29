import { RouteComponentProps } from "@reach/router"
import { Header } from "components/Header"
import { inject, observer } from "mobx-react"
import { Instance } from "mobx-state-tree"
import React from "react"
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
        <Header>Omat tietoni</Header>
      </div>
    )
  }
}
