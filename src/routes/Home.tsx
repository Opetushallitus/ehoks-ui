import { RouteComponentProps } from "@reach/router"

import { inject, observer } from "mobx-react"
import { Instance } from "mobx-state-tree"
import React from "react"
import styled from "react-emotion"
import { SignedIn } from "routes/Home/SignedIn"
import { SignedOut } from "routes/Home/SignedOut"
import { SessionStore } from "stores/SessionStore"
import { injectSession } from "utils"

export interface HomeProps {
  session?: Instance<typeof SessionStore>
}

const Container = styled("div")`
  max-width: 1160px;
  margin: 0 auto;
`

@inject(injectSession)
@observer
export class Home extends React.Component<HomeProps & RouteComponentProps> {
  render() {
    const { session } = this.props
    return (
      <Container>{session.isLoggedIn ? <SignedIn /> : <SignedOut />}</Container>
    )
  }
}
