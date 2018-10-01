import { RouteComponentProps } from "@reach/router"
import { reaction } from "mobx"
import { inject, observer } from "mobx-react"
import { Instance } from "mobx-state-tree"
import React from "react"
import styled from "react-emotion"
import { SignedIn } from "routes/Home/SignedIn"
import { SignedOut } from "routes/Home/SignedOut"
import { RootStore } from "stores/RootStore"

const Container = styled("div")`
  max-width: 1160px;
  margin: 0 auto;
`

export interface HomeProps {
  store?: Instance<typeof RootStore>
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
