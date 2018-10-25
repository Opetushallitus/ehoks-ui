import { RouteComponentProps } from "@reach/router"
import { reaction } from "mobx"
import { inject, observer } from "mobx-react"
import React from "react"
import { SignedIn } from "routes/Home/SignedIn"
import { SignedOut } from "routes/Home/SignedOut"
import { IRootStore } from "stores/RootStore"
import styled from "styled"

const Container = styled("div")`
  max-width: ${props => props.theme.maxWidth}px;
  margin: 0 auto;
`

export interface HomeProps {
  store?: IRootStore
  "*"?: string
}

@inject("store")
@observer
export class Home extends React.Component<HomeProps & RouteComponentProps> {
  componentDidMount() {
    const { store } = this.props
    reaction(
      () => store.session.isLoggedIn,
      isLoggedIn => {
        // navigate to Opintopolku logout url after logging out
        if (!isLoggedIn) {
          window.location.href = this.props.store.environment.opintopolkuLogoutUrl
        }
      }
    )
    window.requestAnimationFrame(() => {
      window.scrollTo(0, 0)
    })
  }

  render() {
    const { store } = this.props
    const path = this.props["*"]
    return (
      <Container>
        {store.session.isLoggedIn ? <SignedIn /> : <SignedOut path={path} />}
      </Container>
    )
  }
}
