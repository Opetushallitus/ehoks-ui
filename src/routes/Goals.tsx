import { RouteComponentProps } from "@reach/router"
import { Header } from "components/Header"
import { LinkItem } from "components/LinkItem"
import { css } from "emotion"
import { inject, observer } from "mobx-react"
import { Instance } from "mobx-state-tree"
import React from "react"
import { GoGraph, GoOrganization } from "react-icons/go"
import { RootStore } from "../models/RootStore"

export interface GoalsProps {
  store?: Instance<typeof RootStore>
}

const linkItemStyles = css`
  margin-bottom: 6px;
`

@inject("store")
@observer
export class Goals extends React.Component<GoalsProps & RouteComponentProps> {
  render() {
    // const { store } = this.props
    return (
      <div>
        <Header>Omat tavoitteeni</Header>

        <LinkItem
          className={linkItemStyles}
          title="Osaamisen tiedot ja urasuunnitelma"
          subTitle="Viimeisin palaute 3.5.2018"
          icon={<GoGraph size="24" color="#000" />}
          to="/404"
        />

        <LinkItem
          className={linkItemStyles}
          title="Tehtävät työpaikalla"
          subTitle="Viimeisin palaute 18.4.2018"
          icon={<GoOrganization size="24" color="#000" />}
          to="/404"
        />
      </div>
    )
  }
}
