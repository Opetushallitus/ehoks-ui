import { Link, RouteComponentProps } from "@reach/router"
import { Header } from "components/Header"
import { inject, observer } from "mobx-react"
import { Instance } from "mobx-state-tree"
import React from "react"
import { RootStore } from "../models/RootStore"

export interface StudyInformationProps {
  store?: Instance<typeof RootStore>
}

@inject("store")
@observer
export class StudyInformation extends React.Component<
  StudyInformationProps & RouteComponentProps
> {
  render() {
    // const { store } = this.props
    return (
      <div>
        <Header>Tietoa opinnoista</Header>
      </div>
    )
  }
}
