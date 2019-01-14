import { RouteComponentProps } from "@reach/router"
import { ListContainer } from "components/ListContainer"
import { ListHeading } from "components/ListHeading"
import { inject, observer } from "mobx-react"
import React from "react"
import { GoLightBulb } from "react-icons/go"
import { IRootStore } from "stores/RootStore"
import styled from "styled"

export interface StudyInformationProps {
  store?: IRootStore
}

const StyledListContainer = styled(ListContainer)`
  background-color: #68d1e3;
`

const BulbIcon = styled(GoLightBulb)`
  color: #fff;
`

const StyledListHeading = styled(ListHeading)`
  margin: 0 10px 0 0;
`

@inject("store")
@observer
export class StudyInformation extends React.Component<
  StudyInformationProps & RouteComponentProps
> {
  close = () => console.log("closing")

  render() {
    // const { store } = this.props
    return (
      <div>
        <StyledListContainer>
          <StyledListHeading
            icon={<BulbIcon size="48" />}
            onClose={this.close}
            titleSize="large"
          >
            Opintotietoa
          </StyledListHeading>
        </StyledListContainer>
      </div>
    )
  }
}
