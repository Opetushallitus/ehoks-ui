import { RouteComponentProps } from "@reach/router"
import { Button } from "components/Button"
import { Header } from "components/Header"
import { LinkItem } from "components/LinkItem"
import { ListContainer } from "components/ListContainer"
import { SubHeader } from "components/SubHeader"
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

const listContainerStyles = css`
  background-color: #9b96ff;
`

@inject("store")
@observer
export class Goals extends React.Component<GoalsProps & RouteComponentProps> {
  sendMessage = () => {
    // TODO
  }

  render() {
    // const { store } = this.props
    return (
      <div>
        <Header>Omat tavoitteeni</Header>

        <ListContainer className={listContainerStyles}>
          <SubHeader
            avatar="https://ui-avatars.com/api/?name=Kirsi+Korhonen&size=50"
            title="Kirsi Korhonen"
            subTitle="Ammattiopisto Studentia"
            additionalText="14.4.-25.5.2018"
          />

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

          <Button onClick={this.sendMessage}>
            Lähetä viesti opiskelijalle
          </Button>
        </ListContainer>
      </div>
    )
  }
}
