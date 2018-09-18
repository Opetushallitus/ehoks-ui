import { navigate, RouteComponentProps } from "@reach/router"
import { reaction } from "mobx"
import { inject, observer } from "mobx-react"
import { Instance } from "mobx-state-tree"
import React from "react"
import styled from "react-emotion"
import { SignedIn } from "routes/Home/SignedIn"
import { SignedOut } from "routes/Home/SignedOut"
import { SessionStore } from "stores/SessionStore"
import { injectSession } from "utils"

const Container = styled("div")`
  max-width: 1160px;
  margin: 0 auto;
`

export interface HomeProps {
  session?: Instance<typeof SessionStore>
  "*"?: string
}

@inject(injectSession)
@observer
export class Home extends React.Component<HomeProps & RouteComponentProps> {
  componentDidMount() {
    const { session } = this.props
    reaction(
      () => session.isLoggedIn,
      isLoggedIn => {
        // navigate to root when logging out
        if (!isLoggedIn && this.props.location.pathname !== "/") {
          navigate("/")
        }
      }
    )
  }

  render() {
    const { session } = this.props
    const path = this.props["*"]
    return (
      <Container>
        {session.isLoggedIn ? <SignedIn /> : <SignedOut path={path} />}
      </Container>
    )
  }
}
